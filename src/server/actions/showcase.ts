'use server';
import { withAuthAction, withOptionalAuthAction } from './middleware';
import * as schema from '@/libs/db/schema';
import { generateShowcaseId } from '../generate-id';
import { ArticleReviewStatus } from '@/types';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { syncUploadFilesToResource } from '../services/upload';

const createShowcaseSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name is too long'),
  alias: z
    .string()
    .min(1, 'Project URL alias is required')
    .max(50, 'Project URL alias is too long')
    .regex(
      /^[a-z0-9-]+$/,
      'Project URL alias can only contain lowercase letters, numbers, and hyphens'
    )
    .refine(
      alias => !alias.startsWith('-') && !alias.endsWith('-'),
      'Project URL alias cannot start or end with a hyphen'
    ),
});

export const createShowcaseAction = withAuthAction(
  async ({ db, user }, data: { name: string; alias: string }) => {
    try {
      // Validate input data
      const validatedData = createShowcaseSchema.parse(data);

      // Check if alias is already taken
      const existingShowcase = await db.query.showcase.findFirst({
        where: (showcase, { eq }) => eq(showcase.alias, validatedData.alias),
      });

      if (existingShowcase) {
        return {
          success: false,
          error: 'This project URL is already taken. Please choose a different one.',
        };
      }

      // Generate unique ID
      let generateIdAllowance = 5;
      let id: string;

      do {
        id = generateShowcaseId();

        // Check if ID already exists
        const existingShowcaseById = await db.query.showcase.findFirst({
          where: (showcase, { eq }) => eq(showcase.id, id),
        });

        if (!existingShowcaseById) break;
      } while (--generateIdAllowance > 0);

      if (generateIdAllowance <= 0) {
        throw new Error('Failed to generate a unique showcase ID after multiple attempts');
      }

      const now = new Date();

      // Create showcase with minimal required fields
      await db.insert(schema.showcase).values({
        id,
        alias: validatedData.alias,
        userId: user.id,
        title: validatedData.name,
        description: '', // Empty description as default
        website: '', // Empty website as default
        github: '', // Empty github as default
        logo: '', // Empty logo as default
        coverImage: '', // Empty cover image as default
        reviewStatus: ArticleReviewStatus.Pending,
        createdAt: now,
        updatedAt: now,
      });

      // Fetch the created showcase
      const showcase = await db.query.showcase.findFirst({
        where: (showcase, { eq }) => eq(showcase.id, id),
      });

      if (!showcase) {
        throw new Error('Failed to create showcase');
      }

      return {
        success: true,
        showcase,
        message: 'Showcase created successfully! You can now add more details to your project.',
      };
    } catch (e) {
      if (e instanceof z.ZodError) {
        return {
          success: false,
          error: e.errors[0]?.message || 'Invalid input data',
        };
      }
      if (e instanceof Error) {
        return { success: false, error: e.message };
      }
      return { success: false, error: 'Failed to create showcase' };
    }
  }
);

export const checkAliasAvailabilityAction = withAuthAction(async ({ db }, alias: string) => {
  try {
    // Validate alias format
    const aliasSchema = z
      .string()
      .min(1, 'Alias is required')
      .max(50, 'Alias is too long')
      .regex(/^[a-z0-9-]+$/, 'Alias can only contain lowercase letters, numbers, and hyphens')
      .refine(
        alias => !alias.startsWith('-') && !alias.endsWith('-'),
        'Alias cannot start or end with a hyphen'
      );

    const validatedAlias = aliasSchema.parse(alias);

    // Check if alias is already taken
    const existingShowcase = await db.query.showcase.findFirst({
      where: (showcase, { eq }) => eq(showcase.alias, validatedAlias),
    });

    return {
      success: true,
      available: !existingShowcase,
      message: existingShowcase ? 'This URL is already taken' : 'This URL is available',
    };
  } catch (e) {
    if (e instanceof z.ZodError) {
      return {
        success: false,
        error: e.errors[0]?.message || 'Invalid alias format',
      };
    }
    return { success: false, error: 'Failed to check alias availability' };
  }
});

