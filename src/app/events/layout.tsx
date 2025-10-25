import type React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events | Khmer Coders',
  description:
    'Join workshops, meetups, hackathons, and other tech events organized by Khmer Coders throughout Cambodia.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/events`,
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
