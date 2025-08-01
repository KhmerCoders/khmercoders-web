import { CommentButton, LikeButton } from '@/components/interaction-button';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ArticlePreviewRecord, FeedRecord, UserRecordWithProfile } from '@/types';
import { formatAgo } from '@/utils/format';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

export function FeedItem({ feed }: { feed: FeedRecord }) {
  if (feed.type === 'article') {
    return (
      <FeedPostWrapper
        user={feed.data.user}
        createdAt={feed.data.createdAt}
        label="is posting article"
      >
        <ArticlePreview data={feed.data} />

        <div className="flex gap-2">
          <LikeButton
            defaultCount={feed.data.likeCount}
            defaultLiked={feed.data.hasCurrentUserLiked}
            resourceId={feed.data.id}
            resourceType="article"
          />

          <CommentButton count={feed.data.commentCount} />
        </div>
      </FeedPostWrapper>
    );
  } else if (feed.type === 'post') {
    return (
      <FeedPostWrapper
        user={feed.data.user}
        createdAt={feed.data.createdAt}
        label={feed.data.resourceType === 'article' ? 'is commenting' : ''}
      >
        <div className="markdown">
          <MarkdownContent withoutMedia>{feed.data.content}</MarkdownContent>
        </div>
        <div className="flex gap-2">
          <LikeButton
            defaultCount={feed.data.likeCount}
            defaultLiked={feed.data.hasCurrentUserLiked}
            resourceId={feed.data.id}
            resourceType="post"
          />
        </div>
      </FeedPostWrapper>
    );
  }

  return <div></div>;
}

function ArticlePreview({ data }: { data: ArticlePreviewRecord }) {
  return (
    <Link href={`/@${data.user?.profile?.alias}/articles/${data.id}`} className="block">
      <article className="w-full rounded-lg overflow-hidden border my-2">
        {data.image && (
          <div className="relative w-full">
            <div className="pb-[50%]"></div>
            <img
              src={data.image}
              alt={data.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <h2 className="text-lg font-semibold">{data.title}</h2>
          <p className="text-sm text-muted-foreground">{data.summary}</p>
        </div>
      </article>
    </Link>
  );
}

function FeedPostWrapper({
  user,
  label,
  children,
  createdAt,
}: PropsWithChildren<{ user?: UserRecordWithProfile; label: string; createdAt: Date }>) {
  return (
    <div className="p-4 border-b flex gap-2 w-full">
      <div className="shrink-0">
        <Link href={`/@${user?.profile?.alias}`}>
          <img src={user?.image ?? ''} alt={user?.name} className="w-12 h-12 rounded-full" />
        </Link>
      </div>
      <div className="flex flex-col grow gap-1">
        <div className="text-sm">
          <Link className="hover:underline font-bold" href={`/@${user?.profile?.alias}`}>
            {user?.name}
          </Link>{' '}
          <span className="text-muted-foreground">{label}</span>
        </div>
        <time className="text-xs text-muted-foreground">{formatAgo(createdAt)}</time>

        {children}
      </div>
    </div>
  );
}
