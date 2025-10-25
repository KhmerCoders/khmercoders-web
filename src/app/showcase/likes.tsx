'use client';
import { ArrowBigUp, Minus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useSession } from '@/components/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { likeShowcaseAction, unlikeShowcaseAction } from '@/server/actions/likes';
import { cn } from '@/utils';

interface ShowcaseLikeButtonProps {
  defaultLiked?: boolean;
  defaultCount: number;
  resourceId: string;
}

export function ShowcaseLikeButton({
  defaultLiked,
  defaultCount,
  resourceId,
}: ShowcaseLikeButtonProps) {
  const { session } = useSession();
  const { toast } = useToast();
  const [liked, setLiked] = useState(defaultLiked || false);
  const [count, setCount] = useState(defaultCount || 0);
  const [loading, setLoading] = useState(false);

  const handleToggleLike = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent navigation when clicking inside a Link
      e.stopPropagation();

      // Check if user is logged in
      if (!session) {
        toast({
          description: 'You must sign in first to like content.',
          variant: 'destructive',
        });
        return;
      }

      setLoading(true);
      (liked ? unlikeShowcaseAction : likeShowcaseAction)(resourceId)
        .then(newCount => {
          setCount(oldCount => {
            if (newCount === null) return oldCount; // If operation failed, keep old
            return newCount; // Update count with new value
          });
        })
        .finally(() => {
          setLoading(false);
          setLiked(!liked);
        });
    },
    [liked, session, toast, resourceId]
  );

  const className = cn(
    'size-16 border border-2 rounded-lg bg-background flex flex-col items-center justify-center transition-colors',
    !liked && 'text-gray-700 dark:text-gray-200 hover:border-orange-500',
    liked && 'border-orange-500 text-orange-500 bg-orange-500/10'
  );

  return (
    <button className={className} disabled={loading} onClick={handleToggleLike}>
      <ArrowBigUp className="w-5 h-5" />
      <span className="text-sm font-medium h-5">
        {count > 0 ? count : <Minus className="w-4 h-4" />}
      </span>
    </button>
  );
}
