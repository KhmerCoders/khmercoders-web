'use client';

import { PostRecordWithProfile, FeedRecord } from '@/types';
import { useState, useEffect } from 'react';
import { ReplyEditor } from './ReplyEditor';
import { FeedItem } from './FeedItem';
import { Button } from '@/components/generated/button';
import { MessageCircle, Loader } from 'lucide-react';
import { getRepliesAction, createReplyAction } from '@/server/actions/post';
import { useSession } from '@/components/auth-provider';

export function ReplyList({
  parentPostId,
  replies: initialReplies,
  onReplyCreated,
}: {
  parentPostId: string;
  replies: PostRecordWithProfile[];
  onReplyCreated?: () => void; // callback to notify parent (e.g., increment count)
}) {
  const { session } = useSession();
  const [replies, setReplies] = useState<PostRecordWithProfile[]>(initialReplies);
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [isLoading, setIsLoading] = useState(initialReplies.length === 0);
  const [repliesLoaded, setRepliesLoaded] = useState(initialReplies.length > 0);

  // Fetch replies when component mounts
  useEffect(() => {
    const fetchReplies = async () => {
      if (repliesLoaded) return; // Already loaded

      setIsLoading(true);
      const result = await getRepliesAction(parentPostId);
      if (result.success && result.data) {
        setReplies(result.data);
      }
      setIsLoading(false);
      setRepliesLoaded(true);
    };

    if (initialReplies.length === 0) {
      fetchReplies();
    }
  }, [parentPostId, repliesLoaded, initialReplies.length]);

  // Called by ReplyEditor
  const handleSubmit = async (content: string) => {
    // Optimistic reply
    const tempId = `temp-${Date.now()}`;
    const now = new Date();

    const optimisticReply: PostRecordWithProfile = {
      id: tempId,
      createdAt: now,
      updatedAt: now,
      userId: session?.user?.id ?? 'unknown',
      resourceType: 'post',
      resourceId: null,
      content,
      likeCount: 0,
      commentCount: 0,
      parentPostId: parentPostId,
      user: {
        id: session?.user?.id ?? 'unknown',
        name: session?.user?.name ?? session?.user?.email ?? 'You',
        email: session?.user?.email ?? null,
        image: session?.user?.image ?? undefined,
        createdAt: now,
        updatedAt: now,
        reputation: 0,
        followersCount: 0,
        followingCount: 0,
        level: 0,
        storageUsed: 0,
        isBanned: false,
      },
    } as PostRecordWithProfile;

    setReplies(prev => [optimisticReply, ...prev]);
    // Notify parent to increment comment count
    onReplyCreated?.();

    try {
      const response = await createReplyAction(parentPostId, content);
      if (response.success && response.result) {
        // Replace optimistic reply with real one
        setReplies(prev => prev.map(r => (r.id === tempId ? response.result! : r)));
      } else {
        // Remove optimistic reply on failure
        setReplies(prev => prev.filter(r => r.id !== tempId));
        throw new Error(response.error || 'Failed to create reply');
      }
    } catch (err) {
      // Optionally: show an error toast (not implemented)
      console.error('Reply failed', err);
    }
  };

  return (
    <div className="ml-4 pl-4 border-l-2 border-muted-foreground/20 space-y-2">
      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground p-2">
          <Loader className="w-4 h-4 animate-spin" />
          Loading replies...
        </div>
      )}

      {/* Replies */}
      {replies.map(reply => {
        const feedRecord: FeedRecord = {
          type: 'post',
          data: reply,
          id: reply.id,
          createdAt: reply.createdAt,
        };
        return (
          <div key={reply.id} className="mt-2">
            <FeedItem feed={feedRecord} isReply={true} />
          </div>
        );
      })}

      {/* Reply Editor or Button */}
      {!showReplyEditor && !isLoading && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowReplyEditor(true)}
          className="ml-12 gap-1 text-xs"
        >
          <MessageCircle className="w-3 h-3" />
          Reply to this comment
        </Button>
      )}

      {showReplyEditor && (
        <ReplyEditor onSubmit={handleSubmit} onCancel={() => setShowReplyEditor(false)} />
      )}
    </div>
  );
}
