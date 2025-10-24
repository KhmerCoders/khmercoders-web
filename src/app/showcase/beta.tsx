'use client';

import { buttonVariants } from '@/components/generated/button';
import { getApprovedShowcasesAction } from '@/server/actions/showcase';
import Link from 'next/link';
import { LoaderIcon, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ShowcaseRecord } from '@/types';
import { cn } from '@/utils';

export function ShowcaseBetaPage() {
  const [showcases, setShowcases] = useState<ShowcaseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShowcases = async () => {
      try {
        const result = await getApprovedShowcasesAction();
        if (result.success) {
          setShowcases(result.showcases || []);
        } else {
          setError(result.error || 'Failed to load showcases');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShowcases();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <LoaderIcon className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading showcases...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Community Showcases</h2>
          <p className="text-muted-foreground">Discover amazing projects built by our community</p>
        </div>
        <Link href="/showcase/create" className={buttonVariants({ variant: 'default' })}>
          Add Showcase
        </Link>
      </div>

      {showcases.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          <p className="text-lg">No approved showcases yet.</p>
          <p>Be the first to share your project with the community!</p>
        </div>
      ) : (
        <div className="px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {showcases.map(showcase => {
            const coverImage = showcase.coverImage.split(',')[0];

            return (
              <Link
                key={showcase.id}
                href={`/showcase/${showcase.alias}`}
                className={cn('block', 'rounded-lg', 'border', 'overflow-hidden')}
              >
                <div className="w-full aspect-[2/1] bg-gray-200 relative border-b">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={showcase.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}

                  {showcase.logo ? (
                    <img
                      src={showcase.logo}
                      alt={showcase.title}
                      className="w-24 h-24 mb-2 border border-4 border-white absolute -bottom-8 left-4 bg-white rounded"
                    />
                  ) : (
                    <div className="w-24 h-24 mb-2 border border-4 border-white absolute -bottom-8 left-4 bg-gray-300 rounded" />
                  )}
                </div>
                <div className="p-4 pt-8 flex flex-col">
                  <div className="font-medium text-lg">{showcase.title}</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    {showcase.user?.name}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
