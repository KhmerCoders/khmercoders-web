import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/generated/sheet';
import { AlignJustify, HomeIcon, PlusIcon, SearchIcon, Tv, TvMinimal } from 'lucide-react';
import Link from 'next/link';
import { MobileSheetContent } from './MobileSheetContent';

export function MobileTabNavigation() {
  const tabButtonClass = 'flex text-center p-3 items-center justify-center focus:outline-none';

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-screen bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 pb-safe">
      <nav className="grid grid-cols-5">
        <Link className={tabButtonClass} href="/">
          <HomeIcon />
        </Link>
        <Link className={tabButtonClass} href="/mobile-search">
          <SearchIcon />
        </Link>
        <Link className={tabButtonClass} href="/showcase" aria-label="Showcase">
          <TvMinimal />
        </Link>
        <Link className={tabButtonClass} href="/mobile-post">
          <PlusIcon />
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <button type="button" className={tabButtonClass}>
              <AlignJustify />
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Khmer Coders</SheetTitle>
            <SheetDescription></SheetDescription>
            <div className="mt-4">
              <MobileSheetContent />
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
