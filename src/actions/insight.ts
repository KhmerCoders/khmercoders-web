'use server';
import { withAuthAction } from './middleware';

export interface ProfileInsight {
  dailyInsight: {
    date: string;
    count: number;
    unique_visitor: number;
  }[];
  totalInsight: {
    count: number;
    unique_visitor: number;
  };
}

export const getCurrentProfileInsightAction = withAuthAction(async ({ user }) => {
  const userId = user.id; // ?? session.user.id;

  // Getting the last 30 days of insights
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const last30DaysTimestamp = currentTimestamp - 29 * 24 * 60 * 60;

  // Round to the start of the day (midnight)
  const last30Days = last30DaysTimestamp - (last30DaysTimestamp % 86400);

  const dailyInsight = await requestWorkerAnalytic<{
    date: string;
    count: number;
    unique_visitor: number;
  }>(`
      select
        formatDateTime(timestamp, '%Y-%m-%d') as "date",
        count() as "count",
        count(DISTINCT blob4) AS "unique_visitor"
      from profile_analytics 
        where index1 = '${userId}' and
        toUnixTimestamp(timestamp) between ${last30Days} AND ${currentTimestamp}
      group by "date"
      order by "date" asc
    `);

  // Filling the hole date with 0 count and unique visitor
  const dailyInsightMap: Record<string, { count: number; unique_visitor: number }> = {};
  dailyInsight.forEach(item => {
    dailyInsightMap[item.date] = {
      count: item.count,
      unique_visitor: item.unique_visitor,
    };
  });

  const dailyInsightFilled: {
    date: string;
    count: number;
    unique_visitor: number;
  }[] = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(last30Days * 1000 + i * 86400 * 1000);
    const dateString = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    if (dailyInsightMap[dateString]) {
      dailyInsightFilled.push({
        date: dateString,
        count: dailyInsightMap[dateString].count,
        unique_visitor: dailyInsightMap[dateString].unique_visitor,
      });
    } else {
      dailyInsightFilled.push({
        date: dateString,
        count: 0,
        unique_visitor: 0,
      });
    }
  }

  const totalInsight = await requestWorkerAnalytic<{
    count: number;
    unique_visitor: number;
  }>(
    `
      select
        count() as "count",
        count(DISTINCT blob4) AS "unique_visitor"
      from profile_analytics 
        where index1 = '${userId}' and
        toUnixTimestamp(timestamp) between ${last30Days} AND ${currentTimestamp}
    `
  );

  return {
    dailyInsight: dailyInsightFilled,
    totalInsight: totalInsight[0] || { count: 0, unique_visitor: 0 },
  };
});

export async function requestWorkerAnalytic<T>(query: string): Promise<T[]> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.ACCOUNT_ID}/analytics_engine/sql`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WAE_TOKEN}`,
      },
      body: query,
    }
  );

  const result = (await response.json()) as { data: T[] };
  return result.data;
}
