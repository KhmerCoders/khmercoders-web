'use client';
import { GithubIcon, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useCurrentShowcase } from './provider';
import { ShowcaseLikePillButton } from '../likes';
import { cn } from '@/utils';

export function ShowcaseLinkSection() {
  const { showcase } = useCurrentShowcase();

  // Trimming the tailing slash for display purposes
  const formattedWebsite = showcase.website ? showcase.website.replace(/\/$/, '') : '';

  return (
    <>
      <div className="flex items-center gap-6 px-6 mb-4">
        {formattedWebsite && (
          <div className="text-sm flex items-center">
            <LinkIcon className="mr-2" size={14} />
            <Link
              href={showcase.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-blue-600"
            >
              {formattedWebsite}
            </Link>
          </div>
        )}

        {showcase.github && (
          <div className="text-sm flex items-center">
            <GithubIcon className="mr-2" size={14} />
            <Link
              href={showcase.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-blue-600"
            >
              Github
            </Link>
          </div>
        )}
      </div>

      <div className="px-6 py-2 flex gap-4">
        <ShowcaseLikePillButton
          defaultCount={showcase.likeCount}
          defaultLiked={showcase.hasCurrentUserLiked}
          resourceId={showcase.id}
        />

        <Link
          href={`/@${showcase.user?.profile?.alias}`}
          className={cn(
            'h-10 flex rounded-lg items-center px-3',
            'border hover:border-orange-500',
            'hover:bg-orange-500/10',
            'transition-colors'
          )}
        >
          {showcase.user?.image && (
            <img
              src={showcase.user.image}
              alt={showcase.user.name || 'User'}
              className="w-6 h-6 rounded-full mr-2"
            />
          )}
          {showcase.user?.name}
        </Link>
      </div>
    </>
  );
}
