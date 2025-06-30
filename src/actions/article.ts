'use server';
import { ArticleEditorValue } from '@/app/profile/article/components/ArticleEditor';
import { withAuthAction } from './middleware';
import * as schema from '@/libs/db/schema';
import { eq } from 'drizzle-orm';
import { getMarkdownImageUrls } from '@/utils/markdown';
import { syncUploadsToResource } from '@/services/upload';
import { DrizzleD1Database } from 'drizzle-orm/d1';

export const createArticleAction = withAuthAction(
  async ({ db, user }, data: ArticleEditorValue) => {
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

    return article;
  }
);

export const updateArticleAction = withAuthAction(
  async ({ db, user }, id: string, data: ArticleEditorValue) => {
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
        published: false,
        updatedAt: new Date(),
      })
      .where(eq(schema.article.id, id));

    const updatedArticle = await db.query.article.findFirst({
      where: (article, { eq }) => eq(article.id, id),
    });

    if (!updatedArticle) {
      throw new Error('Failed to update article after multiple attempts');
    }

    return updatedArticle;
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
  }
);

/**
 * Generates a unique random article identifier.
 * The ID is random of number between 10,000,000 and 99,999,999.
 */
function generateArticleId() {
  // Using crypto for cryptographically strong random numbers
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);

  // Scale to our range (10,000,000 to 99,999,999)
  const min = 10000000;
  const max = 99999999;
  const scaled = min + (array[0] % (max - min + 1));

  return scaled.toString();
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

  // Find which image URLs don't have corresponding upload records
  if (uploadRecords.length !== imageURLs.length) {
    const missingImages = imageURLs.filter(url => !imageURLTable.has(url));
    throw new Error(
      `The following images are not found in your uploads: ${missingImages.join(', ')}`
    );
  }

  await syncUploadsToResource(
    userId,
    uploadRecords.map(upload => upload.id),
    'article',
    resourceId
  );
}
