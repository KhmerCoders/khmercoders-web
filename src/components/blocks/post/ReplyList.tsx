'use client';

import { NestedReplyTree } from './NestedReplyTree';

export function ReplyList({
  parentPostId,
  onReplyCreated,
}: {
  parentPostId: string;
  replies?: never; // Deprecated - now handled by NestedReplyTree
  onReplyCreated?: () => void;
}) {
  return (
    <NestedReplyTree
      parentPostId={parentPostId}
      depth={0}
      maxDepth={3}
      onReplyCreated={onReplyCreated}
    />
  );
}
