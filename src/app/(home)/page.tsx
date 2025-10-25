import { getSession } from '../session';
import { MainLayout } from '@/components/blocks/layout/MainLayout';
import { getFeed } from '@/server/services/feed';
import { FeedListWithLoadMore } from '@/components/blocks/post/FeedList';
import { Metadata } from 'next';

export const revalidate = 3600; // Cache the page for 3600 seconds (1 hour)

export const metadata: Metadata = {
  title: "Khmer Coders - Cambodia's Largest Coding Community",
  description: "Join Cambodia's largest community of developers, designers, and tech enthusiasts.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
  },
};

export default async function LandingPage() {
  const { session } = await getSession();

  const feeds = await getFeed(
    {
      limit: 20,
      type: session?.user ? 'latest' : 'trend',
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
