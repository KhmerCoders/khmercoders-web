'use client';
import { MainLayout } from '@/components/blocks/layout/MainLayout';
import { StackNavigation } from '@/components/blocks/layout/StackNavigation';
import { useSession } from '@/components/auth-provider';
import { ShowcaseBetaPage } from './beta';

export default function ShowcasePage() {
  const { session } = useSession();

  return (
    <MainLayout hideRightNav>
      <StackNavigation title="Showcase" />
      <ShowcaseBetaPage />
    </MainLayout>
  );
}
