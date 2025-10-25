'use client';
import Link from 'next/link';
import { ShowcaseRecord } from '@/types';
import { getResizeImage } from '@/utils/image';
import { ShowcaseLikeButton } from '@/app/showcase/likes';
import { cn } from '@/utils';

interface ShowcaseRowProps {
  showcase: ShowcaseRecord;
}

export function ShowcaseRow({ showcase }: ShowcaseRowProps) {
  return (
    <Link
      href={`/showcase/${showcase.alias}`}
      className={cn(
        'group flex gap-2 rounded-lg overflow-hidden',
        'p-3 lg:p-4',
        'lg:hover:bg-secondary transition-bg duration-200'
      )}
    >
      <div className="shrink-0">
        {showcase.logo ? (
          <img
            src={getResizeImage(showcase.logo, { width: 64, height: 64 })}
            alt={showcase.title}
            className="size-14 object-cover rounded-lg"
          />
        ) : (
          <div className="size-14 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
        )}
      </div>

      <div className="grow flex flex-col ml-2 justify-center">
        <h3 className="font-medium transition-colors group-hover:text-orange-500">
          {showcase.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2">{showcase.tagline}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="size-4 rounded-full bg-gray-300 dark:bg-gray-700" />
          <span className="text-xs text-muted-foreground">{showcase.user?.name}</span>
        </div>
      </div>

      <div className="shrink-0">
        <ShowcaseLikeButton
          resourceId={showcase.id}
          defaultLiked={showcase.hasCurrentUserLiked}
          defaultCount={showcase.likeCount}
        />
      </div>
    </Link>
  );
}

export function ShowcaseSkeleton() {
  return (
    <div className="animate-pulse flex gap-2 rounded-lg overflow-hidden hover:bg-secondary transition-bg duration-500 p-4">
      <div className="shrink-0">
        <div className="size-14 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
      </div>

      <div className="grow flex flex-col ml-2 space-y-2">
        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2 mt-2"></div>
        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4"></div>
      </div>

      <div className="shrink-0">
        <div className="size-14 border border-2 rounded-lg bg-background flex flex-col items-center justify-center text-gray-700 dark:text-gray-200"></div>
      </div>
    </div>
  );
}
