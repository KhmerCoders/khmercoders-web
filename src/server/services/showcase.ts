import { getDB } from '@/libs/db';
import { ArticleReviewStatus, ShowcaseRecord } from '@/types';
import { produce } from 'immer';

/**
 * Bind like status to a list of showcases for a specific user (optimized batch query)
 */
export async function bindingShowcaseListLikeStatus(
  showcases: ShowcaseRecord[],
  userId?: string
) {
  if (!userId) {
    return showcases;
  }

  const db = await getDB();
  const showcaseIds = showcases.map(showcase => showcase.id);

  if (showcaseIds.length === 0) {
    return showcases;
  }

  const likedShowcases = await db.query.likes.findMany({
    where: (likes, { and, eq, inArray }) =>
      and(
        eq(likes.userId, userId),
        eq(likes.type, 'showcase'),
        inArray(likes.resourceId, showcaseIds)
      ),
    columns: {
      resourceId: true,
    },
  });

  const likedSet = new Set(likedShowcases.map(like => like.resourceId));

  return produce(showcases, draft => {
    for (const showcase of draft) {
      if (showcase.id && likedSet.has(showcase.id)) {
        showcase.hasCurrentUserLiked = true;
      } else {
        showcase.hasCurrentUserLiked = false;
      }
    }
  });
}

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

/**
 * Bind like status to a showcase for a specific user
 */
export async function bindingShowcaseLikeStatus(
  showcase: ShowcaseRecord,
  userId?: string
): Promise<ShowcaseRecord> {
  if (!userId) {
    return showcase;
  }

  const db = await getDB();

  const likedShowcase = await db.query.likes.findFirst({
    where: (likes, { and, eq }) =>
      and(eq(likes.userId, userId), eq(likes.type, 'showcase'), eq(likes.resourceId, showcase.id)),
    columns: {
      resourceId: true,
    },
  });

  showcase.hasCurrentUserLiked = !!likedShowcase;

  return showcase;
}

/**
 * Get showcases for a specific user
 * If the current user is viewing their own profile, show all showcases
 * Otherwise, only show approved showcases
 */
export async function getUserShowcases(targetUserId: string, currentUserId?: string) {
  const db = await getDB();

  let showcases;

  if (currentUserId === targetUserId) {
    // If viewing own profile, show all showcases
    showcases = await db.query.showcase.findMany({
      where: (showcase, { eq }) => eq(showcase.userId, targetUserId),
      orderBy: (showcase, { desc }) => [desc(showcase.likeCount), desc(showcase.createdAt)],
      with: {
        user: true,
      },
    });

    // Bind like status for authenticated user
    showcases = await bindingShowcaseListLikeStatus(showcases, currentUserId);
  } else {
    // If viewing someone else's profile, only show approved showcases
    showcases = await db.query.showcase.findMany({
      where: (showcase, { eq, and }) =>
        and(
          eq(showcase.userId, targetUserId),
          eq(showcase.reviewStatus, ArticleReviewStatus.Approved)
        ),
      orderBy: (showcase, { desc }) => [desc(showcase.likeCount), desc(showcase.createdAt)],
      with: {
        user: true,
      },
    });

    // Bind like status if user is authenticated
    if (currentUserId) {
      showcases = await bindingShowcaseListLikeStatus(showcases, currentUserId);
    }
  }

  return showcases;
}

export async function getRandomApprovedShowcase() {
  const db = await getDB();

  const showcase = await db.query.showcase.findFirst({
    where: (showcase, { eq, and, sql }) =>
      and(
        eq(showcase.reviewStatus, ArticleReviewStatus.Approved),
        sql`coalesce(${showcase.logo}, '') <> ''`
      ),
    orderBy: (_, { sql }) => [sql`RANDOM()`],
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