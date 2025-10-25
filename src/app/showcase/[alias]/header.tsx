'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/generated/dropdown-menu';
import { ShowcaseLogo } from './logo';
import { useCurrentShowcase } from './provider';
import { Button } from '@/components/generated/button';
import { Ellipsis } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/generated/dialog';
import { useState } from 'react';
import { Input } from '@/components/generated/input';
import { updateShowcaseDescriptionAction } from '@/server/actions/showcase';

export function ShowcaseHeader() {
  const { showcase, isOwner } = useCurrentShowcase();
  const [editMode, setEditMode] = useState<'name' | 'tagline' | null>(null);

  const handleCloseDialog = () => {
    setEditMode(null);
  };

  return (
    <>
      {editMode === 'tagline' && <DialogEditTagline onClose={handleCloseDialog} />}

      <div className="flex gap-4 p-6">
        <ShowcaseLogo />
        <div className="flex flex-col justify-center">
          <div className="font-semibold text-lg">{showcase.title}</div>
          <div className="text-muted-foreground line-clamp-3">
            {showcase.tagline || 'No tagline available'}
          </div>
        </div>
        {isOwner && (
          <div className="grow justify-end flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={'icon'} variant="outline">
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem
                  onSelect={() => requestAnimationFrame(() => setEditMode('tagline'))}
                >
                  Edit Product Tagline
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </>
  );
}

function DialogEditTagline({ onClose }: { onClose: () => void }) {
  const { showcase, setShowcase } = useCurrentShowcase();
  const [tagline, setTagline] = useState(showcase.tagline || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    updateShowcaseDescriptionAction({
      showcaseId: showcase.id,
      tagline,
    })
      .then(() => {
        setShowcase({ ...showcase, tagline });
        onClose();
      })
      .catch()
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <Dialog
      open
      onOpenChange={openState => {
        if (isSaving) return;
        if (!openState) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product Tagline</DialogTitle>
          <DialogDescription>
            Update the short summary shown on your product page.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          <Input
            value={tagline}
            onChange={e => setTagline(e.target.value)}
            placeholder="Write a short tagline"
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
