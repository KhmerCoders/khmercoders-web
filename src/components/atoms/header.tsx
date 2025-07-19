'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from './nav-bar';

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="bg-white dark:bg-black py-1 px-4 xl:px-16 flex items-center gap-2 lg:gap-12 mb-8 justify-between bg-background border-b shadow-[0_2px_8px_-1px_rgba(251,146,60,0.4)]">
      <Link href="/" className="flex items-center z-9999">
        <div className="w-14 h-14 flex items-center justify-center">
          <Image
            src="/khmer-coder.svg"
            alt="Khmer Coders"
            width={isHomePage ? 56 : 48}
            height={isHomePage ? 56 : 48}
            className="object-contain transition-all duration-300 hover:scale-110"
          />
        </div>
        <span className="text-orange-400 font-mono tracking-tight font-semibold">KhmerCoders</span>
      </Link>
      <div className="flex-1 lg:hidden" />
      <Navbar />
    </header>
  );
}
