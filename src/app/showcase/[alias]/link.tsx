'use client';
import { GithubIcon, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useCurrentShowcase } from './provider';

export function ShowcaseLinkSection() {
  const { showcase } = useCurrentShowcase();

  // Trimming the tailing slash for display purposes
  const formattedWebsite = showcase.website ? showcase.website.replace(/\/$/, '') : '';

  return (
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
  );
}
