'use server';
import { withAuthAction } from './middleware';
import { ShortenedLink, urlSchema } from '@/services/shortened-links';
import {
  createShortenedLink,
  getShortenedLinkBySlug,
  getShortenedLinkByUserId,
} from '@/services/shortened-links';

/**
 * Server action to create a new shortened link for the authenticated user
 */
export const createShortenedLinkAction = withAuthAction(async ({ db, user }, data: unknown) => {
  try {
    const validatedData = urlSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        success: false,
        message: 'Invalid link data. Please check your inputs.',
        details: validatedData.error,
      };
    }

    const { slug } = validatedData.data;

    if (slug) {
      const existingLink = await getShortenedLinkBySlug(db, slug);
      if (existingLink) {
        return {
          success: false,
          message: 'This custom URL is already taken.',
        };
      }
    }

    const result = await createShortenedLink(db, {
      ...validatedData.data,
      userId: user.id,
    });

    return {
      success: true,
      message: 'Shortened link created successfully.',
      data: result,
    };
  } catch (error) {
    console.error('Failed to create shortened link:', error);
    return {
      success: false,
      message: 'Failed to create shortened link. Please try again later.',
    };
  }
});

type GetUserShortenedLinksActionReturn =
  | {
      success: true;
      data: ShortenedLink[];
    }
  | {
      success: false;
      message: string;
      data: ShortenedLink[];
    };

/**
 * Server action to get all shortened links for the authenticated user
 */
export const getUserShortenedLinksAction = withAuthAction<[], GetUserShortenedLinksActionReturn>(
  async ({ db, user }) => {
    try {
      const links = await getShortenedLinkByUserId(db, user.id);

      return {
        success: true,
        data: links,
      };
    } catch (error) {
      console.error('Failed to fetch shortened links:', error);
      return {
        success: false,
        message: 'Failed to fetch shortened links. Please try again later.',
        data: [],
      };
    }
  }
);
