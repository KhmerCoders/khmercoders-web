'use client';
import { useCallback, useState } from 'react';
import { ArticleEditor, ArticleEditorValue } from '@/app/profile/article/components/ArticleEditor';
import { createArticleAction, updateArticlePublishAction } from '@/actions/article';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ArticleEditorHeader } from '../components/ArticleEditorHeader';

export default function BlogPage() {
  const router = useRouter();
  const [value, setValue] = useState<ArticleEditorValue>({
    title: '',
    slug: '',
    image: '',
    summary: '',
    content: '',
  });

  const {
    mutate: saveArticle,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({
      published = false,
      data,
    }: {
      data: ArticleEditorValue;
      published?: boolean;
    }) => {
      const result = await createArticleAction(data);
      if (published) {
        await updateArticlePublishAction(result.id, true);
      }
      return result;
    },
    onSuccess: data => {
      console.log('Article created successfully:', data);
      router.push(`/profile/article/${data.id}`); // Redirect to the article edit page
    },
  });

  const handleSaveDraft = useCallback(() => {
    saveArticle({ data: value, published: false });
  }, [value, saveArticle]);

  const handlePublish = useCallback(() => {
    saveArticle({ data: value, published: true });
  }, [value, saveArticle]);

  return (
    <>
      <ArticleEditorHeader
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        loading={isPending}
        errorMessage={error?.message}
      />
      <ArticleEditor onChange={setValue} value={value} />
    </>
  );
}
