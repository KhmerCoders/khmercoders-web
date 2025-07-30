'use server';
import { ArticleEditorValue } from '@/app/profile/articles/components/ArticleEditor';
import { withAuthAction } from './middleware';
import * as schema from '@/libs/db/schema';
import { eq } from 'drizzle-orm';
import { getMarkdownImageUrls } from '@/utils/markdown';
import { syncUploadsToResource } from '@/server/services/upload';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDB } from '@/libs/db';
import { generateArticleId } from '../generate-id';
import { PostType } from '@/types';

export const createArticleAction = withAuthAction(
  async ({ db, user }, data: ArticleEditorValue) => {
    try {
      let generateIdAllowance = 5;
      let id: string;
      let article = null;

      do {
        id = generateArticleId();

        // Check if ID already exists
        const existingArticle = await db.query.article.findFirst({
          where: (article, { eq }) => eq(article.id, id),
        });

        if (!existingArticle) break;
      } while (--generateIdAllowance > 0);

      if (generateIdAllowance <= 0) {
        throw new Error('Failed to generate a unique article ID after multiple attempts');
      }

      await syncResource(db, user.id, data, id);

      await db.insert(schema.article).values({
        id,
        userId: user.id,
        title: data.title,
        slug: data.slug,
        image: data.image,
        summary: data.summary,
        content: data.content,
        published: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      article = await db.query.article.findFirst({
        where: (article, { eq }) => eq(article.id, id),
      });

      if (!article) {
        throw new Error('Failed to create article after multiple attempts');
      }

      return { success: true, article };
    } catch (e) {
      if (e instanceof Error) {
        return { success: false, error: e.message };
      }
      return { success: false, error: 'Failed to create article' };
    }
  }
);

export const updateArticleAction = withAuthAction(
  async ({ db, user }, id: string, data: ArticleEditorValue) => {
    try {
      const article = await db.query.article.findFirst({
        where: (article, { eq }) => eq(article.id, id),
      });

      if (!article) {
        throw new Error('Article not found');
      }

      if (article.userId !== user.id) {
        throw new Error('You do not have permission to update this article');
      }

      await syncResource(db, user.id, data, id);

      await db
        .update(schema.article)
        .set({
          title: data.title,
          slug: data.slug,
          image: data.image,
          summary: data.summary,
          content: data.content,
          updatedAt: new Date(),
          approvedByAI: false, // Reset AI approval status on update
        })
        .where(eq(schema.article.id, id));

      const updatedArticle = await db.query.article.findFirst({
        where: (article, { eq }) => eq(article.id, id),
      });

      if (!updatedArticle) {
        throw new Error('Failed to update article after multiple attempts');
      }

      if (updatedArticle.published) {
        // Temporary commented out the AI review for now
        // If the article was published, we need to re-review it
        // const { ctx } = getCloudflareContext();
        // ctx.waitUntil(reviewArticle(updatedArticle.id, updatedArticle.title, updatedArticle.content));
      }

      return { success: true, updatedArticle };
    } catch (e) {
      if (e instanceof Error) {
        return { success: false, error: e.message };
      }
      return { success: false, error: 'Failed to update article' };
    }
  }
);

export const updateArticlePublishAction = withAuthAction(
  async ({ db, user }, id: string, publish: boolean) => {
    const article = await db.query.article.findFirst({
      where: (article, { eq }) => eq(article.id, id),
    });

    if (!article) {
      throw new Error('Article not found');
    }

    if (article.userId !== user.id) {
      throw new Error('You do not have permission to update this article');
    }

    await db
      .update(schema.article)
      .set({
        published: publish,
        updatedAt: new Date(),
      })
      .where(eq(schema.article.id, id));

    if (publish) {
      await db
        .insert(schema.posts)
        .values({
          content: '',
          postType: PostType.ArticlePost,
          linkingResourceId: id,
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          id,
        })
        .onConflictDoNothing();
    }

    // Using AI to check if article meet standard before showing in public
    // const { ctx } = getCloudflareContext();
    // if (publish && article.published === false) {
    //   ctx.waitUntil(reviewArticle(article.id, article.title, article.content));
    // }
  }
);

async function reviewArticle(articleId: string, title: string, content: string) {
  const { env } = getCloudflareContext();

  if (!env.AI) {
    console.error('AI environment is not available');
    return false;
  }

  const response = await env.AI.run(
    '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
    {
      messages: [
        {
          role: 'system',
          content: `You are a content moderation AI assistant. Your job is to decide if a given article is suitable for public display on the front page of a developer-focused website. You must return only a single Boolean value: \`true\` if the article meets all criteria, or \`false\` if it fails any.

The article must meet these standards:

- No adult or sexual content
- No hate speech, harassment, or discrimination
- No graphic violence or promotion of illegal activity
- No misinformation or harmful technical/health claims
- No toxic, hostile, or excessively negative tone
- It must also meet basic front-page expectations:
- Must not be a placeholder like “test” or “testing article”
- Must have at least minimal effort or relevance to a developer or general audience
- Informal tone is fine, but spammy, incoherent, or meaningless articles are not allowed

Do not explain your answer. Return only \`true\` or \`false\`.`,
        },
        {
          role: 'user',
          content: `Evaluate the following Markdown article for public front-page publication. Return \`true\` if it meets the quality and content standards, otherwise return \`false\`.

Title: ${title}
Content:
${content}`,
        },
      ],
    },
    {
      gateway: {
        id: 'khmercoders-article-moderator-gw',
      },
    }
  );
  // Check if the response is a ReadableStream (which we can't directly use)
  if (response instanceof ReadableStream) {
    console.warn('Received ReadableStream response which cannot be processed');
    return;
  }

  const responseText = response;

  if (typeof responseText !== 'boolean') {
    console.error('Invalid response from AI service');
    return false;
  }

  const db = await getDB();
  if (responseText) {
    // Update the article to mark it as approved by AI
    await db
      .update(schema.article)
      .set({ approvedByAI: true })
      .where(eq(schema.article.id, articleId));
    return true;
  } else {
    // Update the article to mark it as not approved by AI
    await db
      .update(schema.article)
      .set({ approvedByAI: false })
      .where(eq(schema.article.id, articleId));

    return false;
  }
}

async function syncResource(
  db: DrizzleD1Database<typeof schema>,
  userId: string,
  data: ArticleEditorValue,
  resourceId: string
) {
  const { content } = data;

  const imageURLTable = new Set(
    [...(await getMarkdownImageUrls(content)), data.image]
      .map(url => {
        // Trimming space and tailing slash
        return url.trim().replace(/\/$/, '');
      })
      .filter(Boolean)
  );

  // Getting all the images in the content
  const imageURLs = Array.from(imageURLTable);

  // Getting all the upload ID
  const uploadRecords = await db.query.userUpload.findMany({
    where: (upload, { and, inArray }) =>
      and(inArray(upload.fileUrl, imageURLs), eq(upload.userId, userId)),
  });

  const uploadRecordTable = new Set(uploadRecords.map(upload => upload.fileUrl));

  // Find which image URLs don't have corresponding upload records
  if (uploadRecords.length !== imageURLs.length) {
    const missingImages = imageURLs.filter(url => !uploadRecordTable.has(url));
    throw new Error(
      `The following images are not found in your uploads:\n${missingImages.map(m => `- ${m}`).join('\n')}`
    );
  }

  await syncUploadsToResource(
    userId,
    uploadRecords.map(upload => upload.id),
    'article',
    resourceId
  );
}
