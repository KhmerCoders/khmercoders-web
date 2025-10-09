'use client';
import { useSession } from '@/components/auth-provider';
import { ShowcaseRecord } from '@/types';
import { createContext, useContext } from 'react';

const ShowcaseOwnerContext = createContext<
  | {
      isOwner: boolean;
      showcase: ShowcaseRecord;
    }
  | undefined
>(undefined);

export function useCurrentShowcase() {
  const ctx = useContext(ShowcaseOwnerContext);

  if (!ctx) {
    throw new Error('useCurrentShowcase must be used within a ShowcaseProvider');
  }
  return ctx;
}

export function ShowcaseProvider({
  children,
  showcase,
}: {
  children: React.ReactNode;
  showcase: ShowcaseRecord;
}) {
  const { session } = useSession();
  const user = session?.user;
  const isOwner = user ? showcase?.userId === user.id : false;

  return (
    <ShowcaseOwnerContext.Provider value={{ isOwner, showcase }}>
      {children}
    </ShowcaseOwnerContext.Provider>
  );
}
