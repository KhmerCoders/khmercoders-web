import { Button } from '@/components/generated/button';
import { Input } from '@/components/generated/input';
import { Label } from '@/components/generated/label';
import { Textarea } from '@/components/generated/textarea';
import { MarkdownEditor } from '@/components/markdown-editor';
import { useUserUpload } from '@/components/user-upload/context';
import { produce } from 'immer';
import { Dispatch, SetStateAction, useCallback } from 'react';

export interface ArticleEditorValue {
  title: string;
  slug: string;
  image: string;
  summary: string;
  content: string;
}

interface ArticleEditorProps {
  value: ArticleEditorValue;
  onChange: Dispatch<SetStateAction<ArticleEditorValue>>;
}

export function ArticleEditor({ value, onChange }: ArticleEditorProps) {
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(prev =>
        produce(prev, draft => {
          draft.title = e.target.value;
        })
      );
    },
    [onChange]
  );

  const handleSlugChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(prev =>
        produce(prev, draft => {
          draft.slug = e.target.value;
        })
      );
    },
    [onChange]
  );

  const handleSummaryChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(prev =>
        produce(prev, draft => {
          draft.summary = e.target.value;
        })
      );
    },
    [onChange]
  );

  const handleContentChange = useCallback(
    (newContent: string) => {
      onChange(prev =>
        produce(prev, draft => {
          draft.content = newContent;
        })
      );
    },
    [onChange]
  );

  const handleImageChange = useCallback(
    (newImage: string) => {
      onChange(prev =>
        produce(prev, draft => {
          draft.image = newImage;
        })
      );
    },
    [onChange]
  );

  return (
    <div className="max-w-4xl mx-auto my-4 mb-12">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Title</Label>
          <Input placeholder="Title" value={value.title} onChange={handleTitleChange} />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Slug (Optional)</Label>
          <Input
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
        <MarkdownEditor value={value.content} onChange={handleContentChange} />
      </div>
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
  const handleUpload = useCallback(
    (type: 'upload' | 'file') => {
      openUserUpload(type).then(result => {
        if (result && onChange) {
          onChange(result);
        }
      });
    },
    [onChange, openUserUpload]
  );

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
          onClick={() => handleUpload('upload')}
        >
          Change Image
        </Button>
      </div>
    );
  }

  return (
    <div className="border h-64 rounded items-center justify-center flex flex-col gap-2">
      <div className="text-gray-500 text-sm">
        Upload your image or browse existing uploaded file
      </div>
      <div className="flex gap-2">
        <Button variant={'secondary'} onClick={() => handleUpload('upload')}>
          Upload
        </Button>
        <Button variant={'secondary'} onClick={() => handleUpload('file')}>
          Browse Your Storage
        </Button>
      </div>
    </div>
  );
}
