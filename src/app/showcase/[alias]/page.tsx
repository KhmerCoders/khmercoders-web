import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getShowcaseByAlias } from '@/server/services/showcase';
import { ExternalLinkIcon, GithubIcon, CalendarIcon, HeartIcon, ArrowLeftIcon } from 'lucide-react';
import { buttonVariants } from '@/components/generated/button';

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
    <div className="min-h-screen bg-background">
      {/* Header with back navigation */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/showcase" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Showcases
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Showcase header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:space-x-6 space-y-4 md:space-y-0">
              {/* Logo */}
              {showcase.logo && (
                <div className="flex-shrink-0">
                  <img
                    src={showcase.logo}
                    alt={showcase.title}
                    className="w-24 h-24 rounded-lg object-cover border"
                  />
                </div>
              )}

              {/* Title and basic info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-foreground mb-2">{showcase.title}</h1>
                <p className="text-muted-foreground mb-4">@{showcase.alias}</p>

                {/* Stats and actions */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <HeartIcon className="w-4 h-4" />
                    <span>{showcase.likeCount || 0} likes</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Created {new Date(showcase.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2">
                  {showcase.website && (
                    <Link
                      href={showcase.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({ variant: 'default' })}
                    >
                      <ExternalLinkIcon className="w-4 h-4 mr-2" />
                      Visit Website
                    </Link>
                  )}
                  {showcase.github && (
                    <Link
                      href={showcase.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({ variant: 'outline' })}
                    >
                      <GithubIcon className="w-4 h-4 mr-2" />
                      View Source
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cover image */}
          {showcase.coverImage && (
            <div className="mb-8">
              <div className="rounded-lg overflow-hidden border">
                <img
                  src={showcase.coverImage}
                  alt={`${showcase.title} cover`}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">About this project</h2>
            {showcase.description ? (
              <div className="prose prose-gray max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap">{showcase.description}</p>
              </div>
            ) : (
              <p className="text-muted-foreground italic">No description provided yet.</p>
            )}
          </div>

          {/* Creator info */}
          {showcase.user && (
            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold mb-4">Created by</h2>
              <div className="flex items-center space-x-4">
                {showcase.user.profile?.picture && (
                  <img
                    src={showcase.user.profile.picture}
                    alt={showcase.user.profile.title || showcase.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="font-medium">
                    {showcase.user.profile?.title || showcase.user.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">@{showcase.user.profile?.alias}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
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
