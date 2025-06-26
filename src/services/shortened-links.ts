import { nanoid } from 'nanoid';
import { z } from 'zod/v4';
import * as schema from '@/libs/db/schema';
import { MainDatabase } from '@/types';
import { eq, desc } from 'drizzle-orm';

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
    where: eq(schema.shortenedLinks.slug, slug),
  });
  return result;
}

export async function getShortenedLinkByUserId(db: MainDatabase, userId: string) {
  const result = await db.query.shortenedLinks.findMany({
    where: eq(schema.shortenedLinks.userId, userId),
    orderBy: desc(schema.shortenedLinks.createdAt),
  });
  return result;
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
      .insert(schema.shortenedLinks)
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

export type ShortenedLink = typeof schema.shortenedLinks.$inferSelect;
