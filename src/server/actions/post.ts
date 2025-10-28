'use server';

import { PostableResourceType, PostRecordWithProfile } from '@/types';
import { withAuthAction, withOptionalAuthAction } from './middleware';
import * as schema from './../../libs/db/schema';
import { generatePostId } from '../generate-id';
import { eq, sql, inArray } from 'drizzle-orm';

const POST_CHARACTER_LIMIT = 300; // Define a character limit for posts

export const createPostAction = withAuthAction(
  async (
    { db, user },
    resourceType: PostableResourceType,
    resourceId: string | null,
    content: string
  ): Promise<{ success: boolean; result?: PostRecordWithProfile; error?: string }> => {
    if (!content || content.trim() === '') {
      return {
        success: false,
        error: 'Content cannot be empty',
      };
    }

    if (content.length > POST_CHARACTER_LIMIT) {
      return {
        success: false,
        error: `Content exceeds the limit of ${POST_CHARACTER_LIMIT} characters`,
      };
    }

    let increaseCommentOperation;

    // Validate based on resource type
    if (resourceType === 'article' && resourceId) {
      // Check if the article exists
      const resource = await db.query.article.findFirst({
        where: (article, { eq }) => eq(article.id, resourceId),
      });

      if (!resource) {
        return {
          success: false,
          error: 'Article not found',
        };
      }

      increaseCommentOperation = db
        .update(schema.article)
        .set({
          commentCount: sql`${schema.article.commentCount} + 1`,
        })
        .where(eq(schema.article.id, resourceId));
    } else {
      return {
        success: false,
        error: 'Invalid resource type',
      };
    }

    const postId = generatePostId();

    await db.batch([
      db.insert(schema.posts).values({
        content,
        resourceType,
        resourceId,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: postId,
      }),
      increaseCommentOperation,
    ]);

    const post = await db.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, postId),
      with: {
        user: {
          with: {
            profile: true,
          },
        },
      },
    });

    if (!post) {
      return {
        success: false,
        error: 'Failed to create post',
      };
    }

    return {
      success: true,
      result: post,
    };
  }
);

export const createReplyAction = withAuthAction(
  async (
    { db, user },
    parentPostId: string,
    content: string
  ): Promise<{ success: boolean; result?: PostRecordWithProfile; error?: string }> => {
    if (!content || content.trim() === '') {
      return {
        success: false,
        error: 'Reply content cannot be empty',
      };
    }

    if (content.length > POST_CHARACTER_LIMIT) {
      return {
        success: false,
        error: `Reply content exceeds the limit of ${POST_CHARACTER_LIMIT} characters`,
      };
    }

    // Check if parent post exists
    const parentPost = await db.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, parentPostId),
    });

    if (!parentPost) {
      return {
        success: false,
        error: 'Parent post not found',
      };
    }

    const replyId = generatePostId();

    // Create the reply and increment reply count on parent post
    await db.batch([
      db.insert(schema.posts).values({
        id: replyId,
        userId: user.id,
        content,
        parentPostId,
        resourceType: 'post',
        resourceId: null,
        likeCount: 0,
        commentCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      db
        .update(schema.posts)
        .set({
          commentCount: sql`${schema.posts.commentCount} + 1`,
        })
        .where(eq(schema.posts.id, parentPostId)),
    ]);

    const reply = await db.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, replyId),
      with: {
        user: {
          with: {
            profile: true,
          },
        },
      },
    });

    if (!reply) {
      return {
        success: false,
        error: 'Failed to create reply',
      };
    }

    return {
      success: true,
      result: reply,
    };
  }
);

export const getRepliesAction = withOptionalAuthAction(
  async (
    { db },
    parentPostId: string
  ): Promise<{ success: boolean; data?: PostRecordWithProfile[]; error?: string }> => {
    try {
      const replies = await db.query.posts.findMany({
        where: (posts, { eq }) => eq(posts.parentPostId, parentPostId),
        with: {
          user: {
            with: {
              profile: true,
            },
          },
        },
        orderBy: (posts, { asc }) => [asc(posts.createdAt)],
      });

      return {
        success: true,
        data: replies as PostRecordWithProfile[],
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch replies',
      };
    }
  }
);

/**
 * Moderation hook: Check if a post/reply violates community guidelines
 * This can be extended with AI moderation, keyword filtering, etc.
 * Returns true if content is acceptable, false if it should be flagged.
 */
function checkContentModeration(content: string): {
  approved: boolean;
  reason?: string;
} {
  // Basic moderation checks
  if (content.trim().length === 0) {
    return { approved: false, reason: 'Content cannot be empty' };
  }

  if (content.length > POST_CHARACTER_LIMIT) {
    return { approved: false, reason: `Content exceeds ${POST_CHARACTER_LIMIT} characters` };
  }

  // TODO: Add AI moderation, spam detection, keyword filtering
  // For now, all content passes basic checks
  return { approved: true };
}

/**
 * Delete a reply/comment and its nested replies recursively
 */
export const deleteReplyAction = withAuthAction(
  async ({ db, user }, postId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Check if user owns the post or is moderator
      const post = await db.query.posts.findFirst({
        where: (posts, { eq }) => eq(posts.id, postId),
      });

      if (!post) {
        return { success: false, error: 'Post not found' };
      }

      if (post.userId !== user.id) {
        // TODO: Check if user is moderator
        return { success: false, error: 'Unauthorized' };
      }

      // Recursively delete all nested replies
      const deleteAllNestedReplies = async (parentId: string) => {
        const nestedReplies = await db.query.posts.findMany({
          where: (posts, { eq }) => eq(posts.parentPostId, parentId),
        });

        for (const reply of nestedReplies) {
          await deleteAllNestedReplies(reply.id);
        }

        if (nestedReplies.length > 0) {
          await db.delete(schema.posts).where(
            inArray(
              schema.posts.id,
              nestedReplies.map(r => r.id)
            )
          );
        }
      };

      await deleteAllNestedReplies(postId);

      // Delete the post itself
      await db.delete(schema.posts).where(eq(schema.posts.id, postId));

      // Decrement parent's comment count if this is a reply
      if (post.parentPostId) {
        await db
          .update(schema.posts)
          .set({
            commentCount: sql`${schema.posts.commentCount} - 1`,
          })
          .where(eq(schema.posts.id, post.parentPostId));
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete reply' };
    }
  }
);
