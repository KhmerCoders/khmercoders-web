import '@/app/globals.css';
import '../styles/_variables.scss';
import '../styles/_keyframe-animations.scss';
import { Header } from '@/components/atoms/header';
import { KhmerCoderDevtool } from '@/components/devtool';
import { ReactQueryProvider } from '@/components/react-query-prodiver';
import { UserUploadProvider } from '@/components/user-upload/context';
import { NavigationGuardProvider } from 'next-navigation-guard';
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
                      <Header />
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
