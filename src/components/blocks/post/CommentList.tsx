'use client';

import { useSession } from '@/components/auth-provider';
import { FeedRecord, PostType, PostRecordWithProfile } from '@/types';
import { useState } from 'react';
import { CommentEditor } from './CommentEditor';
import { FeedList } from './FeedList';

interface PostListProps {
  posts: FeedRecord[];
  resourceType: PostType;
  resourceId: string | null;
}

export function CommentList({ posts: defaultPostList, resourceId, resourceType }: PostListProps) {
  const { session } = useSession();
  const [posts, setPosts] = useState<FeedRecord[]>(defaultPostList);

  return (
    <div>
      {session?.user && (
        <div className="p-4 border-y">
          <CommentEditor
            resourceId={resourceId}
            resourceType={resourceType}
            onSuccess={newPost => {
              setPosts(prevPosts => [
                {
                  data: { ...newPost, hasCurrentUserLiked: false },
                  type: 'post',
                  id: newPost.id,
                  createdAt: newPost.createdAt,
                },
                ...prevPosts,
              ]);
              console.log('New post added:', newPost);
            }}
          />
        </div>
      )}
      <FeedList feeds={posts} />
    </div>
  );
}
