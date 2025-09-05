'use server';
import { withAuthAction, withOptionalAuthAction } from './middleware';
import * as schema from '@/libs/db/schema';
import { eq, desc, or } from 'drizzle-orm';
import { generateShowcaseId } from '../generate-id';
import { ArticleReviewStatus } from '@/types';
import { z } from 'zod';

const createShowcaseSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name is too long'),
  alias: z
    .string()
    .min(1, 'Project URL alias is required')
    .max(50, 'Project URL alias is too long')
    .regex(/^[a-z0-9-]+$/, 'Project URL alias can only contain lowercase letters, numbers, and hyphens')
    .refine((alias) => !alias.startsWith('-') && !alias.endsWith('-'), 'Project URL alias cannot start or end with a hyphen'),
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
        return { success: false, error: 'This project URL is already taken. Please choose a different one.' };
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
        message: 'Showcase created successfully! You can now add more details to your project.'
      };
    } catch (e) {
      if (e instanceof z.ZodError) {
        return {
          success: false,
          error: e.errors[0]?.message || 'Invalid input data'
        };
      }
      if (e instanceof Error) {
        return { success: false, error: e.message };
      }
      return { success: false, error: 'Failed to create showcase' };
    }
  }
);

export const checkAliasAvailabilityAction = withAuthAction(
  async ({ db }, alias: string) => {
    try {
      // Validate alias format
      const aliasSchema = z
        .string()
        .min(1, 'Alias is required')
        .max(50, 'Alias is too long')
        .regex(/^[a-z0-9-]+$/, 'Alias can only contain lowercase letters, numbers, and hyphens')
        .refine((alias) => !alias.startsWith('-') && !alias.endsWith('-'), 'Alias cannot start or end with a hyphen');

      const validatedAlias = aliasSchema.parse(alias);

      // Check if alias is already taken
      const existingShowcase = await db.query.showcase.findFirst({
        where: (showcase, { eq }) => eq(showcase.alias, validatedAlias),
      });

      return {
        success: true,
        available: !existingShowcase,
        message: existingShowcase ? 'This URL is already taken' : 'This URL is available'
      };
    } catch (e) {
      if (e instanceof z.ZodError) {
        return {
          success: false,
          error: e.errors[0]?.message || 'Invalid alias format'
        };
      }
      return { success: false, error: 'Failed to check alias availability' };
    }
  }
);

export const getApprovedShowcasesAction = withOptionalAuthAction(
  async ({ db, user }) => {
    try {
      let showcases;

      if (typeof user !== 'undefined' && user?.id) {
        // Single query: Get approved showcases OR user's own showcases
        showcases = await db.query.showcase.findMany({
          where: (showcase, { eq, or }) =>
            or(
              eq(showcase.reviewStatus, ArticleReviewStatus.Approved),
              eq(showcase.userId, user.id)
            ),
          orderBy: (showcase, { desc }) => [desc(showcase.createdAt)],
        });
      } else {
        // For unauthenticated users, only get approved showcases
        showcases = await db.query.showcase.findMany({
          where: (showcase, { eq }) => eq(showcase.reviewStatus, ArticleReviewStatus.Approved),
          orderBy: (showcase, { desc }) => [desc(showcase.createdAt)],
        });
      }

      return {
        success: true,
        showcases
      };
    } catch (e) {
      if (e instanceof Error) {
        return { success: false, error: e.message };
      }
      return { success: false, error: 'Failed to fetch showcases' };
    }
  }
);