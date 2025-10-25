'use client';
import { getApprovedShowcasesAction } from '@/server/actions/showcase';
import Link from 'next/link';
import { Minus, ArrowBigUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ShowcaseRecord } from '@/types';
import { getResizeImage } from '@/utils/image';
import { useSession } from '@/components/auth-provider';

export function ShowcaseBetaPage() {
  const [showcases, setShowcases] = useState<ShowcaseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useSession();

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

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-base p-4">Discover amazing projects built by our community</p>

      {!isLoading && showcases.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          <p className="text-lg">No approved showcases yet.</p>
          <p>Be the first to share your project with the community!</p>
        </div>
      ) : (
        <div className="flex flex-col p-4">
          {isLoading && (
            <>
              <ShowcaseSkeleton />
              <ShowcaseSkeleton />
              <ShowcaseSkeleton />
            </>
          )}

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

                <div className="grow flex flex-col ml-2 justify-center">
                  <h3 className="font-medium transition-colors group-hover:text-orange-500">
                    {showcase.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{showcase.tagline}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="size-4 rounded-full bg-gray-300 dark:bg-gray-700" />
                    <span className="text-xs text-muted-foreground">{showcase.user?.name}</span>
                  </div>
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

function ShowcaseSkeleton() {
  return (
    <div>
      <div className="animate-pulse flex gap-2 rounded-lg overflow-hidden hover:bg-secondary transition-bg duration-500 p-4">
        <div className="shrink-0">
          <div className="size-16 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
        </div>

        <div className="grow flex flex-col ml-2 space-y-2">
          <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2 mt-2"></div>
          <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4"></div>
        </div>

        <div className="shrink-0">
          <div className="size-16 border border-2 rounded-lg bg-background flex flex-col items-center justify-center text-gray-700 dark:text-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
