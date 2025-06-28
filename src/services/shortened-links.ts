import { nanoid } from 'nanoid';
import { z } from 'zod/v4';
import { MainDatabase } from '@/types';
import { eq, desc, and, isNull } from 'drizzle-orm';
import { shortenedLinks } from '@/libs/db/schema';

// IETF RFC 3986 Section 2.3:
// "Characters that are allowed in a URI but do not have a reserved
// purpose are called unreserved. These include uppercase and
// lowercase letters, decimal digits, hyphen, period, underscore, and tilde."
export const VALID_SLUG_PATTERN = /^[a-zA-Z0-9-_]+$/;
export const VALID_SLUG_MESSAGE = 'Slug can only contain letters, numbers, hyphens and underscores';

export const urlSchema = z.object({
  url: z.url({
    protocol: /^https?$/,
    hostname: z.regexes.domain,
  }),
  slug: z
    .string()
    .optional()
    .transform(e => e || undefined)
    .pipe(
      z
        .string()
        .min(3)
        .max(32)
        .regex(VALID_SLUG_PATTERN, {
          message: VALID_SLUG_MESSAGE,
        })
        .optional()
    ),
});

export type ShortenedLinkInput = z.infer<typeof urlSchema>;

export type CreateShortenedLinkInput = z.infer<typeof urlSchema>;

export async function getShortenedLinkBySlug(db: MainDatabase, slug: string) {
  const result = await db.query.shortenedLinks.findFirst({
    where: and(eq(shortenedLinks.slug, slug), isNull(shortenedLinks.deletedAt)),
  });
  return result;
}

export async function getShortenedLinkByUserId(db: MainDatabase, userId: string) {
  const result = await db.query.shortenedLinks.findMany({
    where: and(eq(shortenedLinks.userId, userId), isNull(shortenedLinks.deletedAt)),
    orderBy: desc(shortenedLinks.createdAt),
  });
  return result;
}

export async function getShortenedLinkByIdAndUser(
  db: MainDatabase,
  id: string,
  userId: string,
  includeDeleted = false
) {
  return await db.query.shortenedLinks.findFirst({
    where: and(
      eq(shortenedLinks.id, id),
      eq(shortenedLinks.userId, userId),
      includeDeleted ? undefined : isNull(shortenedLinks.deletedAt)
    ),
  });
}

type NewShortenedLink = CreateShortenedLinkInput & { userId: string };

export async function createShortenedLink(
  db: MainDatabase,
  input: NewShortenedLink,
  env: { KV: KVNamespace }
) {
  const { url, slug, userId } = input;
  const shortId = nanoid(10);
  const finalSlug = slug ?? shortId;

  return await db.transaction(async tx => {
    const [result] = await tx
      .insert(shortenedLinks)
      .values({
        id: shortId,
        originalUrl: url,
        slug: finalSlug,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    await env.KV.put(finalSlug, url);

    return result;
  });
}

/**
 * Known issue: Not Atomic, Probably Will fixed later
 * does env.KV.put(link.slug, input.url); even throw if it fails to update?
 * when using transaction,will give the following error:
 * Failed to update shortened link
 * Error: D1_ERROR: To execute a transaction, please use the state.storage.transaction()
 * or state.storage.transactionSync() APIs instead of the SQL BEGIN TRANSACTION or
 * SAVEPOINT statements. The JavaScript API is safer because it will automatically
 * roll back on exceptions, and because it interacts correctly with Durable Objects'
 * automatic atomic write coalescing.
 */

export async function updateShortenedLink(
  db: MainDatabase,
  id: string,
  input: { url: string },
  env: { KV: KVNamespace }
) {
  const [link] = await db
    .update(shortenedLinks)
    .set({
      originalUrl: input.url,
      updatedAt: new Date(),
    })
    .where(eq(shortenedLinks.id, id))
    .returning();

  if (link) {
    await env.KV.put(link.slug, input.url);
  }

  return link;
}

export async function deleteShortenedLink(db: MainDatabase, id: string, env: { KV: KVNamespace }) {
  const [link] = await db
    .update(shortenedLinks)
    .set({
      deletedAt: new Date(),
    })
    .where(eq(shortenedLinks.id, id))
    .returning();

  if (link) {
    // Remove from KV store
    await env.KV.delete(link.slug);
  }

  return link;
}

export type ShortenedLink = typeof shortenedLinks.$inferSelect;
