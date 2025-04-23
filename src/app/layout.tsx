import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";
import { Code, Facebook, Github, Twitter } from "lucide-react";
import Navbar from "@/components/atoms/nav-bar";
import Image from "next/image";
import { KCLinks } from "@/data/link";
import { DiscordIcon } from "@/components/atoms/icons";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Khmer Coders - Cambodia's Largest Coding Community",
  description:
    "Join Cambodia's largest community of developers, designers, and tech enthusiasts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-black text-white relative">
            {/* Background gradient */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:35px_34px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            {/* Content container */}
            <div className="relative">
              <header className="container mx-auto py-2 px-4 flex items-center gap-12 mb-8 justify-between">
                <Link href="/" className="flex items-center gap-2 z-9999">
                  <Image
                    src="/khmer-coder.svg"
                    alt="Khmer Coders"
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </Link>
                <div className="flex-1 lg:hidden" />
                <Navbar />
              </header>
              {children}
              <footer className="bg-black border-t border-gray-800 py-12">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Code className="h-6 w-6 text-yellow-500" />
                        <span className="text-lg font-bold">Khmer Coders</span>
                      </div>
                      <p className="text-gray-400 mb-4">
                        Cambodia&apos;s largest community of developers and tech
                        enthusiasts.
                      </p>
                      <div className="flex gap-4">
                        <Link
                          href={KCLinks.facebookGroupLink}
                          className="text-gray-400 hover:text-white"
                        >
                          <Facebook className="h-5 w-5" />
                        </Link>
                        <Link
                          href={KCLinks.discordLink}
                          className="text-gray-400 hover:text-white"
                        >
                          <DiscordIcon className="h-5 w-5" />
                        </Link>
                        <Link
                          href={KCLinks.githubLink}
                          className="text-gray-400 hover:text-white"
                        >
                          <Github className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold mb-4">Community</h3>
                      <ul className="space-y-2">
                        <li>
                          <Link
                            href="/teams"
                            className="text-gray-400 hover:text-white"
                          >
                            Our Teams
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/members"
                            className="text-gray-400 hover:text-white"
                          >
                            Community Members
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/events"
                            className="text-gray-400 hover:text-white"
                          >
                            Events
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="#"
                            className="text-gray-400 hover:text-white"
                          >
                            Join Discord
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="#"
                            className="text-gray-400 hover:text-white"
                          >
                            Facebook Group
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold mb-4">Resources</h3>
                      <ul className="space-y-2">
                        <li>
                          <Link
                            href="/partners"
                            className="text-gray-400 hover:text-white"
                          >
                            Our Partners
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/donate"
                            className="text-gray-400 hover:text-white"
                          >
                            Support Us
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
                    <p>
                      &copy; {new Date().getFullYear()} Khmer Coders. All rights
                      reserved.
                    </p>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

