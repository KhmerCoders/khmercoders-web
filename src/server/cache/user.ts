import { getDB } from '@/libs/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import * as schema from '@/libs/db/schema';

export const getProfileFromUsernameCache = cache(async (username: string) => {
  const db = await getDB();

  if (username.substring(0, 3) !== '%40') {
    return notFound();
  }

  const normalizedUsername = username.substring(3).toLowerCase();

  const profile = await db
    .select()
    .from(schema.memberProfile)
    .innerJoin(schema.user, eq(schema.memberProfile.userId, schema.user.id))
    .where(eq(schema.memberProfile.alias, normalizedUsername))
    .get();

  if (!profile) {
    return notFound();
  }

  return profile;
});
