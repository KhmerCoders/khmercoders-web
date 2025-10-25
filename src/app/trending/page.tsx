import { getSession } from '../session';
import { MainLayout } from '@/components/blocks/layout/MainLayout';
import { getFeed } from '@/server/services/feed';
import { FeedListWithLoadMore } from '@/components/blocks/post/FeedList';
import { Metadata } from 'next';

export const revalidate = 3600; // Cache the page for 3600 seconds (1 hour)

export const metadata: Metadata = {
  title: 'Trending | Khmer Coders',
  description: 'Discover trending posts and discussions from the Khmer Coders community.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/trending`,
  },
};

export default async function TrendingPage() {
  const { session } = await getSession();

  const feeds = await getFeed(
    {
      limit: 20,
      type: 'trend',
    },
    session?.user?.id
  );

  return (
    <MainLayout>
      <div className="flex flex-col gap-4 lg:p-0">
        <FeedListWithLoadMore initialFeeds={feeds.data} cursor={feeds.pagination.next} />
      </div>
    </MainLayout>
  );
}
