'use server';
import { withAuthAction } from './middleware';
import {
  getShortenedLinkByIdAndUser,
  ShortenedLink,
  ShortenedLinkInput,
  urlSchema,
} from '@/services/shortened-links';
import {
  createShortenedLink,
  getShortenedLinkBySlug,
  getShortenedLinkByUserId,
  updateShortenedLink,
  deleteShortenedLink,
} from '@/services/shortened-links';
import { requestWorkerAnalytic } from './insight';

/**
 * Server action to create a new shortened link for the authenticated user
 */
export const createShortenedLinkAction = withAuthAction(
  async ({ db, user, env }, data: ShortenedLinkInput) => {
    try {
      const validatedData = urlSchema.safeParse(data);
      if (!validatedData.success) {
        return {
          success: false,
          message: 'Invalid link data. Please check your inputs.',
          details: validatedData.error,
        };
      }

      const { slug } = validatedData.data;

      if (slug) {
        const existingLink = await getShortenedLinkBySlug(db, slug, {
          includeDeleted: true,
        });
        if (existingLink) {
          return {
            success: false,
            message: 'This custom URL is already taken.',
          };
        }
      }

      const result = await createShortenedLink(
        db,
        {
          ...validatedData.data,
        },
        { KV: env.KV, user }
      );

      return {
        success: true,
        message: 'Shortened link created successfully.',
        data: result,
      };
    } catch (error) {
      console.error('Failed to create shortened link:', error);
      return {
        success: false,
        message: 'Failed to create shortened link. Please try again later.',
      };
    }
  }
);

type GetUserShortenedLinksActionReturn =
  | {
      success: true;
      data: ShortenedLink[];
    }
  | {
      success: false;
      message: string;
      data: ShortenedLink[];
    };

/**
 * Server action to get all shortened links for the authenticated user
 */
export const getUserShortenedLinksAction = withAuthAction<[], GetUserShortenedLinksActionReturn>(
  async ({ db, user }) => {
    try {
      const links = await getShortenedLinkByUserId(db, user.id);

      return {
        success: true,
        data: links,
      };
    } catch (error) {
      console.error('Failed to fetch shortened links:', error);
      return {
        success: false,
        message: 'Failed to fetch shortened links. Please try again later.',
        data: [],
      };
    }
  }
);

export type LinkInsightData = {
  dailyInsight: {
    date: string;
    count: number;
    unique_visitors: number;
  }[];
  totalClicks: number;
  uniqueVisitors: number;
  countryStats: { country: string; count: number }[];
  deviceStats: { device: string; count: number }[];
  referrerStats: { referrer: string; count: number }[];
};

export type GetLinkInsightsReturn =
  | {
      success: true;
      data: LinkInsightData;
    }
  | {
      success: false;
      message: string;
    };

/**
 * Server action to get analytics insights for a specific shortened link
 */
