'use client';
import { ArticlePreviewRecord, UserLevel } from '@/types';
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
import { useRouter } from 'next/navigation';
import { updateArticlePublishAction, deleteArticleAction } from '@/server/actions/article';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './generated/alert-dialog';
import Image from 'next/image';
import { CommentButton, LikeButton } from './interaction-button';
import { useSession } from './auth-provider';
import { MODERATOR_ACCESS } from '@/constants';
import { formatInTimeZone } from 'date-fns-tz';

interface ArticlePreviewItemProps {
  data: ArticlePreviewRecord;
  showControlPanel?: boolean;
}

export function ArticlePreviewItem({ data, showControlPanel }: ArticlePreviewItemProps) {
  const [published, setPublished] = useState(data.published);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { session } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const { mutate: togglePublished, isPending } = useMutation({
    mutationFn: async (data: { articleId: string; status: boolean }) => {
      return await updateArticlePublishAction(data.articleId, data.status);
    },
    onSuccess: () => {
      setPublished(!published);
    },
  });

  const { mutate: deleteArticle, isPending: isDeleting } = useMutation({
    mutationFn: async (articleId: string) => {
      return await deleteArticleAction(articleId);
    },
    onSuccess: result => {
      if (result?.success) {
        toast({
          title: 'Article deleted',
          description: 'The article has been deleted successfully.',
        });
        setIsDeleteDialogOpen(false);
        router.refresh();
      } else {
        toast({
          title: 'Failed to delete article',
          description: result?.error || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
    },
    onError: error => {
      toast({
        title: 'Failed to delete article',
        description: error instanceof Error ? error.message : 'Something went wrong.',
        variant: 'destructive',
      });
    },
  });

  // Only moderators or the article owner can see view count
  const canSeeViewCount =
    MODERATOR_ACCESS.includes(session?.user?.level ?? UserLevel.Basic) ||
    session?.user.id === data.userId;

  return (
    <article className="border-b flex-col lg:flex-row p-4 flex gap-2 lg:items-center items-start">
      <div className="grow order-2 lg:order-1">
        <Link
          href={`/@${data.user.profile.alias}/articles/${data.id}${data.slug ? `/${data.slug}` : ''}`}
          className="block px-2 lg:px-0"
        >
          <>
            <h2 className="text-lg font-semibold hover:text-primary hover:underline">
              {data.title}
            </h2>

            <div className="text-xs text-muted-foreground">
              {data.createdAt && (
                <time suppressHydrationWarning>
                  {formatInTimeZone(
                    new Date(data.createdAt),
                    Intl.DateTimeFormat().resolvedOptions().timeZone,
                    'MMM d, yyyy'
                  )}{' '}
                  at{' '}
                  {formatInTimeZone(
                    new Date(data.createdAt),
                    Intl.DateTimeFormat().resolvedOptions().timeZone,
                    'h:mm a'
                  )}
                </time>
              )}

              {showControlPanel && (
                <Badge variant={published ? 'default' : 'secondary'} className="ml-2">
                  {published ? 'Published' : 'Draft'}
                </Badge>
              )}
            </div>

            {data.summary && (
              <p className="text-sm text-muted-foreground my-2 line-clamp-2">{data.summary}</p>
            )}
          </>
        </Link>

        <div className="flex gap-2 items-center mt-2 px-2 lg:px-0">
          <Avatar className="w-6 h-6">
            {data.user.image ? <AvatarImage src={data.user.image} /> : <AvatarFallback />}
          </Avatar>
          <span className="text-sm">{data.user.name}</span>
        </div>

        <div className="flex gap-2 mt-4 px-2 lg:px-0">
          <LikeButton
            defaultLiked={data.hasCurrentUserLiked}
            defaultCount={data.likeCount}
            resourceId={data.id}
            resourceType="article"
          />
          <CommentButton count={data.commentCount} />
          {canSeeViewCount && (
            <div className="text-muted-foreground text-sm flex items-center">
              | {data.viewCount} views
            </div>
          )}
        </div>

        {showControlPanel && (
          <div className="mt-4">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild disabled={isPending || isDeleting}>
                <Button variant="outline" size="sm" disabled={isPending || isDeleting}>
                  More Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href={`/profile/articles/${data.id}`} className="cursor-pointer">
                    Edit Article
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => togglePublished({ articleId: data.id, status: !published })}
                >
                  {published ? 'Unpublished' : 'Published'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  Delete Article
                </DropdownMenuItem>
                <DropdownMenuItem disabled>Insight (coming soon)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this article?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. The article and its related comments will be
                    permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isDeleting}
                    onClick={event => {
                      event.preventDefault();
                      deleteArticle(data.id);
                    }}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      {data.image ? (
        <div className="flex shrink-0 order-1 lg:order-2">
          <Link
            href={`/@${data.user.profile.alias}/articles/${data.id}${data.slug ? `/${data.slug}` : ''}`}
          >
            <Image
              width={128}
              height={64}
              src={data.image}
              alt={data.title}
              className="w-full lg:w-[128px] lg:h-[64px] h-auto aspect-[128/64]"
            />
          </Link>
        </div>
      ) : (
        <Link
          className="w-full lg:w-[128px] lg:h-[64px] h-auto aspect-[128/64] bg-secondary rounded shrink-0 order-1 lg:order-2"
          href={`/@${data.user.profile.alias}/articles/${data.id}${data.slug ? `/${data.slug}` : ''}`}
        ></Link>
      )}
    </article>
  );
}
