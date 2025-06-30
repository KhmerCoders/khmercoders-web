import type React from 'react';
import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Link from 'next/link';
import { Facebook, Github } from 'lucide-react';
import Navbar from '@/components/atoms/nav-bar';
import Image from 'next/image';
import { KCLinks } from '@/data/link';
import { DiscordIcon } from '@/components/atoms/icons';
import { SessionProvider } from './session';
import { KhmerCoderDevtool } from '@/components/devtool';
import { UserUploadProvider } from '@/components/user-upload/context';
import { ReactQueryProvider } from '@/components/react-query-prodiver';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="en" className="dark" suppressHydrationWarning={true}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=VT323&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <SessionProvider>
              <UserUploadProvider>
                <div className="min-h-screen bg-black text-white relative">
                  {/* Content container */}
                  <div className="relative">
                    <header className="py-1 px-4 xl:px-16 flex items-center gap-12 mb-8 justify-between border-b border-yellow-600 shadow-[0_8px_16px_-1px_rgba(251,146,60,0.4)]">
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
                    <footer className="bg-black border-t border-gray-800 py-12">
                      <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                          <div>
                            <Link
                              href="/"
                              className="flex flex-col items-start sm:flex-row sm:items-center gap-2 mb-4"
                            >
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
                            <p className="text-gray-400 mb-4">
                              Cambodia&apos;s largest community of developers and tech enthusiasts.
                            </p>
                            <div className="flex gap-4">
                              <Link
                                href={KCLinks.facebookGroupLink}
                                className="text-gray-400 hover:text-white"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Facebook className="h-5 w-5" />
                              </Link>
                              <Link
                                href={KCLinks.discordLink}
                                className="text-gray-400 hover:text-white"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <DiscordIcon className="h-5 w-5" />
                              </Link>
                              <Link
                                href={KCLinks.githubLink}
                                className="text-gray-400 hover:text-white"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Github className="h-5 w-5" />
                              </Link>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-bold mb-4">About Us</h3>
                            <ul className="space-y-2">
                              <li>
                                <Link href="/events" className="text-gray-400 hover:text-white">
                                  Events
                                </Link>
                              </li>
                              <li>
                                <Link href="/teams" className="text-gray-400 hover:text-white">
                                  Our Teams
                                </Link>
                              </li>
                              <li>
                                <Link href="/members" className="text-gray-400 hover:text-white">
                                  Our Members
                                </Link>
                              </li>
                            </ul>
                          </div>

                          <div>
                            <h3 className="font-bold mb-4">Resources</h3>
                            <ul className="space-y-2">
                              <li>
                                <Link href="/partners" className="text-gray-400 hover:text-white">
                                  Our Partners
                                </Link>
                              </li>
                              <li>
                                <Link href="/donate" className="text-gray-400 hover:text-white">
                                  Support Us
                                </Link>
                              </li>
                            </ul>
                          </div>

                          <div>
                            <h3 className="font-bold mb-4">Join Us</h3>
                            <ul className="space-y-2 mb-4">
                              <li>
                                <Link
                                  href={KCLinks.facebookGroupLink}
                                  className="text-gray-400 hover:text-white"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Facebook Group
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href={KCLinks.discordLink}
                                  className="text-gray-400 hover:text-white"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Join Discord
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href={KCLinks.githubLink}
                                  className="text-gray-400 hover:text-white"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  GitHub
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
                          <p>
                            &copy; {new Date().getFullYear()} Khmer Coders. All rights reserved.
                          </p>
                        </div>
                      </div>
                    </footer>
                  </div>
                </div>
                {process.env.NODE_ENV === 'development' && <KhmerCoderDevtool />}
              </UserUploadProvider>
            </SessionProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
