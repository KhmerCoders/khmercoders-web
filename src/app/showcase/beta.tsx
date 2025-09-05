'use client';

import { buttonVariants } from '@/components/generated/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/generated/table';
import { getApprovedShowcasesAction } from '@/server/actions/showcase';
import Link from 'next/link';
import { LoaderIcon, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ShowcaseRecord } from '@/types';

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
        <div className="px-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">No.</TableHead>
                <TableHead>Showcase Name</TableHead>
                <TableHead className="text-right w-20">Likes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {showcases.map((showcase, index) => (
                <TableRow key={showcase.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <Link
                      href={`/showcase/${showcase.alias}`}
                      className="font-semibold hover:underline text-blue-600 hover:text-blue-800"
                    >
                      {showcase.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>{showcase.likeCount || 0}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
