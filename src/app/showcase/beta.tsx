'use client';
import { getApprovedShowcasesAction } from '@/server/actions/showcase';
import { useEffect, useState } from 'react';
import { ShowcaseRecord } from '@/types';
import { ShowcaseRow, ShowcaseSkeleton } from '@/components/showcase/ShowcaseRow';

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

          {showcases.map(showcase => (
            <ShowcaseRow key={showcase.id} showcase={showcase} />
          ))}
        </div>
      )}
    </div>
  );
}
