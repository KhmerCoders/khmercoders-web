import { getSession } from '@/app/session';
import { getDB } from '@/libs/db';
import { notFound } from 'next/navigation';
import { ArticleEditClientPage } from './page-client';

export default async function ArticleEditPage({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const { articleId } = await params;
  const { session } = await getSession();
  const db = await getDB();

  if (!session) {
    notFound();
  }

  const article = await db.query.article.findFirst({
    where: (article, { eq, and }) =>
      and(eq(article.userId, session.user.id), eq(article.id, articleId)),
    with: {
      user: {
        with: {
          profile: {},
        },
      },
    },
  });

  if (!article) {
    notFound();
  }

  return <ArticleEditClientPage data={article} />;
}
