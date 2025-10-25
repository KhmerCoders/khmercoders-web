import { getChatMetrics, getUserLeaderboard } from '@/libs/db/chatbot';
import { Metadata } from 'next';
import { ChatMetricsChart } from '@/app/community/chat-metrics-chart';
import { UserLeaderboardComponent } from '@/app/community/user-leaderboard';
import { ClientOnly } from '@/components/atoms/client-only';
import { MainLayout } from '@/components/blocks/layout/MainLayout';
import { StackNavigation } from '@/components/blocks/layout/StackNavigation';
import { MessageSquareShare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Community Metrics | Khmer Coders',
  description: 'Engagement metrics for the Khmer Coders community on Telegram and Discord',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/community`,
  },
};

export default async function CommunityPage() {
  const [chatMetrics, userLeaderboard] = await Promise.all([
    getChatMetrics(),
    getUserLeaderboard(30), // Get top 10 users
  ]);

  return (
    <MainLayout>
      <StackNavigation title="Chatroom" icon={MessageSquareShare} />
      <div>
        <p className="p-4 text-sm">
          Metrics showing activity in our Telegram and Discord communities over the last 30 days.
        </p>
        <ClientOnly>
          <ChatMetricsChart data={chatMetrics} />
        </ClientOnly>
        <UserLeaderboardComponent data={userLeaderboard} />
      </div>
    </MainLayout>
  );
}
