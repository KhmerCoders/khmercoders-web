import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Showcase - KhmerCoders Community',
  description:
    'Discover amazing projects built by the KhmerCoders community. Explore portfolios, web apps, mobile apps, and innovative solutions from talented Cambodian developers.',
  keywords: [
    'KhmerCoders',
    'showcase',
    'projects',
    'portfolio',
    'Cambodia tech',
    'Khmer developers',
    'community projects',
    'developer showcase',
    'tech community',
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/showcase`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://khmercoders.com/showcase',
    title: 'Showcase - KhmerCoders Community',
    description:
      'Discover amazing projects built by the KhmerCoders community. Explore portfolios, web apps, mobile apps, and innovative solutions from talented Cambodian developers.',
    siteName: 'KhmerCoders',
    images: [
      {
        url: 'https://khmercoders.com/kc-banner.png',
        alt: 'KhmerCoders Community Showcase',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Showcase - KhmerCoders Community',
    description:
      'Discover amazing projects built by the KhmerCoders community. Explore portfolios and innovative solutions from talented Cambodian developers.',
    images: ['https://khmercoders.com/kc-banner.png'],
    creator: '@KhmerCoders',
    site: '@KhmerCoders',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
