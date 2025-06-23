import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth, ApiAuthContext } from '../middleware';
import {
  createShortenedLink,
  getShortenedLinkBySlug,
  getShortenedLinkByUserId,
  urlSchema,
} from '@/services/shortened-links';
import { z } from 'zod/v4';

export const POST = withApiAuth(async (req: NextRequest, { db, user }: ApiAuthContext) => {
  try {
    const body = await req.json();

    const validatedData = urlSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: z.prettifyError(validatedData.error) },
        { status: 400 }
      );
    }

    const slug = validatedData.data.slug;

    if (slug) {
      const existingLink = await getShortenedLinkBySlug(db, slug);
      if (existingLink) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
      }
    }

    const result = await createShortenedLink(db, {
      ...validatedData.data,
      userId: user.id,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error creating short URL:', error);
    return NextResponse.json({ error: 'Failed to create short URL' }, { status: 500 });
  }
});

export const GET = withApiAuth(async (req: NextRequest, { db, user }: ApiAuthContext) => {
  const result = await getShortenedLinkByUserId(db, user.id);
  return NextResponse.json({ data: result });
});
