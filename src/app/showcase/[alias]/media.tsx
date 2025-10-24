'use client';
import { Ellipsis, Plus } from 'lucide-react';
import { useCurrentShowcase } from './provider';
import { useState } from 'react';
import { useUserUpload } from '@/components/user-upload/context';
import { updateShowcaseCoverImageAction } from '@/server/actions/showcase';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/generated/dropdown-menu';
import { Button } from '@/components/generated/button';

export function ShowcaseMediaSection() {
  const { showcase, isOwner } = useCurrentShowcase();
  const { openUserUpload } = useUserUpload();

  const [coverImage, setCoverImage] = useState(() =>
    showcase.coverImage.split(',').filter(Boolean)
  );

  const handleAddMedia = () => {
    openUserUpload()
      .then(uploadedUrl => {
        if (uploadedUrl) {
          const newCoverImages = [...coverImage, uploadedUrl];

          updateShowcaseCoverImageAction({
            showcaseId: showcase.id,
            coverImage: newCoverImages,
          })
            .then()
            .catch(console.error);

          setCoverImage(newCoverImages);
        }
      })
      .catch(console.error);
  };

  const handleDeleteMedia = (index: number) => {
    const newCoverImages = coverImage.filter((_, i) => i !== index);

    updateShowcaseCoverImageAction({
      showcaseId: showcase.id,
      coverImage: newCoverImages,
    })
      .then()
      .catch(console.error);

    setCoverImage(newCoverImages);
  };

  const handleMoveMedia = (index: number, direction: 'left' | 'right') => {
    const newCoverImages = [...coverImage];
    const [movedImage] = newCoverImages.splice(index, 1);

    if (direction === 'left') {
      newCoverImages.splice(index - 1, 0, movedImage);
    } else {
      newCoverImages.splice(index + 1, 0, movedImage);
    }

    updateShowcaseCoverImageAction({
      showcaseId: showcase.id,
      coverImage: newCoverImages,
    })
      .then()
      .catch(console.error);

    setCoverImage(newCoverImages);
  };

  return (
    <div className="px-6 mt-6">
      <div className="mt-4 overflow-x-auto snap-x snap-mandatory py-4">
        <div className="flex gap-4 items-stretch">
          {isOwner && (
            <div
              onClick={handleAddMedia}
              className="snap-start rounded-lg overflow-hidden bg-gray-200 hover:bg-gray-300 cursor-pointer flex flex-col gap-2 items-center justify-center flex-none w-[240px] sm:w-[320px] md:w-[420px] aspect-[3/2]"
            >
              <Plus className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500">Add more showcase banner</span>
            </div>
          )}

          {coverImage.length > 0 &&
            coverImage.map((imageUrl, index) => (
              <div
                key={index}
                className="relative shadow snap-start rounded-lg overflow-hidden flex-none w-[240px] sm:w-[320px] md:w-[420px] aspect-[3/2]"
              >
                <img
                  src={imageUrl}
                  alt={`Showcase Media ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {isOwner && (
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={'outline'} size={'icon'}>
                          <Ellipsis />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="bottom" align="end">
                        <DropdownMenuItem onSelect={() => handleDeleteMedia(index)}>
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleMoveMedia(index, 'left')}>
                          Move Left
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleMoveMedia(index, 'right')}>
                          Move Right
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
