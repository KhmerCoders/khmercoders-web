'use client';
import { Button } from '@/components/generated/button';

export interface ArticleEditorValue {
  title: string;
  slug: string;
  image: string;
  summary: string;
  content: string;
}

interface ArticleEditorProps {
  value: ArticleEditorValue;
  onChange: React.Dispatch<React.SetStateAction<ArticleEditorValue>>;
}
import { Input } from '@/components/generated/input';
import { Label } from '@/components/generated/label';
import { Textarea } from '@/components/generated/textarea';
import dynamic from 'next/dynamic';

const SimpleEditor = dynamic(
  () => import('@/components/tiptap-templates/simple/simple-editor').then(mod => mod.SimpleEditor),
  { ssr: false }
);
import { useUserUpload } from '@/components/user-upload/context';

import { produce } from 'immer';
import { useCallback, useState } from 'react';

export function ArticleEditor({ value, onChange }: ArticleEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange((prev: ArticleEditorValue) =>
        produce(prev, (draft: ArticleEditorValue) => {
          draft.title = e.target.value;
        })
      );
    },
    [onChange]
  );

  const handleSlugChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange((prev: ArticleEditorValue) =>
        produce(prev, (draft: ArticleEditorValue) => {
          draft.slug = e.target.value;
        })
      );
    },
    [onChange]
  );

  const handleSummaryChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange((prev: ArticleEditorValue) =>
        produce(prev, (draft: ArticleEditorValue) => {
          draft.summary = e.target.value;
        })
      );
    },
    [onChange]
  );

  const handleContentChange = useCallback(
    (newContent: string) => {
      onChange((prev: ArticleEditorValue) =>
        produce(prev, (draft: ArticleEditorValue) => {
          draft.content = newContent;
        })
      );
    },
    [onChange]
  );

  const handleImageChange = useCallback(
    (newImage: string) => {
      onChange((prev: ArticleEditorValue) =>
        produce(prev, (draft: ArticleEditorValue) => {
          draft.image = newImage;
        })
      );
    },
    [onChange]
  );

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Title</Label>
          <Input type="text" placeholder="Title" value={value.title} onChange={handleTitleChange} />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Slug (Optional)</Label>
          <Input
            type="text"
            placeholder="eg: hello-world-article"
            value={value.slug}
            onChange={handleSlugChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Summary</Label>
          <Textarea placeholder="Summary" value={value.summary} onChange={handleSummaryChange} />
        </div>

        <ArticleEditorImageInput value={value.image} onChange={handleImageChange} />

        <div className="flex flex-row gap-2 items-center">
          <Button variant="default" onClick={() => setShowPreview(true)}>
            Edit & Preview Article
          </Button>
        </div>
      </div>

      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          style={{ animation: 'fadeIn 0.2s' }}
        >
          <div className="relative w-full h-full flex flex-col">
            <Button
              className="absolute top-0 left-4 z-50"
              variant="secondary"
              onClick={() => setShowPreview(false)}
            >
              Exit Preview
            </Button>
            <div className="flex-1 min-h-0 min-w-0 bg-white dark:bg-black rounded shadow-lg overflow-auto">
              <SimpleEditor
                content={value.content}
                onChange={handleContentChange}
                readOnly={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function ArticleEditorImageInput({
  onChange,
  value,
}: {
  value?: string;
  onChange: (value: string) => void;
}) {
  const { openUserUpload } = useUserUpload();

  const handleUpload = useCallback(async () => {
    try {
      const url = await openUserUpload('upload');
      if (url) {
        onChange(url);
      }
    } catch (err) {
      alert('Image upload failed: ' + (err as Error).message);
    }
  }, [onChange, openUserUpload]);

  if (value) {
    return (
      <div className="border relative h-72 rounded overflow-hidden">
        <img src={value} alt="Article Image" className="w-full h-full object-cover" />
        <Button
          className="absolute top-2 right-2 shadow-md"
          variant={'secondary'}
          onClick={() => onChange('')}
        >
          Remove
        </Button>
        <Button
          className="absolute bottom-2 right-2 shadow-md"
          variant={'default'}
          onClick={handleUpload}
        >
          Change Image
        </Button>
      </div>
    );
  }

  return (
    <div className="border h-64 rounded items-center justify-center flex flex-col gap-2">
      <div className="text-gray-500 text-sm">Upload your image</div>
      <Button variant={'secondary'} onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
}
