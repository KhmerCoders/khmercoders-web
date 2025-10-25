'use client';
import { MainLayout } from '@/components/blocks/layout/MainLayout';
import { StackNavigation } from '@/components/blocks/layout/StackNavigation';
import { useSession } from '@/components/auth-provider';
import { ShowcaseBetaPage } from './beta';
import { buttonVariants } from '@/components/generated/button';
import Link from 'next/link';
import { TvMinimal } from 'lucide-react';

export default function ShowcasePage() {
  const { session } = useSession();

  return (
    <MainLayout hideRightNav>
      <StackNavigation
        title="Showcase"
        icon={TvMinimal}
        actions={
          session?.user && (
            <Link
              href="/showcase/create"
              className={buttonVariants({ variant: 'default', size: 'sm' })}
            >
              Add Showcase
            </Link>
          )
        }
      />

      <ShowcaseBetaPage />
    </MainLayout>
  );
}
