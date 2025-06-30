import { getSession } from '@/app/session';
import { getProfileFromUsernameCache } from '@/server/cache/user';
import { ProfileTrackingComponent } from '../tracker';
import { ProfileHeader } from '@/components/profile-header';
import { getDB } from '@/libs/db';
import { ArticlePreviewItem } from '@/components/article-item';

export default async function UserArticleListPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const { session } = await getSession();
  const profile = await getProfileFromUsernameCache(username);

  // Getting all the article
  const db = await getDB();

  const articles = await db.query.article.findMany({
    where: (article, { eq, and }) =>
      profile.user.id === session?.user.id
        ? and(eq(article.userId, profile.user.id))
        : and(eq(article.userId, profile.user.id), eq(article.published, true)),
    columns: {
      id: true,
      title: true,
      summary: true,
      image: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
      published: true,
      userId: true,
    },
    with: {
      user: {
        with: {
          profile: {},
        },
      },
    },
  });

  return (
    <>
      <ProfileTrackingComponent userId={profile.user.id} />
      <ProfileHeader user={profile.user} profile={profile.member_profile} selectedTab="articles" />

      <div className="max-w-4xl mx-auto my-8 mb-12 px-4">
        {articles.map(article => (
          <ArticlePreviewItem key={article.id} data={article} showControlPanel />
        ))}
      </div>
    </>
  );
}
