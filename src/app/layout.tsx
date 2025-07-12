import '@/app/globals.css';
import Navbar from '@/components/atoms/nav-bar';
import { KhmerCoderDevtool } from '@/components/devtool';
import { ReactQueryProvider } from '@/components/react-query-prodiver';
import { UserUploadProvider } from '@/components/user-upload/context';
import { NavigationGuardProvider } from 'next-navigation-guard';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import { SessionProvider } from './session';
import { ThemeProvider } from 'next-themes';
import { Footer } from '@/components/footer';

export const metadata = {
  title: "Khmer Coders - Cambodia's Largest Coding Community",
  description: "Join Cambodia's largest community of developers, designers, and tech enthusiasts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&family=VT323&display=swap"
          rel="stylesheet"
        />
        <title>{metadata.title}</title>
      </head>
      <body>
        <NavigationGuardProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ReactQueryProvider>
              <SessionProvider>
                <UserUploadProvider>
                  <div className="min-h-screen relative">
                    {/* Content container */}
                    <div className="relative">
                      <header className="sticky top-0 z-50 bg-white dark:bg-black py-1 px-4 xl:px-16 flex items-center gap-12 mb-8 justify-between bg-background border-b shadow-[0_2px_8px_-1px_rgba(251,146,60,0.4)]">
                        <Link href="/" className="flex items-center z-9999">
                          <Image
                            src="/khmer-coder.svg"
                            alt="Khmer Coders"
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                          <span className="text-orange-400 font-mono tracking-tight font-semibold">
                            KhmerCoders
                          </span>
                        </Link>
                        <div className="flex-1 lg:hidden" />
                        <Navbar />
                      </header>
                      {children}
                      <Footer />
                    </div>
                  </div>
                  {process.env.NODE_ENV === 'development' && <KhmerCoderDevtool />}
                </UserUploadProvider>
              </SessionProvider>
            </ReactQueryProvider>
          </ThemeProvider>
        </NavigationGuardProvider>
      </body>
    </html>
  );
}
