'use client';
import { Button } from '@/components/generated/button';
import { PostRecordWithProfile } from '@/types';
import { cn } from '@/utils';
import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

export function ReplyEditor({
  onSubmit,
  onCancel,
}: {
  onSubmit: (content: string) => Promise<PostRecordWithProfile> | Promise<void>;
  onCancel: () => void;
}) {
  const [content, setContent] = useState<string>('');
  const [textareaHeight, setTextareaHeight] = useState<number>(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hiddenTextareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 300;
  const remainingChars = maxLength - content.length;
  const isOverLimit = content.length > maxLength;

  // Autofocus textarea when mounted
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Update height based on content
  useEffect(() => {
    if (hiddenTextareaRef.current) {
      const hiddenTextarea = hiddenTextareaRef.current;
      hiddenTextarea.style.height = 'auto';
      const scrollHeight = hiddenTextarea.scrollHeight;
      const newHeight = Math.max(100, Math.min(scrollHeight, 200));
      setTextareaHeight(newHeight);
    }
  }, [content]);

  const handleSubmit = async () => {
    if (isOverLimit || content.trim().length === 0) return;
    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3 pl-12 bg-muted/30 rounded-md border border-dashed">
      {/* Hidden textarea for measuring height */}
      <textarea
        ref={hiddenTextareaRef}
        className="absolute top-0 left-0 w-full p-3 resize-none outline-none border-none opacity-0 pointer-events-none z-[-1]"
        value={content}
        readOnly
        tabIndex={-1}
        style={{
          height: 'auto',
          minHeight: '100px',
          maxHeight: '200px',
        }}
      />

      {/* Main visible textarea */}
      <textarea
        ref={textareaRef}
        className={cn(
          'w-full p-3 resize-none outline-none border rounded-md',
          'bg-background text-foreground',
          'placeholder:text-muted-foreground',
          'border-input'
        )}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder={'Write your reply...'}
        style={{
          height: `${textareaHeight}px`,
          minHeight: '100px',
          maxHeight: '200px',
          overflow: textareaHeight >= 200 ? 'auto' : 'hidden',
        }}
      />

      <div className="flex justify-between items-center gap-2">
        <div className="text-xs text-muted-foreground">
          <span className={cn(isOverLimit && 'text-red-500')}>
            {content.length}/{maxLength}
          </span>
          {isOverLimit && <span className="text-red-500 ml-1">({-remainingChars} over limit)</span>}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
            className="gap-1"
          >
            <X className="w-3 h-3" />
            Cancel
          </Button>
          <Button
            disabled={isSubmitting || isOverLimit || content.trim().length === 0}
            size="sm"
            onClick={handleSubmit}
          >
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
}
