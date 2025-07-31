'use client';
import { Button } from '@/components/generated/button';
import { createPostAction } from '@/server/actions/post';
import { PostType, PostRecordWithProfile } from '@/types';
import { cn } from '@/utils';
import { useMutation } from '@tanstack/react-query';
import { useState, useRef, useEffect } from 'react';

export function CommentEditor({
  resourceId,
  resourceType,
  onSuccess,
}: {
  resourceType: PostType;
  resourceId: string | null;
  onSuccess: (post: PostRecordWithProfile) => void;
}) {
  const [content, setContent] = useState<string>('');
  const [textareaHeight, setTextareaHeight] = useState<number>(150);
  const hiddenTextareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 300;
  const remainingChars = maxLength - content.length;
  const isOverLimit = content.length > maxLength;

  // Update height based on content
  useEffect(() => {
    if (hiddenTextareaRef.current) {
      const hiddenTextarea = hiddenTextareaRef.current;
      hiddenTextarea.style.height = 'auto';
      const scrollHeight = hiddenTextarea.scrollHeight;
      const newHeight = Math.max(150, Math.min(scrollHeight, 300));
      setTextareaHeight(newHeight);
    }
  }, [content]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (newPost: {
      content: string;
      resourceId: string | null;
      resourceType: PostType;
    }) => {
      const response = await createPostAction(resourceType, resourceId, newPost.content);
      if (!response.success) {
        throw new Error('Failed to create post');
      }

      return response.result!;
    },
    onSuccess: post => {
      setContent(''); // Clear the text after successful submission
      onSuccess(post);
    },
  });

  return (
    <div className="flex flex-col gap-4 mb-4 md:mb-0">
      {/* Hidden textarea for measuring height */}
      <textarea
        ref={hiddenTextareaRef}
        className="absolute top-0 left-0 w-full p-4 resize-none outline-none border-none opacity-0 pointer-events-none z-[-1]"
        value={content}
        readOnly
        tabIndex={-1}
        style={{
          height: 'auto',
          minHeight: '150px',
          maxHeight: '300px',
        }}
      />

      {/* Main visible textarea */}
      <textarea
        className={cn(
          'w-full p-4 resize-none outline-none border-none',
          'bg-transparent text-foreground',
          'placeholder:text-muted-foreground'
        )}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder={'Please write your comment here...'}
        style={{
          height: `${textareaHeight}px`,
          minHeight: '150px',
          maxHeight: '300px',
          overflow: textareaHeight >= 300 ? 'auto' : 'hidden',
        }}
      />

      <div className="px-4 pb-2 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Character count circle indicator */}
          <div className="relative w-8 h-8">
            <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
              {/* Background circle */}
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted-foreground/20"
              />
              {/* Progress circle */}
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 14}`}
                strokeDashoffset={`${2 * Math.PI * 14 * (1 - Math.min(content.length / maxLength, 1))}`}
                className={cn(
                  'transition-all duration-200',
                  content.length < maxLength * 0.8
                    ? 'text-primary'
                    : content.length < maxLength
                      ? 'text-yellow-500'
                      : 'text-red-500'
                )}
                strokeLinecap="round"
              />
            </svg>
            {/* Character count text */}
            {content.length > maxLength * 0.8 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={cn(
                    'text-xs font-medium',
                    isOverLimit ? 'text-red-500' : 'text-muted-foreground'
                  )}
                >
                  {isOverLimit ? -remainingChars : remainingChars}
                </span>
              </div>
            )}
          </div>

          {/* Text description */}
          <div className="text-sm text-muted-foreground">
            <span className={cn(isOverLimit && 'text-red-500')}>
              {content.length}/{maxLength}
            </span>
            {isOverLimit && (
              <span className="text-red-500 ml-1">({-remainingChars} over limit)</span>
            )}
          </div>
        </div>

        <Button
          disabled={isPending || isOverLimit || content.trim().length === 0}
          size="sm"
          onClick={() => {
            mutate({ content, resourceId, resourceType });
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
