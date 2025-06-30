'use client';
import { ArticleRecord } from '@/types';
import { useCallback, useState } from 'react';
import { ArticleEditor, ArticleEditorValue } from '@/app/profile/article/components/ArticleEditor';
import { updateArticleAction, updateArticlePublishAction } from '@/actions/article';
import { useMutation } from '@tanstack/react-query';
import { ArticleEditorHeader } from '../components/ArticleEditorHeader';

interface ArticleEditClientPageProps {
  data: ArticleRecord;
}

export function ArticleEditClientPage({ data }: ArticleEditClientPageProps) {
  const [value, setValue] = useState<ArticleEditorValue>({
    title: data.title,
    slug: data.slug,
    image: data.image ?? '',
    summary: data.summary ?? '',
    content: data.content ?? '',
  });

  const {
    mutate: saveArticle,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({
      published = false,
      data,
      id,
    }: {
      id: string;
      data: ArticleEditorValue;
      published?: boolean;
    }) => {
      const result = await updateArticleAction(id, data);
      if (published) {
        await updateArticlePublishAction(result.id, true);
      }
      return result;
    },
  });

  const handleSaveDraft = useCallback(() => {
    saveArticle({ id: data.id, data: value, published: false });
  }, [value, saveArticle]);

  const handlePublish = useCallback(() => {
    saveArticle({ id: data.id, data: value, published: true });
  }, [value, saveArticle]);

  return (
    <>
      <ArticleEditorHeader
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        loading={isPending}
        errorMessage={error?.message}
        isUpdate
      />
      <ArticleEditor onChange={setValue} value={value} />
    </>
  );
}
