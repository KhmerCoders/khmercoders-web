import * as schema from '@/libs/db/schema';
import { withOptionalApiAuth } from '../../../middleware';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export const GET = withOptionalApiAuth(
  async (req: NextRequest, { db }, { params }: { params: Promise<{ alias: string }> }) => {
    if (!db) {
      return NextResponse.json({ error: 'Database connection is not available' }, { status: 503 });
    }

    const { alias } = await params;

    // Finding user profile
    const { user, member_profile: profile } = (
      await db
        .select()
        .from(schema.memberProfile)
        .innerJoin(schema.user, eq(schema.user.id, schema.memberProfile.userId))
        .where(eq(schema.memberProfile.alias, alias))
    )[0];

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: profile.userId,
      image: user.image,
      name: user.name,
      position: profile.title,
      alias: profile.alias,
      bio: profile.bio,
      followingCount: user.followingCount,
      followersCount: user.followersCount,
    });
  }
);
