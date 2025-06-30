'use client';
import { ArticlePreviewRecord } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from './generated/avatar';
import Link from 'next/link';
import { Badge } from './generated/badge';
import { Button } from './generated/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from './generated/dropdown-menu';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { updateArticlePublishAction } from '@/actions/article';
import Image from 'next/image';

interface ArticlePreviewItemProps {
  data: ArticlePreviewRecord;
  showControlPanel?: boolean;
}

export function ArticlePreviewItem({ data, showControlPanel }: ArticlePreviewItemProps) {
  const [published, setPublished] = useState(data.published);

  const { mutate: togglePublished, isPending } = useMutation({
    mutationFn: async (data: { articleId: string; status: boolean }) => {
      return await updateArticlePublishAction(data.articleId, data.status);
    },
    onSuccess: () => {
      setPublished(!published);
    },
  });

  return (
    <article className="p-4 border rounded-lg shadow-md mb-4 flex gap-2">
      <div className="grow">
        <Link
          href={`/@${data.user.profile.alias}/articles/${data.id}${data.slug ? `/${data.slug}` : ''}`}
          className="block"
        >
          <h2 className="text-lg font-semibold hover:text-primary hover:underline">{data.title}</h2>
        </Link>

        <div className="text-xs text-muted-foreground">
          {data.createdAt && (
            <time>
              {new Date(data.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}{' '}
              at{' '}
              {new Date(data.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </time>
          )}

          {showControlPanel && (
            <Badge variant={published ? 'default' : 'secondary'} className="ml-2">
              {published ? 'Published' : 'Draft'}
            </Badge>
          )}
        </div>
        {data.summary && <p className="text-sm text-muted-foreground my-2">{data.summary}</p>}
        <div className="flex gap-2 items-center mt-2">
          <Avatar className="w-6 h-6">
            {data.user.image ? <AvatarImage src={data.user.image} /> : <AvatarFallback />}
          </Avatar>
          <span className="text-sm">Visal .In</span>
        </div>

        {showControlPanel && (
          <div className="mt-4">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild disabled={isPending}>
                <Button variant="outline" size="sm" disabled={isPending}>
                  More Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href={`/profile/article/${data.id}`} className="cursor-pointer">
                    Edit Article
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => togglePublished({ articleId: data.id, status: !published })}
                >
                  {published ? 'Unpublished' : 'Published'}
                </DropdownMenuItem>
                <DropdownMenuItem disabled>Insight (coming soon)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      {data.image ? (
        <div className="article-image">
          <Image width={128} height={96} src={data.image} alt={data.title} className="w-32 h-24" />
        </div>
      ) : (
        <div className="w-32 h-24 bg-secondary rounded"></div>
      )}
    </article>
  );
}
