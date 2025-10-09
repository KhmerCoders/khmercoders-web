import { getDB } from '@/libs/db';
import { eq, desc, or } from 'drizzle-orm';
import { ArticleReviewStatus } from '@/types';

/**
 * Get a showcase by its alias with user and profile information
 */
export async function getShowcaseByAlias(alias: string) {
  const db = await getDB();

  const showcase = await db.query.showcase.findFirst({
    where: (showcase, { eq }) => eq(showcase.alias, alias),
    with: {
      user: {
        with: {
          profile: true,
        },
      },
    },
  });

  return showcase;
}

/**
 * Get all approved showcases, optionally including user's own showcases
 */
export async function getApprovedShowcases(userId?: string) {
  const db = await getDB();

  if (userId) {
    // Get approved showcases OR user's own showcases
    return await db.query.showcase.findMany({
      where: (showcase, { eq, or }) =>
        or(eq(showcase.reviewStatus, ArticleReviewStatus.Approved), eq(showcase.userId, userId)),
      orderBy: (showcase, { desc }) => [desc(showcase.createdAt)],
    });
  } else {
    // For unauthenticated users, only get approved showcases
    return await db.query.showcase.findMany({
      where: (showcase, { eq }) => eq(showcase.reviewStatus, ArticleReviewStatus.Approved),
      orderBy: (showcase, { desc }) => [desc(showcase.createdAt)],
    });
  }
}
