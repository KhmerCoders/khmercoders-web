import { TooltipContent, TooltipTrigger } from '@/components/generated/tooltip';
import { CommentButton, LikeButton } from '@/components/interaction-button';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ArticlePreviewRecord, FeedRecord, UserRecordWithProfile } from '@/types';
import { formatAgo } from '@/utils/format';
import { getResizeImage } from '@/utils/image';
import { Tooltip } from '@radix-ui/react-tooltip';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

export function FeedItem({ feed }: { feed: FeedRecord }) {
  if (feed.type === 'article') {
    return (
      <FeedPostWrapper
        user={feed.data.user}
        createdAt={feed.data.createdAt}
        label="posted an article"
      >
        <ArticlePreview data={feed.data} />

        <div className="flex gap-2 items-center">
          <LikeButton
            defaultCount={feed.data.likeCount}
            defaultLiked={feed.data.hasCurrentUserLiked}
            resourceId={feed.data.id}
            resourceType="article"
          />

          <div className="grow">
            <CommentButton count={feed.data.commentCount} />
          </div>

          <Tooltip>
            <TooltipTrigger>
              <div className="text-muted-foreground items-center text-sm pr-2 flex gap-1">
                {(feed.data.viewCount ?? 0).toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })}{' '}
                <Eye className="w-4 h-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent style={{ maxWidth: 300 }}>
              <p>
                Views are counted only when a user clicks and reads the article. Impressions in the
                feed are not included.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </FeedPostWrapper>
    );
  } else if (feed.type === 'post') {
    return (
      <FeedPostWrapper
        user={feed.data.user}
        createdAt={feed.data.createdAt}
        label={feed.data.resourceType === 'article' ? 'commented' : ''}
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
              src={getResizeImage(data.image, { width: 550, height: 250, quality: 75 })}
              alt={data.title}
              loading="lazy"
              decoding="async"
              width={550}
              height={250}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <h2 className="text-lg font-semibold line-clamp-2">{data.title}</h2>
          <p className="text-sm text-muted-foreground line-clamp-4 break-all">{data.summary}</p>
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
          <img
            src={user?.image ?? ''}
            alt={user?.name}
            loading="lazy"
            decoding="async"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full"
          />
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
