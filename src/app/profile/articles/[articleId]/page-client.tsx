'use client';
import { ArticleRecord } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArticleEditor, ArticleEditorValue } from '@/app/profile/articles/components/ArticleEditor';
import { updateArticleAction, updateArticlePublishAction } from '@/server/actions/article';
import { useMutation } from '@tanstack/react-query';
import { ArticleEditorHeader } from '../components/ArticleEditorHeader';
import { useNavigationGuard } from 'next-navigation-guard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/generated/alert-dialog';
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
  const hasUnsavedChangesRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const hasChanges =
      data.title !== value.title ||
      data.slug !== value.slug ||
      data.image !== value.image ||
      data.summary !== value.summary ||
      data.content !== value.content;
    hasUnsavedChangesRef.current = hasChanges;
  }, [value, data.title, data.slug, data.image, data.summary, data.content]);

  const navGuard = useNavigationGuard({
    enabled: hasUnsavedChangesRef.current && !submitting,
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
      setSubmitting(true);
      const result = await updateArticleAction(id, data);

      if (!result.success) {
        throw new Error(result.error);
      }

      if (published && result.updatedArticle) {
        await updateArticlePublishAction(result.updatedArticle.id, true);
      }
      setSubmitting(false);
      return result;
    },
  });

  const handleSaveDraft = useCallback(() => {
    saveArticle({ id: data.id, data: value, published: false });
  }, [value, saveArticle, data.id]);

  const handlePublish = useCallback(() => {
    saveArticle({ id: data.id, data: value, published: true });
  }, [value, saveArticle, data.id]);

  return (
    <>
      <ArticleEditorHeader
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        loading={isPending}
        errorMessage={error?.message}
        isUpdate
      />

      <div className="bg-card max-w-5xl p-4 container mx-auto border rounded">
        <ArticleEditor onChange={setValue} value={value} />
      </div>

      <AlertDialog open={navGuard.active}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes to your article. Are you sure you want to leave? All unsaved
              changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={navGuard.reject}>Stay on Page</AlertDialogCancel>
            <AlertDialogAction
              onClick={navGuard.accept}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
