'use client';
import { useSession } from '@/components/auth-provider';
import { Button } from '@/components/generated/button';
import { Textarea } from '@/components/generated/textarea';
import { ShowcaseRecord } from '@/types';
import { Pencil } from 'lucide-react';
import { useCallback, useState } from 'react';
import { updateShowcaseDescriptionAction } from '@/server/actions/showcase';
import { MarkdownContent } from '@/components/MarkdownContent';

export function ShowcaseDescription({ showcase }: { showcase: ShowcaseRecord }) {
  const [description, setDescription] = useState<string>(showcase.description ?? '');
  const [staging, setStaging] = useState<string>(description);
  const [editMode, setEditMode] = useState(false);

  const { session } = useSession();
  const user = session?.user;
  const isOwner = user && showcase.userId === user.id;

  const handleSave = useCallback(async () => {
    try {
      await updateShowcaseDescriptionAction({
        showcaseId: showcase.id,
        description: staging,
      });
      setDescription(staging);
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update description:', error);
      // You might want to show a toast notification here
    }
  }, [showcase.id, staging]);

  if (editMode) {
    return (
      <div className="px-4 py-2">
        <Textarea
          autoFocus
          className="p-2"
          value={staging}
          onChange={e => setStaging(e.target.value)}
        />

        <div className="my-2 flex gap-2">
          <Button size={'sm'} variant={'outline'} onClick={handleSave}>
            Save
          </Button>
          <Button
            size={'sm'}
            variant={'destructive'}
            onClick={() => {
              setStaging(description);
              setEditMode(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <p className="px-6 text-sm">
      <div className="markdown">
        <MarkdownContent withoutMedia>
          {description ? description : '**No description available.**'}
        </MarkdownContent>
      </div>

      {isOwner && (
        <div
          onClick={() => setEditMode(true)}
          className="text-blue-600 text-sm flex gap-1 mt-2 items-center hover:underline cursor-pointer"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </div>
      )}
    </p>
  );
}
