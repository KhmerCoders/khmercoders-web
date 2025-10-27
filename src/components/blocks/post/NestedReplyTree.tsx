'use client';

import { PostRecordWithProfile, FeedRecord } from '@/types';
import { useState, useEffect } from 'react';
import { FeedItem } from './FeedItem';
import { ReplyEditor } from './ReplyEditor';
import { Button } from '@/components/generated/button';
import { MessageCircle, Loader, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import {
  getRepliesAction,
  createReplyAction,
  deleteReplyAction,
  checkContentModeration,
} from '@/server/actions/post';
import { useSession } from '@/components/auth-provider';
import { toast } from 'sonner';

interface NestedReplyTreeProps {
  parentPostId: string;
  depth: number; // Current nesting depth (0 = top-level replies)
  maxDepth?: number; // Maximum nesting depth (default: 3)
  onReplyCreated?: () => void; // Callback to notify parent
  onReplyDeleted?: () => void; // Callback when reply is deleted
}

/**
 * Recursive component that renders replies at any depth.
 * Supports nested threading similar to Facebook/Reddit.
 * Includes moderation checks and delete functionality.
 */
export function NestedReplyTree({
  parentPostId,
  depth = 0,
  maxDepth = 3,
  onReplyCreated,
  onReplyDeleted,
}: NestedReplyTreeProps) {
  const { session } = useSession();
  const [replies, setReplies] = useState<PostRecordWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  // Fetch direct replies to this post
  useEffect(() => {
    const fetchReplies = async () => {
      setIsLoading(true);
      const result = await getRepliesAction(parentPostId);
      if (result.success && result.data) {
        setReplies(result.data);
      }
      setIsLoading(false);
    };

    fetchReplies();
  }, [parentPostId]);

  const handleSubmit = async (content: string) => {
    // Run moderation check before allowing post
    const moderation = checkContentModeration(content);
    if (!moderation.approved) {
      toast.error(moderation.reason || 'Your reply cannot be posted');
      return;
    }

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
      parentPostId,
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
    onReplyCreated?.();

    try {
      const response = await createReplyAction(parentPostId, content);
      if (response.success && response.result) {
        setReplies(prev => prev.map(r => (r.id === tempId ? response.result! : r)));
        toast.success('Reply posted!');
      } else {
        setReplies(prev => prev.filter(r => r.id !== tempId));
        throw new Error(response.error || 'Failed to create reply');
      }
    } catch (err) {
      console.error('Reply failed', err);
      toast.error('Failed to post reply');
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!confirm('Delete this reply and all nested replies?')) {
      return;
    }

    setDeletingIds(prev => new Set(prev).add(replyId));

    try {
      const response = await deleteReplyAction(replyId);
      if (response.success) {
        setReplies(prev => prev.filter(r => r.id !== replyId));
        onReplyDeleted?.();
        toast.success('Reply deleted');
      } else {
        toast.error(response.error || 'Failed to delete reply');
      }
    } catch (err) {
      console.error('Delete failed', err);
      toast.error('Failed to delete reply');
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(replyId);
        return next;
      });
    }
  };

  const toggleExpandReply = (replyId: string) => {
    setExpandedReplies(prev => {
      const next = new Set(prev);
      if (next.has(replyId)) {
        next.delete(replyId);
      } else {
        next.add(replyId);
      }
      return next;
    });
  };

  // Determine indentation and styling based on depth
  const paddingLeft = depth === 0 ? 'pl-4' : `pl-${Math.min(depth * 2, 12)}`;
  const borderClass =
    depth === 0 ? 'border-l-2 border-muted-foreground/20' : 'border-l-2 border-muted-foreground/10';

  return (
    <div className={`${borderClass} space-y-2 ml-4 ${paddingLeft}`}>
      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground p-2">
          <Loader className="w-4 h-4 animate-spin" />
          Loading replies...
        </div>
      )}

      {/* Render each reply and its nested replies */}
      {replies.map(reply => {
        const isExpanded = expandedReplies.has(reply.id);
        const hasNestedReplies = reply.commentCount > 0;
        const isDeleting = deletingIds.has(reply.id);
        const isOwnReply = session?.user?.id === reply.userId;

        const feedRecord: FeedRecord = {
          type: 'post',
          data: reply,
          id: reply.id,
          createdAt: reply.createdAt,
        };

        return (
          <div
            key={reply.id}
            className={`space-y-2 transition-opacity ${isDeleting ? 'opacity-50' : ''}`}
          >
            {/* Reply item with toggle for nested replies */}
            <div className="flex items-start gap-2">
              {/* Toggle nested replies (only if they exist and depth < maxDepth) */}
              {hasNestedReplies && depth < maxDepth && (
                <button
                  onClick={() => toggleExpandReply(reply.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors mt-1 flex-shrink-0"
                  aria-label={isExpanded ? 'Collapse replies' : 'Expand replies'}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}

              {/* Reply content */}
              <div className="flex-1">
                <FeedItem feed={feedRecord} isReply={true} />
              </div>

              {/* Delete button - only for own replies */}
              {isOwnReply && !reply.id.startsWith('temp-') && (
                <button
                  onClick={() => handleDeleteReply(reply.id)}
                  disabled={isDeleting}
                  className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50 flex-shrink-0"
                  title="Delete reply"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Nested replies - recursively rendered if expanded */}
            {isExpanded && hasNestedReplies && depth < maxDepth && (
              <NestedReplyTree
                parentPostId={reply.id}
                depth={depth + 1}
                maxDepth={maxDepth}
                onReplyCreated={() => {
                  // Increment reply count on parent when a nested reply is added
                  setReplies(prev =>
                    prev.map(r =>
                      r.id === reply.id ? { ...r, commentCount: r.commentCount + 1 } : r
                    )
                  );
                }}
                onReplyDeleted={() => {
                  // Decrement reply count when nested reply is deleted
                  setReplies(prev =>
                    prev.map(r =>
                      r.id === reply.id && r.commentCount > 0
                        ? { ...r, commentCount: r.commentCount - 1 }
                        : r
                    )
                  );
                }}
              />
            )}
          </div>
        );
      })}

      {/* Reply button - only show if depth < maxDepth or no max limit */}
      {depth < maxDepth && session?.user && (
        <>
          {!showReplyEditor && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyEditor(true)}
              className={`${depth > 0 ? 'ml-6' : 'ml-12'} gap-1 text-xs`}
            >
              <MessageCircle className="w-3 h-3" />
              Reply
            </Button>
          )}

          {showReplyEditor && (
            <ReplyEditor onSubmit={handleSubmit} onCancel={() => setShowReplyEditor(false)} />
          )}
        </>
      )}
    </div>
  );
}
