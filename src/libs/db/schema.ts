import { UserLevel, BindingResourceType } from '@/types';
import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer, index, primaryKey } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull(),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),

  // Additional fields for user profile
  reputation: integer('reputation').notNull().default(0),

  // User level represented as integer but mapped to enum
  level: integer('level').notNull().default(UserLevel.Regular).$type<UserLevel>(),

  // Storage usages
  storageUsed: integer('storage_used').notNull().default(0),
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', {
    mode: 'timestamp',
  }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', {
    mode: 'timestamp',
  }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const memberProfile = sqliteTable('member_profile', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  alias: text('alias').notNull().unique(),
  aliasUpdatedAt: integer('alias_updated_at', { mode: 'timestamp' }),
  picture: text('picture'),
  title: text('title'),
  bio: text('bio'),
  websiteUrl: text('website_url'),
  telegramUrl: text('telegram_url'),
  githubUrl: text('github_url'),
  facebookUrl: text('facebook_url'),
  xUrl: text('x_url'),
  tiktokUrl: text('tiktok_url'),
  instagramUrl: text('instagram_url'),
  linkedinUrl: text('linkedin_url'),
  youtubeUrl: text('youtube_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const workExperience = sqliteTable('work_experience', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  startYear: integer('start_year').notNull(),
  endYear: integer('end_year'), // Null means currently working there
  companyName: text('company_name').notNull(),
  companyLogo: text('company_logo'),
  companyId: text('company_id'), // Nullable field for future company relationship
  role: text('role').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const userUpload = sqliteTable(
  'user_upload',
  {
    id: text('id').primaryKey().notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    fileName: text('file_name').notNull(),
    fileType: text('file_type').notNull(),
    fileSize: integer('file_size').notNull(),
    fileUrl: text('file_url').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  table => [index('user_upload_user_id_idx').on(table.userId)]
);

export const userUploadBinding = sqliteTable(
  'user_upload_binding',
  {
    resourceType: text('resource_type').notNull().$type<BindingResourceType>(),
    resourceId: text('resource_id').notNull(),
    userUploadId: text('user_upload_id')
      .notNull()
      .references(() => userUpload.id),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  },
  table => [
    primaryKey({
      columns: [table.resourceType, table.resourceId, table.userUploadId],
    }),
    index('user_upload_binding_user_upload_id_idx').on(table.userUploadId),
  ]
);

export const article = sqliteTable(
  'article',
  {
    id: text('id').primaryKey().notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    image: text('image'),
    summary: text('summary'),
    content: text('content').notNull(),
    published: integer('published', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  table => [index('article_user_id_idx').on(table.userId)]
);

// Relations
export const userUploadRelationship = relations(userUpload, ({ one, many }) => ({
  bindings: many(userUploadBinding),
}));

export const userUploadBindingRelationship = relations(userUploadBinding, ({ one }) => ({
  userUpload: one(userUpload, {
    fields: [userUploadBinding.userUploadId],
    references: [userUpload.id],
  }),
}));

export const userRelationship = relations(user, ({ one }) => ({
  profile: one(memberProfile, { fields: [user.id], references: [memberProfile.userId] }),
}));

export const articleRelationship = relations(article, ({ one }) => ({
  user: one(user, { fields: [article.userId], references: [user.id] }),
}));
