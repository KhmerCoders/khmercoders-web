'use client';
import { MainLayout } from '@/components/blocks/layout/MainLayout';
import { StackNavigation } from '@/components/blocks/layout/StackNavigation';
import { ShowcaseUpcoming } from './coming';
import { useSession } from '@/components/auth-provider';
import { UserLevel } from '@/types';
import { ShowcaseBetaPage } from './beta';

export default function ShowcasePage() {
  const { session } = useSession();

  const isBeta = [
    UserLevel.Contributor,
    UserLevel.Moderator,
    UserLevel.SuperAdmin,
    UserLevel.Premium,
  ].includes(session?.user.level ?? UserLevel.Basic);

  return (
    <MainLayout hideRightNav>
      <StackNavigation title="Showcase" />
      {isBeta ? <ShowcaseBetaPage /> : <ShowcaseUpcoming />}
    </MainLayout>
  );
}
