import { getDB } from '@/libs/db';
import { bindingArticleListLikeStatus } from './article';
import { FeedRecord, PostType } from '@/types';
import { bindingLikeStatus } from './likes';

export interface FeedFilterOptions {
  before?: number;
  limit: number;
}

export interface FeedPagination {
  next?: string;
}

export async function getFeed(
  options: FeedFilterOptions,
  userId?: string
): Promise<{ data: FeedRecord[]; pagination: FeedPagination }> {
  const { before, limit } = options;
  const db = await getDB();

  const articles = await bindingArticleListLikeStatus(
    await db.query.article.findMany({
      where: (article, { and, lte, eq }) => {
        return and(
          lte(article.createdAt, before ? new Date(before) : new Date()),
          eq(article.approvedByAI, true),
          eq(article.published, true)
        );
      },
      limit: limit + 1,
      orderBy: (article, { desc }) => desc(article.createdAt),
      with: {
        user: {
          with: {
            profile: true,
          },
        },
      },
    }),
    userId
  );

  const hasNextPage = articles.length > limit;
  const slicedArticles = hasNextPage ? articles.slice(0, limit) : articles;

  return {
    data: slicedArticles.map(article => ({
      id: article.id,
      type: 'article',
      createdAt: article.createdAt,
      data: article,
    })),
    pagination: {
      next: hasNextPage ? String(articles[articles.length - 1].createdAt.getTime()) : undefined,
    },
  };
}

export async function getFeedFromArticle(articleId: string, userId?: string) {
  const db = await getDB();

  const posts = await bindingLikeStatus(
    (
      await db.query.posts.findMany({
        where: (posts, { eq, isNull }) =>
          eq(posts.postType, PostType.ArticleComment) &&
          (articleId == null
            ? isNull(posts.linkingResourceId)
            : eq(posts.linkingResourceId, articleId)),
        orderBy: (posts, { desc }) => desc(posts.createdAt),
        with: {
          user: {
            with: {
              profile: true,
            },
          },
        },
      })
    ).map(post => ({
      id: post.id,
      type: 'post',
      createdAt: post.createdAt,
      data: post,
    })),
    userId
  );

  return {
    data: posts,
    pagination: {
      next: undefined,
    },
  };
}
