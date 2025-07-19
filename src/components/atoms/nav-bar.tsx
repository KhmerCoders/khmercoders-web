'use client';

import { Button } from '@/components/generated/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/generated/sheet';
import { cn } from '@/utils';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';
import { ModeToggle } from '../mode-toggle';
import { UserAvatar } from './user-avatar';

export const Navbar = () => {
  const pathname = usePathname();

  // Helper function to check if a link should be highlighted
  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex items-center flex-row">
      <div className="flex gap-2 sm:gap-4 items-center md:hidden">
        <UserAvatar />
        <NavbarContainer className="items-center flex-row" aria-label="Mobile Navigation">
          <Sheet>
            <SheetTrigger asChild>
              <button type="button" className="p-2">
                <Menu className="h-6 w-6 text-amber-500" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] border-0  backdrop-blur-md [&>button]:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6 pt-4">
                  <Image src="/khmer-coder.svg" alt="Khmer Coders" width={100} height={100} />
                  <SheetTitle className="sr-only">Khmer Coders</SheetTitle>

                  <div className="flex items-center gap-0.5">
                    <ModeToggle variant="ghost" />
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="size-6 text-amber-500" />
                        <span className="sr-only">Close</span>
                      </Button>
                    </SheetClose>
                  </div>
                </div>

                <div className="flex flex-col gap-2 px-2">
                  <SheetClose asChild>
                    <NavbarLink
                      href="/events"
                      isHighlighted={isActiveLink('/events')}
                      className="w-full justify-start px-4 rounded-xl hover:bg-amber-500/10"
                    >
                      Events
                    </NavbarLink>
                  </SheetClose>
                  <SheetClose asChild>
                    <NavbarLink
                      href="/teams"
                      isHighlighted={isActiveLink('/teams')}
                      className="w-full justify-start px-4 rounded-xl hover:bg-amber-500/10"
                    >
                      Teams
                    </NavbarLink>
                  </SheetClose>
                  <SheetClose asChild>
                    <NavbarLink
                      href="/partners"
                      isHighlighted={isActiveLink('/partners')}
                      className="w-full justify-start px-4 rounded-xl hover:bg-amber-500/10"
                    >
                      Partners
                    </NavbarLink>
                  </SheetClose>
                  <SheetClose asChild>
                    <NavbarLink
                      href="/community"
                      isHighlighted={isActiveLink('/community')}
                      className="w-full justify-start px-4 rounded-xl hover:bg-amber-500/10"
                    >
                      Community
                    </NavbarLink>
                  </SheetClose>
                  <SheetClose asChild>
                    <NavbarLink
                      href="/donate"
                      isHighlighted={isActiveLink('/donate')}
                      className="w-full justify-start px-4 rounded-xl hover:bg-amber-500/10"
                    >
                      Donate
                    </NavbarLink>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </NavbarContainer>
      </div>
      <div className="hidden md:flex gap-4 items-center">
        <NavbarContainer isDesktop aria-label="Main Navigation">
          <NavbarLink href="/events" isHighlighted={isActiveLink('/events')}>
            Events
          </NavbarLink>
          <NavbarLink href="/teams" isHighlighted={isActiveLink('/teams')}>
            Teams
          </NavbarLink>
          <NavbarLink href="/partners" isHighlighted={isActiveLink('/partners')}>
            Partners
          </NavbarLink>
          <NavbarLink href="/community" isHighlighted={isActiveLink('/community')}>
            Community
          </NavbarLink>
          <NavbarLink href="/donate" isHighlighted={isActiveLink('/donate')}>
            Donate
          </NavbarLink>
        </NavbarContainer>
        <ModeToggle />
        <UserAvatar />
      </div>
    </div>
  );
};

export default Navbar;

export const NavbarContainer = ({
  children,
  className,
  isDesktop,
  ...props
}: ComponentProps<'nav'> & { isDesktop?: boolean }) => {
  return (
    <nav
      className={cn('flex w-fit', className, {
        'md:[&_a]:text-[0.8125rem] md:[&_a]:sm:w-20 lg:[&_a]:text-sm lg:[&_a]:sm:w-28': isDesktop,
      })}
      {...props}
    >
      <ul className="flex w-fit items-center justify-between">{children}</ul>
    </nav>
  );
};

export const NavbarLink = ({
  children,
  href,
  isHighlighted,
  className,
  ...props
}: {
  isHighlighted?: boolean;
  href: string;
} & Omit<ComponentProps<typeof Link>, 'href'>) => {
  return (
    <Link
      href={href}
      className={cn(
        'relative inline-flex text-sm h-11 tracking-tight items-center',
        isHighlighted
          ? 'text-amber-400 bg-amber-500/10 rounded-[14px] hover:bg-amber-500/20 transition-all hover:scale-105 dark:text-amber-400 dark:bg-amber-500/10 dark:hover:bg-amber-500/20'
          : 'text-amber-500 hover:text-amber-500 before:absolute before:inset-0 before:bg-neutral-500/20 hover:before:scale-100 before:scale-50 before:opacity-0 hover:before:opacity-100 before:transition before:rounded-[14px]',
        'sm:w-28 sm:justify-center',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};
