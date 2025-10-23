'use server';
import { withAuthAction } from './middleware';
import { isValidAlias } from '@/utils/validate';
import * as schema from '@/libs/db/schema';
import { eq } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { sortExperience } from '@/utils/experience';
import z from 'zod';
import { ProfileAiReviewFeedback } from '@/types';

export const getUserAction = withAuthAction(async ({ user }) => {
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

      const updatedProfile = await db.query.memberProfile.findFirst({
        where: eq(schema.memberProfile.userId, user.id),
        columns: {
          alias: true,
        },
      });

      return {
        success: true,
        message: 'Profile updated successfully.',
        alias: updatedProfile?.alias,
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

export const reviewProfileByAiAction = withAuthAction(async ({ db, user, profile }) => {
  const { env } = getCloudflareContext();

  // Getting working experience
  const workHistory = sortExperience(
    await db.query.workExperience.findMany({
      where: (workExperience, { eq }) => eq(workExperience.userId, user.id),
    })
  );

  const formatForAiReview = workHistory.map(exp => ({
    id: exp.id,
    title: exp.role,
    company: exp.companyName,
    startDate: exp.startYear,
    endDate: exp.endYear,
    description: exp.description,
  }));

  const response = await env.AI.run(
    '@cf/meta/llama-3.1-8b-instruct',
    {
      stream: false,
      max_tokens: 2000,
      response_format: {
        json_schema: {
          type: 'object',
          properties: {
            rating: { type: 'number', minimum: 0, maximum: 10 },
            feedback: { type: 'string' },
            experiences: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  suggestion: { type: ['string', 'null'] },
                  feedback: { type: ['string', 'null'] },
                },
                required: ['id', 'suggestion', 'feedback'],
              },
            },
          },
          required: ['rating', 'feedback', 'experiences'],
        },
        type: 'json_schema',
      },
      messages: [
        {
          role: 'system',
          content: `You are a resume reviewer. Rate experience from 0–10, give short overall feedback, and review each experience individually.

\`\`\`json
{
  "rating": [0–10],
  "feedback": "Short overall feedback",
  "experiences": [
    {
      "id": [same as input],
      "suggestion": "Rewrite only if needed, otherwise null",
      "feedback": "One-line feedback. Feedback only if needed, otherwise null"
    }
  ]
}
\`\`\`

Do not include markdown formatting (e.g. \`\`\`json), comments, or explanations. Only return valid JSON
`,
        },
        {
          role: 'user',
          content: JSON.stringify(
            {
              bio: profile?.bio || '',
              experiences: formatForAiReview,
            },
            null,
            2
          ),
        },
      ],
    },
    {
      gateway: { id: 'khmercoders-article-moderator-gw' },
    }
  );

  const responseText = (response as any).response as string | ProfileAiReviewFeedback;

  try {
    // If the response is valid, return it
    return {
      success: true,
      message: 'Profile review completed successfully.',
      data: responseText as ProfileAiReviewFeedback,
    };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return {
      success: false,
      message: 'Failed to parse AI response. Please try again later.',
      data: responseText,
    };
  }
});
