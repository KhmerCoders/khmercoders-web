'use client';

import { Button, buttonVariants } from '@/components/generated/button';
import { Ellipsis, GithubIcon, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useCurrentShowcase } from './provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/generated/dropdown-menu';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/generated/dialog';
import { Input } from '@/components/generated/input';
import { updateShowcaseLinksAction } from '@/server/actions/showcase';

export function ShowcaseLinkSection() {
  const { showcase, isOwner } = useCurrentShowcase();
  const [modalType, setModalType] = useState<'edit-github' | 'edit-website' | null>(null);
  const [url, setUrl] = useState('');

  const [githubURL, setGithubURL] = useState(showcase.github || '');
  const [websiteURL, setWebsiteURL] = useState(showcase.website || '');

  const handleEdit = (type: 'edit-github' | 'edit-website') => {
    setModalType(type);
    if (type === 'edit-github') {
      setUrl(showcase.github);
    } else if (type === 'edit-website') {
      setUrl(showcase.website);
    }
  };

  const handleSave = () => {
    if (modalType === 'edit-github') {
      setGithubURL(url);
      updateShowcaseLinksAction({
        showcaseId: showcase.id,
        github: url,
      })
        .then()
        .catch();
    } else if (modalType === 'edit-website') {
      setWebsiteURL(url);
      updateShowcaseLinksAction({
        showcaseId: showcase.id,
        website: url,
      })
        .then()
        .catch();
    }

    setModalType(null);
  };

  return (
    <div className="flex items-center gap-6 px-6 mb-4">
      <Dialog
        open={modalType !== null}
        onOpenChange={openState => {
          if (!openState) {
            setModalType(null);
          }
        }}
      >
        <DialogContent>
          {modalType === 'edit-github' && (
            <DialogHeader>
              <DialogTitle>Edit GitHub URL</DialogTitle>
              <DialogDescription>
                Update the GitHub URL for your showcase. Leave it empty to remove the URL
              </DialogDescription>
            </DialogHeader>
          )}
          {modalType === 'edit-website' && (
            <DialogHeader>
              <DialogTitle>Edit Website URL</DialogTitle>
              <DialogDescription>
                Update the website URL for your showcase. Leave it empty to remove the URL
              </DialogDescription>
            </DialogHeader>
          )}

          <Input
            autoFocus
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full mt-4"
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalType(null)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {websiteURL && (
        <div className="text-sm flex items-center">
          <LinkIcon className="mr-2" size={14} />
          <Link
            href={websiteURL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-blue-600"
          >
            {websiteURL}
          </Link>
        </div>
      )}

      {githubURL && (
        <div className="text-sm flex items-center">
          <GithubIcon className="mr-2" size={14} />
          <Link
            href={githubURL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-blue-600"
          >
            {githubURL}
          </Link>
        </div>
      )}

      {isOwner && (
        <div className="grow justify-end flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={e => {
                  setTimeout(() => handleEdit('edit-github'), 100);
                }}
              >
                Edit Github URL
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={e => {
                  setTimeout(() => handleEdit('edit-website'), 100);
                }}
              >
                Edit Website URL
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