export const getApprovedShowcasesAction = withOptionalAuthAction(async ({ db, user }) => {
  try {
    let showcases;

    if (typeof user !== 'undefined' && user?.id) {
      // Single query: Get approved showcases OR user's own showcases
      showcases = await db.query.showcase.findMany({
        where: (showcase, { eq, or }) =>
          or(eq(showcase.reviewStatus, ArticleReviewStatus.Approved), eq(showcase.userId, user.id)),
        orderBy: (showcase, { desc }) => [desc(showcase.createdAt)],
        with: {
          user: true,
        }
      });
    } else {
      // For unauthenticated users, only get approved showcases
      showcases = await db.query.showcase.findMany({
        where: (showcase, { eq }) => eq(showcase.reviewStatus, ArticleReviewStatus.Approved),
        orderBy: (showcase, { desc }) => [desc(showcase.createdAt)],
        with: {
          user: true,
        }
      });
    }

    return {
      success: true,
      showcases,
    };
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, error: e.message };
    }
    return { success: false, error: 'Failed to fetch showcases' };
  }
});

export const updateShowcaseDescriptionAction = withAuthAction(
  async ({ db, user }, data: { showcaseId: string; description?: string, tagline?: string }) => {
    try {
      // Validate input
      const inputSchema = z.object({
        showcaseId: z.string().min(1, 'Showcase ID is required'),
        description: z.optional(z.string().max(1000, 'Description is too long')),
        tagline: z.optional(z.string().max(200, 'Tagline is too long')),
      });

      const validatedData = inputSchema.parse(data);

      // Check if the showcase exists and belongs to the user
      const showcase = await db.query.showcase.findFirst({
        where: (showcase, { eq }) =>
          eq(showcase.id, validatedData.showcaseId) && eq(showcase.userId, user.id),
      });

      if (!showcase) {
        return { success: false, error: 'Showcase not found or you do not have permission' };
      }

      if (!validatedData.description && !validatedData.tagline) {
        return { success: false, error: 'Nothing to update' };
      }

      // Update the description
      await db
        .update(schema.showcase)
        .set({ description: validatedData.description, tagline: validatedData.tagline })
        .where(eq(schema.showcase.id, validatedData.showcaseId));

      return { success: true };
    } catch (e) {
      if (e instanceof z.ZodError) {
        return {
          success: false,
          error: e.errors[0]?.message || 'Invalid input data',
        };
      }
      if (e instanceof Error) {
        return { success: false, error: e.message };
      }
      return { success: false, error: 'Failed to update showcase description' };
    }
  }
);

export const updateShowcaseLogoAction = withAuthAction(
  async ({ db, user }, data: { showcaseId: string; logo: string }) => {
    // Making sure the logo is a valid URL and belong to current user as well
    await syncUploadFilesToResource(user.id, [data.logo], 'showcase', data.showcaseId);

    // Update the showcase
    await db
      .update(schema.showcase)
      .set({ logo: data.logo })
      .where(eq(schema.showcase.id, data.showcaseId));

    return { success: true };
  }
);

export const updateShowcaseCoverImageAction = withAuthAction(
  async ({ db, user }, data: { showcaseId: string; coverImage: string[] }) => {
    // Making sure the cover image is a valid URL and belong to current user as well
    await syncUploadFilesToResource(user.id, data.coverImage, 'showcase-banner', data.showcaseId);

    // Update the showcase
    await db
      .update(schema.showcase)
      .set({ coverImage: data.coverImage.join(',') })
      .where(and(eq(schema.showcase.id, data.showcaseId), eq(schema.showcase.userId, user.id)));

    return { success: true };
  }
);

export const updateShowcaseLinksAction = withAuthAction(
  async (
    { db, user },
    data: { showcaseId: string; github?: string; website?: string }
  ) => {
    await db.update(schema.showcase).set({
      github: data.github,
      website: data.website,
    }).where(and(
      eq(schema.showcase.id, data.showcaseId),
      eq(schema.showcase.userId, user.id)
    ));
  }
);