export const getLinkInsightsAction = withAuthAction<[string], GetLinkInsightsReturn>(
  async ({}, slug: string) => {
    try {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const last30Days = currentTimestamp - 29 * 24 * 60 * 60 - (currentTimestamp % 86400);

      // Get daily stats
      const rawDailyInsights =
        (await requestWorkerAnalytic<{
          date: string;
          count: number;
          unique_visitors: number;
        }>(`
        SELECT 
          formatDateTime(timestamp, '%Y-%m-%d') as "date",
          COUNT(*) as "count",
          COUNT(DISTINCT blob4) as "unique_visitors"
        FROM shortlink_analytics
        WHERE 
          index1 = '${slug}' AND
          toUnixTimestamp(timestamp) BETWEEN ${last30Days} AND ${currentTimestamp}
        GROUP BY "date"
        ORDER BY "date" ASC
      `)) || [];

      // Create daily insights with zero-filled missing dates
      const dailyInsight = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(last30Days * 1000 + i * 86400 * 1000);
        const dateString = date.toISOString().split('T')[0];
        const existingData = rawDailyInsights.find(item => item.date === dateString);

        return {
          date: dateString,
          count: existingData?.count ?? 0,
          unique_visitors: existingData?.unique_visitors ?? 0,
        };
      });

      // Get analytics data in parallel
      const [overallStats, countryStats, deviceStats, referrerStats] = await Promise.all([
        requestWorkerAnalytic<{ total_clicks: number; unique_visitors: number }>(`
          SELECT 
            COUNT(*) as total_clicks,
            COUNT(DISTINCT blob4) as unique_visitors
          FROM shortlink_analytics
          WHERE 
            index1 = '${slug}' AND
            toUnixTimestamp(timestamp) BETWEEN ${last30Days} AND ${currentTimestamp}
        `),
        requestWorkerAnalytic<{ country: string; count: number }>(`
          SELECT 
            COALESCE(blob2, 'unknown') as country,
            COUNT(*) as count
          FROM shortlink_analytics
          WHERE 
            index1 = '${slug}' AND
            toUnixTimestamp(timestamp) BETWEEN ${last30Days} AND ${currentTimestamp}
          GROUP BY country
          ORDER BY count DESC
          LIMIT 10
        `),
        requestWorkerAnalytic<{ device: string; count: number }>(`
          SELECT 
            COALESCE(blob3, 'unknown') as device,
            COUNT(*) as count
          FROM shortlink_analytics
          WHERE 
            index1 = '${slug}' AND
            toUnixTimestamp(timestamp) BETWEEN ${last30Days} AND ${currentTimestamp}
          GROUP BY device
          ORDER BY count DESC
        `),
        requestWorkerAnalytic<{ referrer: string; count: number }>(`
          SELECT 
            COALESCE(blob5, 'unknown') as referrer,
            COUNT(*) as count
          FROM shortlink_analytics
          WHERE 
            index1 = '${slug}' AND
            toUnixTimestamp(timestamp) BETWEEN ${last30Days} AND ${currentTimestamp}
          GROUP BY referrer
          ORDER BY count DESC
          LIMIT 10
        `),
      ]);

      const stats = (overallStats || [])[0] || { total_clicks: 0, unique_visitors: 0 };

      return {
        success: true,
        data: {
          dailyInsight,
          totalClicks: stats.total_clicks,
          uniqueVisitors: stats.unique_visitors,
          countryStats: (countryStats || []).map(stat => ({
            country: stat.country || 'Unknown',
            count: stat.count || 0,
          })),
          deviceStats: (deviceStats || []).map(stat => ({
            device: stat.device || 'Unknown',
            count: stat.count || 0,
          })),
          referrerStats: (referrerStats || []).map(stat => ({
            referrer: stat.referrer || 'Direct',
            count: stat.count || 0,
          })),
        },
      };
    } catch (error) {
      console.error('Failed to fetch link insights:', error);
      return {
        success: false,
        message: 'Failed to fetch link insights. Please try again later.',
      };
    }
  }
);

/**
 * Server action to update an existing shortened link
 */
export const updateShortenedLinkAction = withAuthAction(
  async ({ db, user, env }, id: string, data: ShortenedLinkInput) => {
    try {
      const validatedData = urlSchema.safeParse(data);
      if (!validatedData.success) {
        return {
          success: false,
          message: 'Invalid link data. Please check your inputs.',
          details: validatedData.error,
        };
      }

      // Check if the link exists and belongs to the user
      const existingLink = await getShortenedLinkByIdAndUser(db, id, user.id);

      if (!existingLink) {
        return {
          success: false,
          message: "Link not found or you don't have permission to edit it.",
        };
      }

      const result = await updateShortenedLink(
        db,
        id,
        { url: validatedData.data.url },
        { KV: env.KV }
      );

      return {
        success: true,
        message: 'Shortened link updated successfully.',
        data: result,
      };
    } catch (error) {
      console.error('Failed to update shortened link:', error);
      return {
        success: false,
        message: 'Failed to update shortened link. Please try again later.',
      };
    }
  }
);

/**
 * Server action to delete a shortened link
 */
export const deleteShortenedLinkAction = withAuthAction(async ({ db, user, env }, id: string) => {
  try {
    // Check if the link exists and belongs to the user
    const existingLink = await getShortenedLinkByIdAndUser(db, id, user.id);

    if (!existingLink) {
      return {
        success: false,
        message: "Link not found or you don't have permission to delete it.",
      };
    }

    const result = await deleteShortenedLink(db, id, { KV: env.KV });

    return {
      success: true,
      message: 'Shortened link deleted successfully.',
      data: result,
    };
  } catch (error) {
    console.error('Failed to delete shortened link:', error);
    return {
      success: false,
      message: 'Failed to delete shortened link. Please try again later.',
    };
  }
});
