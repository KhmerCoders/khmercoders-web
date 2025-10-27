import { getSession } from '../session';
import { MainLayout } from '@/components/blocks/layout/MainLayout';
import { getFeed } from '@/server/services/feed';
import { FeedListWithLoadMore } from '@/components/blocks/post/FeedList';
import { Metadata } from 'next';
import { getRandomApprovedShowcase } from '@/server/services/showcase';
import Link from 'next/link';

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

  // Getting the random approved showcase
  const showcase = await getRandomApprovedShowcase();

  return (
    <MainLayout>
      {showcase && (
        <Link
          href={`/showcase/${showcase.alias}`}
          className="p-4 border-b flex gap-4 cursor-pointer"
        >
          <div className="relative aspect-video overflow-hidden rounded-lg shrink-0 size-16">
            <img src={showcase.logo} alt={showcase.title} className="object-cover" />
          </div>
          <div className="flex grow justify-center flex-col">
            <span className="text-xs font-medium text-orange-500">Member Showcase</span>
            <h2 className="font-semibold">{showcase.title}</h2>
            <p className="text-sm text-gray-500 line-clamp-1">{showcase.tagline}</p>
          </div>
          <div className="flex items-center">
            <span className="text-sm p-2 px-4 rounded-full bg-orange-500 text-white">Visit</span>
          </div>
        </Link>
      )}
      <div className="flex flex-col gap-4 lg:p-0">
        <FeedListWithLoadMore initialFeeds={feeds.data} cursor={feeds.pagination.next} />
      </div>
    </MainLayout>
  );
}
