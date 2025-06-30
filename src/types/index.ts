// Founder Card Component with detailed bio

import { DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from '@/libs/db/schema';

// Define the type for the member object
export interface ITeamMember {
  name: string;
  role: string;
  bio?: string;
  image?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
  telegram?: string;
}

// Member Card Component
// Define the Member type
export interface ICommunityMember {
  id: string;
  name: string;
  role: string;
  shortBio: string;
  bio?: string;
  badges?: string[];
  image?: string;
  coverImage?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
}

export interface Session {
  session: {
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
    userId: string;
    id: string;
  };
  user: {
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    id: string;
  };
}

export enum UserLevel {
  Basic = 0,
  Regular = 1,
  Premium = 5,
  Volunteer = 8,
  Moderator = 10,
  SuperAdmin = 20,
}

export type BindingResourceType = 'profile' | 'article';

export type MainDatabase = DrizzleD1Database<typeof schema>;

export type UserRecord = typeof schema.user.$inferSelect;
export type ProfileRecord = typeof schema.memberProfile.$inferSelect;
export type ExperienceRecord = typeof schema.workExperience.$inferSelect;
export type UserUploadRecord = typeof schema.userUpload.$inferSelect;
export type UserUploadRecordWithBinding = UserUploadRecord & {
  bindings: (typeof schema.userUploadBinding.$inferSelect)[];
};

export type ArticleRecord = typeof schema.article.$inferSelect & {
  user: UserRecord & {
    profile: ProfileRecord;
  };
};
export type ArticlePreviewRecord = Omit<ArticleRecord, 'content'>;
