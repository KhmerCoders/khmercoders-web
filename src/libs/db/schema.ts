import {
  UserLevel,
  BindingResourceType,
  LikableResourceType,
  PostableResourceType,
  ArticleReviewStatus,
} from '@/types';
import { desc, relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer, index, primaryKey } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable(
  'user',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: integer('email_verified', { mode: 'boolean' }).notNull(),
    image: text('image'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),

    // Additional fields for user profile
    reputation: integer('reputation').notNull().default(0),
    followersCount: integer('followers_count').notNull().default(0),
    followingCount: integer('following_count').notNull().default(0),

    // User level represented as integer but mapped to enum
    level: integer('level').notNull().default(UserLevel.Regular).$type<UserLevel>(),

    // Storage usages
    storageUsed: integer('storage_used').notNull().default(0),

    // Moderation
    isBanned: integer('is_banned', { mode: 'boolean' }).notNull().default(false),
    banReason: text('ban_reason'),
    banByUserId: text('ban_by_user_id'),
  },
  table => [
    index('user_follower_idx').on(
      desc(table.followersCount),
      desc(table.followingCount),
      table.name
    ),
  ]
);

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
    slug: text('slug').notNull().default(''),
    image: text('image'),
    summary: text('summary'),
    content: text('content').notNull(),
    published: integer('published', { mode: 'boolean' }).notNull().default(false),
    approvedByAI: integer('approved_by_ai', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
    likeCount: integer('like_count').notNull().default(0),
    commentCount: integer('comment_count').notNull().default(0),
    viewCount: integer('view_count').notNull().default(0),

    // For moderation
    reviewStatus: text('review_status')
      .notNull()
      .default(ArticleReviewStatus.Pending)
      .$type<ArticleReviewStatus>(),

    reviewBy: text('review_by'), // User ID of the reviewer
  },
  table => [index('article_user_id_idx').on(table.userId)]
);

export const articleReviewLog = sqliteTable(
  'article_review_log',
  {
    id: text('id').primaryKey().notNull(),
    articleId: text('article_id').notNull(),
    reviewerId: text('reviewer_id').notNull(),
    status: text('status').notNull().$type<ArticleReviewStatus>(),
    feedback: text('feedback'), // Optional feedback from reviewer
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  },
  table => [index('article_review_log_article_id_idx').on(table.articleId)]
);

export const likes = sqliteTable(
  'likes',
  {
    type: text('type').notNull().$type<LikableResourceType>(), // 'article' or 'comment'
    resourceId: text('resource_id').notNull(), // ID of the article or comment
    userId: text('user_id').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  },
  table => [primaryKey({ columns: [table.type, table.resourceId, table.userId] })]
);

export const followers = sqliteTable(
  'followers',
  {
    userId: text('user_id'), // User being followed
    followerId: text('follower_id'), // User who follows
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  },
  table => [
    // This covers fast lookup for
    // SELECT * FROM followers WHERE userId = ? AND followerId = ?
    // SELECT * FROM followers WHERE userId = ?
    primaryKey({ columns: [table.userId, table.followerId] }),

    // This cover fast lookup for
    // SELECT * FROM followers WHERE followerId = ?
    index('followers_follower_id_idx').on(table.followerId),
  ]
);

export const posts = sqliteTable(
  'posts',
  {
    id: text('id').primaryKey().notNull(),
    userId: text('user_id').notNull(),
    content: text('content').notNull(),
    likeCount: integer('like_count').notNull().default(0),
    commentCount: integer('comment_count').notNull().default(0),
    resourceType: text('resource_type').notNull().$type<PostableResourceType>(),
    resourceId: text('resource_id'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  table => [
    // Indexing for faster lookups + sorting by createdAt
    index('posts_user_id_idx').on(table.userId, table.createdAt),
    index('posts_resource_type_idx').on(table.resourceType, table.resourceId),
  ]
);

export const systemSetting = sqliteTable('system_setting', {
  key: text('key').primaryKey().notNull(),
  value: text('value').notNull(),
  description: text('description'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const userLinkCode = sqliteTable('user_link_code', {
  userId: text('user_id')
    .primaryKey()
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  code: text('code').notNull().unique(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const cacheTable = sqliteTable('caches', {
  key: text('key').primaryKey().notNull(),
  value: text('value').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const showcase = sqliteTable('showcase', {
  id: text('id').primaryKey().notNull(),
  alias: text('alias').notNull(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),

  // Link
  website: text('website_url').notNull(),
  github: text('github_url').notNull(),

  // Media
  logo: text('logo').notNull(),
  coverImage: text('cover_image').notNull(),

  // Social
  likeCount: integer('like_count').notNull().default(0),
  commentCount: integer('comment_count').notNull().default(0),

  // For moderation
  reviewStatus: text('review_status')
    .notNull()
    .default(ArticleReviewStatus.Pending)
    .$type<ArticleReviewStatus>(),
  reviewBy: text('review_by'), // User ID of the reviewer
});

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

export const postRelationship = relations(posts, ({ one }) => ({
  user: one(user, { fields: [posts.userId], references: [user.id] }),
}));

export const showcaseRelationship = relations(showcase, ({ one }) => ({
  user: one(user, { fields: [showcase.userId], references: [user.id] }),
}));
