'use client';
import { cn } from '@/utils';
import { useCurrentShowcase } from './provider';
import { useCallback, useState } from 'react';
import { useUserUpload } from '@/components/user-upload/context';
import { updateShowcaseLogoAction } from '@/server/actions/showcase';

export function ShowcaseLogo() {
  const { isOwner, showcase } = useCurrentShowcase();
  const { openUserUpload } = useUserUpload();
  const [logo, setLogo] = useState<string | null>(showcase.logo || null);

  const handleUpdate = useCallback(() => {
    openUserUpload('upload')
      .then(file => {
        if (!file) return;
        updateShowcaseLogoAction({ showcaseId: showcase.id, logo: file })
          .then(() => {
            setLogo(file);
          })
          .catch();
      })
      .catch();
  }, [showcase]);

  return (
    <div
      onClick={handleUpdate}
      className={cn('w-16 h-16 rounded bg-gray-500', isOwner && 'cursor-pointer')}
    >
      {logo && (
        <img
          src={logo}
          alt={`${showcase.title} Logo`}
          className="w-full h-full object-cover rounded"
        />
      )}
    </div>
  );
}
