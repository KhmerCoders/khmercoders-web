'use server';
import { withAuthAction } from './middleware';
import * as schema from '@/libs/db/schema';
import { and, eq, sql } from 'drizzle-orm';

/**
 * Action to like an article. Returns the updated like count if successful.
 * If the user has already liked the article, it does nothing and returns the current like count
 *
 * @returns {Promise<number|null>} The updated like count or null if operation failed.
 */
export const likeArticleAction = withAuthAction(async ({ db, user }, articleId: string) => {
  // Check if it is valid article ID
  const article = await db.query.article.findFirst({
    where: eq(schema.article.id, articleId),
  });

  if (!article) {
    throw new Error('Article not found or invalid article ID.');
  }

  const [_, likeStats] = await db.batch([
    db
      .insert(schema.likes)
      .values({
        userId: user.id,
        resourceId: articleId,
        type: 'article',
        createdAt: new Date(),
      })
      .onConflictDoNothing(),
    db
      .update(schema.article)
      .set({
        likeCount: sql`${schema.article.likeCount} + 1`,
      })
      .where(and(eq(schema.article.id, articleId), sql`changes() > 0`))
      .returning({
        count: schema.article.likeCount,
      }),
  ]);

  return likeStats[0]?.count ?? null;
});

export const unlikeArticleAction = withAuthAction(async ({ db, user }, articleId: string) => {
  // Check if it is valid article ID
  const article = await db.query.article.findFirst({
    where: eq(schema.article.id, articleId),
  });

  if (!article) {
    throw new Error('Article not found or invalid article ID.');
  }

  const [_, likeStats] = await db.batch([
    db
      .delete(schema.likes)
      .where(
        and(
          eq(schema.likes.resourceId, articleId),
          eq(schema.likes.userId, user.id),
          eq(schema.likes.type, 'article')
        )
      ),
    db
      .update(schema.article)
      .set({
        likeCount: sql`${schema.article.likeCount} - 1`,
      })
      .where(and(eq(schema.article.id, articleId), sql`changes() > 0`))
      .returning({
        count: schema.article.likeCount,
      }),
  ]);

  return likeStats[0]?.count ?? null;
});

/**
 * Action to like a post. Returns the updated like count if successful.
 * If the user has already liked the post, it does nothing and returns the current like count
 *
 * @returns {Promise<number|null>} The updated like count or null if operation failed.
 */
export const likePostAction = withAuthAction(async ({ db, user }, postId: string) => {
  // Check if it is valid post ID
  const post = await db.query.posts.findFirst({
    where: eq(schema.posts.id, postId),
  });

  if (!post) {
    throw new Error('Post not found or invalid post ID.');
  }

  const [_, likeStats] = await db.batch([
    db
      .insert(schema.likes)
      .values({
        userId: user.id,
        resourceId: postId,
        type: 'post',
        createdAt: new Date(),
      })
      .onConflictDoNothing(),
    db
      .update(schema.posts)
      .set({
        likeCount: sql`${schema.posts.likeCount} + 1`,
      })
      .where(and(eq(schema.posts.id, postId), sql`changes() > 0`))
      .returning({
        count: schema.posts.likeCount,
      }),
  ]);

  return likeStats[0]?.count ?? null;
});

export const unlikePostAction = withAuthAction(async ({ db, user }, postId: string) => {
  // Check if it is valid post ID
  const post = await db.query.posts.findFirst({
    where: eq(schema.posts.id, postId),
  });

  if (!post) {
    throw new Error('Post not found or invalid post ID.');
  }

  const [_, likeStats] = await db.batch([
    db
      .delete(schema.likes)
      .where(
        and(
          eq(schema.likes.resourceId, postId),
          eq(schema.likes.userId, user.id),
          eq(schema.likes.type, 'post')
        )
      ),
    db
      .update(schema.posts)
      .set({
        likeCount: sql`${schema.posts.likeCount} - 1`,
      })
      .where(and(eq(schema.posts.id, postId), sql`changes() > 0`))
      .returning({
        count: schema.posts.likeCount,
      }),
  ]);

  return likeStats[0]?.count ?? null;
});

export const likeShowcaseAction = withAuthAction(async ({ db, user }, showcaseId: string) => {
  // Check if it is valid showcase ID
  const showcase = await db.query.showcase.findFirst({
    where: eq(schema.showcase.id, showcaseId),
  });

  if (!showcase) {
    throw new Error('Showcase not found or invalid showcase ID.');
  }

  const [_, likeStats] = await db.batch([
    db
      .insert(schema.likes)
      .values({
        userId: user.id,
        resourceId: showcaseId,
        type: 'showcase',
        createdAt: new Date(),
      })
      .onConflictDoNothing(),
    db
      .update(schema.showcase)
      .set({
        likeCount: sql`${schema.showcase.likeCount} + 1`,
      })
      .where(and(eq(schema.showcase.id, showcaseId), sql`changes() > 0`))
      .returning({
        count: schema.showcase.likeCount,
      }),
  ]);

  return likeStats[0]?.count ?? null;
});

export const unlikeShowcaseAction = withAuthAction(async ({ db, user }, showcaseId: string) => {
  // Check if it is valid showcase ID
  const showcase = await db.query.showcase.findFirst({
    where: eq(schema.showcase.id, showcaseId),
  });

  if (!showcase) {
    throw new Error('Showcase not found or invalid showcase ID.');
  }

  const [_, likeStats] = await db.batch([
    db
      .delete(schema.likes)
      .where(
        and(
          eq(schema.likes.resourceId, showcaseId),
          eq(schema.likes.userId, user.id),
          eq(schema.likes.type, 'showcase')
        )
      ),
    db
      .update(schema.showcase)
      .set({
        likeCount: sql`${schema.showcase.likeCount} - 1`,
      })
      .where(and(eq(schema.showcase.id, showcaseId), sql`changes() > 0`))
      .returning({
        count: schema.showcase.likeCount,
      }),
  ]);

  return likeStats[0]?.count ?? null;
});