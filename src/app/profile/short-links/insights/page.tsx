'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BarChart2, ArrowLeft, Users, MousePointer } from 'lucide-react';
import { Button } from '@/components/generated/button';
import { Alert, AlertDescription } from '@/components/generated/alert';
import { getLinkInsightsAction } from '@/actions/shortened-links';
import type { LinkInsightData } from '@/actions/shortened-links';
import { ChartContainer } from '@/components/generated/chart';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { format, parseISO } from 'date-fns';

export default function LinkInsightsPage() {
  const params = useParams();
  const router = useRouter();
  const [insights, setInsights] = useState<LinkInsightData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const slug = params.slug as string;

  const chartConfig = useMemo(
    () => ({
      clicks: {
        label: 'Clicks',
        color: '#f97316',
      },
      visitors: {
        label: 'Unique Visitors',
        color: '#2563eb',
      },
    }),
    []
  );

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setIsLoading(true);
        const result = await getLinkInsightsAction(slug);
        if (result.success) {
          setInsights(result.data);
        } else {
          setError(result.message);
        }
      } catch (error) {
        setError('Failed to load insights');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [slug]);

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM d');
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto my-8">
        <div className="text-center">Loading insights...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto my-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const chartData = insights?.dailyInsight.map(item => ({
    date: item.date,
    clicks: item.count,
    visitors: item.unique_visitors,
  }));

  return (
    <div className="container mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Links
        </Button>
      </div>

      <h1 className="text-2xl font-semibold">Link Insights</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Analytics for <code className="bg-muted px-2 py-1 rounded">{`kcc.li/${slug}`}</code> in the
        last 30 days
      </p>

      <div className="flex flex-col gap-4 border rounded-lg my-4 overflow-hidden">
        <div className="bg-zinc-900 border-b flex">
          <div className="bg-background p-4 border-r" style={{ width: 150 }}>
            <h2 className="text-sm font-semibold">Total Clicks</h2>
            <p className="text-3xl">{insights?.totalClicks || 0}</p>
          </div>

          <div className="bg-background p-4 border-r" style={{ width: 150 }}>
            <h2 className="text-sm font-semibold">Unique Visitors</h2>
            <p className="text-3xl">{insights?.uniqueVisitors || 0}</p>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer height={'100%'} width={'100%'}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="clicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="visitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <Area
                type="monotone"
                dataKey="clicks"
                name="Clicks"
                stroke="#f97316"
                fill="url(#clicks)"
                fillOpacity={1}
              />
              <Area
                type="monotone"
                dataKey="visitors"
                name="Unique Visitors"
                stroke="#2563eb"
                fill="url(#visitors)"
                fillOpacity={1}
              />
              <Tooltip
                wrapperClassName="bg-background"
                contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                labelFormatter={label => formatDate(label as string)}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="font-medium mb-4">Top Countries</h3>
          <div className="space-y-3">
            {insights?.countryStats.map(stat => (
              <div key={stat.country} className="flex items-center justify-between">
                <span className="text-sm">{stat.country || 'Unknown'}</span>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">{stat.count}</div>
                  <div className="text-xs text-muted-foreground">
                    ({((stat.count / (insights?.totalClicks || 1)) * 100).toFixed(1)}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border">
          <h3 className="font-medium mb-4">Device Types</h3>
          <div className="space-y-3">
            {insights?.deviceStats.map(stat => (
              <div key={stat.device} className="flex items-center justify-between">
                <span className="text-sm">{stat.device || 'Unknown'}</span>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">{stat.count}</div>
                  <div className="text-xs text-muted-foreground">
                    ({((stat.count / (insights?.totalClicks || 1)) * 100).toFixed(1)}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border md:col-span-2">
          <h3 className="font-medium mb-4">Top Referrers</h3>
          <div className="space-y-3">
            {insights?.referrerStats.map(stat => (
              <div key={stat.referrer} className="flex items-center justify-between">
                <span className="text-sm truncate flex-1">{stat.referrer || 'Direct'}</span>
                <div className="flex items-center gap-2 ml-4">
                  <div className="text-sm text-muted-foreground">{stat.count}</div>
                  <div className="text-xs text-muted-foreground">
                    ({((stat.count / (insights?.totalClicks || 1)) * 100).toFixed(1)}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
