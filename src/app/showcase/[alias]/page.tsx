import { notFound } from 'next/navigation';
import { bindingShowcaseLikeStatus, getShowcaseByAlias } from '@/server/services/showcase';
import { MainLayout } from '@/components/blocks/layout/MainLayout';
import { StackNavigation } from '@/components/blocks/layout/StackNavigation';
import { ShowcaseDescription } from './description';
import { ShowcaseProvider } from './provider';
import { ShowcaseMediaSection } from './media';
import { ShowcaseLinkSection } from './link';
import { ShowcaseHeader } from './header';
import { getSession } from '@/app/session';

interface ShowcasePageProps {
  params: Promise<{
    alias: string;
  }>;
}

export default async function ShowcasePage({ params }: ShowcasePageProps) {
  const { alias } = await params;
  const { session } = await getSession();

  const showcase = await getShowcaseByAlias(alias);

  // Check if showcase exists and is viewable
  if (!showcase) {
    notFound();
  }

  const bindedShowcase = await bindingShowcaseLikeStatus(showcase, session?.user?.id);

  return (
    <MainLayout hideRightNav>
      <ShowcaseProvider showcase={bindedShowcase}>
        <StackNavigation defaultBackURL="/showcase" />
        <ShowcaseHeader />
        <ShowcaseLinkSection />
        <ShowcaseDescription showcase={bindedShowcase} />
        <ShowcaseMediaSection />
      </ShowcaseProvider>
    </MainLayout>
  );
}

// Generate metadata for the page
export async function generateMetadata({ params }: ShowcasePageProps) {
  const { alias } = await params;
  const showcase = await getShowcaseByAlias(alias);

  if (!showcase) {
    return {
      title: 'Showcase Not Found',
      description: 'The showcase you are looking for could not be found.',
    };
  }

  // Construct description with tagline and description
  const metaDescription =
    showcase.tagline && showcase.description
      ? `${showcase.tagline} - ${showcase.description.slice(0, 100)}${showcase.description.length > 100 ? '...' : ''}`
      : showcase.tagline
        ? showcase.tagline
        : showcase.description
          ? showcase.description.slice(0, 160)
          : `Check out ${showcase.title} on KhmerCoders community showcase`;

  // Get the first cover image
  const coverImageUrl = showcase.coverImage ? showcase.coverImage.split(',')[0] : showcase.logo;

  // Get creator name
  const creatorName = showcase.user?.name || 'KhmerCoders Community';

  return {
    title: `${showcase.title} - KhmerCoders Showcase`,
    description: metaDescription,
    authors: [{ name: creatorName }],
    creator: creatorName,
    publisher: 'KhmerCoders',
    keywords: [
      showcase.title,
      'KhmerCoders',
      'showcase',
      'project',
      'portfolio',
      'Cambodia tech',
      'Khmer developers',
    ],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `https://khmercoders.com/showcase/${alias}`,
      title: showcase.title,
      description: metaDescription,
      siteName: 'KhmerCoders',
      images: coverImageUrl
        ? [
            {
              url: coverImageUrl,
              alt: `${showcase.title} showcase image`,
              width: 1200,
              height: 630,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: showcase.title,
      description: metaDescription,
      images: coverImageUrl ? [coverImageUrl] : undefined,
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
}
