'use client';

import { buttonVariants } from '@/components/generated/button';
import { getApprovedShowcasesAction } from '@/server/actions/showcase';
import Link from 'next/link';
import { LoaderIcon, Heart, ChevronUp, Minus, ArrowBigUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ShowcaseRecord } from '@/types';
import { cn } from '@/utils';
import { getResizeImage } from '@/utils/image';

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
        <div className="flex flex-col p-4">
          {showcases.map(showcase => {
            return (
              <Link
                key={showcase.id}
                href={`/showcase/${showcase.alias}`}
                className="group flex gap-2 rounded-lg overflow-hidden hover:bg-secondary transition-bg duration-200 p-4"
              >
                <div className="shrink-0">
                  {showcase.logo ? (
                    <img
                      src={getResizeImage(showcase.logo, { width: 64, height: 64 })}
                      alt={showcase.title}
                      className="size-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="size-16 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
                  )}
                </div>

                <div className="grow flex flex-col ml-2">
                  <h3 className="font-medium transition-colors group-hover:text-orange-500">
                    {showcase.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">{showcase.tagline}</p>
                </div>

                <div className="shrink-0">
                  <div className="size-16 border border-2 rounded-lg bg-background hover:border-orange-500 flex flex-col items-center justify-center text-gray-700 dark:text-gray-200">
                    <ArrowBigUp className="w-5 h-5" />
                    <span>
                      <Minus className="w-4 h-4" />
                    </span>
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
