'use server';
import { withAuthAction } from './middleware';
import { isValidAlias } from '@/utils/validate';
import * as schema from '@/libs/db/schema';
import { eq } from 'drizzle-orm';

export const getUserAction = withAuthAction(async ({ db, user }) => {
  return user;
});

export const updateUserAliasAction = withAuthAction(
  async ({ db, user, profile }, alias: string) => {
    // Validate alias
    if (!isValidAlias(alias)) {
      return {
        success: false,
        message:
          'Invalid alias format. Please use alphanumeric characters, underscores, or hyphens.',
      };
    }

    // Update user alias
    const normalizedAlias = alias.toLowerCase();
    const now = new Date();

    if (profile && profile.alias === normalizedAlias) {
      // If the alias is already set and matches, no need to update
      return { success: false };
    }

    // Check if the alias is already updated in the last 7 days, it will fail
    if (
      profile &&
      profile.aliasUpdatedAt &&
      new Date(profile.aliasUpdatedAt).getTime() > now.getTime() - 7 * 24 * 60 * 60 * 1000
    ) {
      return {
        success: false,
        message: 'You can only update your alias once every 7 days. Please try again later.',
      };
    }

    try {
      await db
        .insert(schema.memberProfile)
        .values({
          userId: user.id,
          alias: normalizedAlias,
          createdAt: now,
          updatedAt: now,
          aliasUpdatedAt: now,
        })
        .onConflictDoUpdate({
          target: schema.memberProfile.userId,
          set: {
            alias: normalizedAlias,
            aliasUpdatedAt: now,
            updatedAt: now,
          },
        });
    } catch (error) {
      // Check if the error is due to a unique constraint violation (alias already taken)
      if (error instanceof Error && error.message.includes('unique constraint')) {
        return {
          success: false,
          message: 'This alias is already taken. Please choose another one.',
        };
      }

      return {
        success: false,
        message: 'Failed to update alias. Please try again later.',
      };
    }

    return {
      success: true,
      message: 'Alias updated successfully.',
      alias: normalizedAlias,
    };
  }
);

export const updateUserProfileAction = withAuthAction(
  async (
    { db, user },
    data: {
      name: string;
      title: string;
      bio: string;
      websiteUrl?: string;
      telegramUrl?: string;
      githubUrl?: string;
      facebookUrl?: string;
      xUrl?: string;
      tiktokUrl?: string;
      instagramUrl?: string;
      linkedinUrl?: string;
      youtubeUrl?: string;
    }
  ) => {
    const now = new Date();
    const {
      name,
      title,
      bio,
      websiteUrl,
      telegramUrl,
      githubUrl,
      facebookUrl,
      xUrl,
      tiktokUrl,
      instagramUrl,
      linkedinUrl,
      youtubeUrl,
    } = data;

    // Validate inputs
    if (!name || name.trim().length < 2) {
      return {
        success: false,
        message: 'Name must be at least 2 characters.',
      };
    }

    if (name.trim().length > 50) {
      return {
        success: false,
        message: 'Name must be less than 50 characters.',
      };
    }

    if (title && title.trim().length > 100) {
      return {
        success: false,
        message: 'Title must be less than 100 characters.',
      };
    }

    if (bio && bio.trim().length > 500) {
      return {
        success: false,
        message: 'Bio must be less than 500 characters.',
      };
    }

    try {
      await db.batch([
        db
          .update(schema.user)
          .set({
            updatedAt: now,
            name: name.trim(),
          })
          .where(eq(schema.user.id, user.id)),
        db
          .update(schema.memberProfile)
          .set({
            updatedAt: now,
            title: title?.trim() || '',
            bio: bio?.trim() || '',
            websiteUrl: websiteUrl?.trim() || null,
            telegramUrl: telegramUrl?.trim() || null,
            githubUrl: githubUrl?.trim() || null,
            facebookUrl: facebookUrl?.trim() || null,
            xUrl: xUrl?.trim() || null,
            tiktokUrl: tiktokUrl?.trim() || null,
            instagramUrl: instagramUrl?.trim() || null,
            linkedinUrl: linkedinUrl?.trim() || null,
            youtubeUrl: youtubeUrl?.trim() || null,
          })
          .where(eq(schema.memberProfile.userId, user.id)),
      ]);

      return {
        success: true,
        message: 'Profile updated successfully.',
      };
    } catch (error) {
      console.error('Failed to update profile:', error);
      return {
        success: false,
        message: 'Failed to update profile. Please try again later.',
      };
    }
  }
);
