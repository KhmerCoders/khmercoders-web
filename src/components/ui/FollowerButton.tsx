'use client';
import { followUserAction, unfollowUserAction } from '@/server/actions/follower';
import { Loader, UserPlus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from '../generated/button';
import { useSession } from '../auth-provider';

interface FollowButtonProps {
  defaultFollowed?: boolean;
  targetUserId: string;
}

export function FollowButton({ defaultFollowed, targetUserId }: FollowButtonProps) {
  const { session } = useSession();
  const [followed, setFollowed] = useState(defaultFollowed || false);
  const [loading, setLoading] = useState(false);

  const handleToggleFollow = useCallback(() => {
    setLoading(true);
    (followed ? unfollowUserAction : followUserAction)(targetUserId)
      .then(() => {
        setFollowed(!followed);
      })
      .catch(error => {
        console.error('Error toggling follow:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [followed, targetUserId]);

  if (!session || session.user.id === targetUserId) {
    return null; // or render a login prompt
  }

  return (
    <Button
      size={'sm'}
      variant={followed ? 'secondary' : 'default'}
      onClick={handleToggleFollow}
      className="transition-all duration-200"
      disabled={loading}
    >
      {loading ? <Loader className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
      {followed ? 'Unfollow' : 'Follow'}
    </Button>
  );
}
