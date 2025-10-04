import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getShowcaseByAlias } from '@/server/services/showcase';
import { GithubIcon } from 'lucide-react';
import { buttonVariants } from '@/components/generated/button';
import { MainLayout } from '@/components/blocks/layout/MainLayout';
import { StackNavigation } from '@/components/blocks/layout/StackNavigation';
import { ShowcaseDescription } from './description';
import { ShowcaseProvider } from './provider';
import { ShowcaseLogo } from './logo';

interface ShowcasePageProps {
  params: Promise<{
    alias: string;
  }>;
}

export default async function ShowcasePage({ params }: ShowcasePageProps) {
  const { alias } = await params;

  const showcase = await getShowcaseByAlias(alias);

  // Check if showcase exists and is viewable
  if (!showcase) {
    notFound();
  }

  return (
    <MainLayout hideRightNav>
      <ShowcaseProvider showcase={showcase}>
        <StackNavigation defaultBackURL="/showcase" />

        <div className="flex gap-4 p-6">
          <ShowcaseLogo />
          <div className="flex flex-col justify-center">
            <div className="font-semibold text-lg">{showcase.title}</div>
            <div className="text-muted-foreground">Short Summary</div>
          </div>
        </div>

        <div className="flex items-center gap-4 px-6 mb-4">
          <Link
            href={showcase.github}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            <GithubIcon className="w-4 h-4" />
            GitHub
          </Link>
        </div>

        <ShowcaseDescription showcase={showcase} />

        <div className="px-6 mt-6">
          <div
            className="rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center"
            style={{ aspectRatio: '16 / 9', height: 250, maxHeight: 250 }}
          ></div>
        </div>
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
    };
  }

  return {
    title: `${showcase.title} - KhmerCoders Showcase`,
    description:
      showcase.description || `Check out ${showcase.title} on KhmerCoders community showcase`,
    openGraph: {
      title: showcase.title,
      description:
        showcase.description || `Check out ${showcase.title} on KhmerCoders community showcase`,
      images: showcase.coverImage ? [{ url: showcase.coverImage }] : undefined,
    },
  };
}
