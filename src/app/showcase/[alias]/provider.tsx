'use client';
import { useSession } from '@/components/auth-provider';
import { ShowcaseRecord } from '@/types';
import { createContext, PropsWithChildren, useContext, useState } from 'react';

interface ShowcaseProviderProps {
  isOwner: boolean;
  showcase: ShowcaseRecord;
  setShowcase: React.Dispatch<React.SetStateAction<ShowcaseRecord>>;
}

const ShowcaseOwnerContext = createContext<ShowcaseProviderProps | undefined>(undefined);

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
}: PropsWithChildren<{ showcase: ShowcaseRecord }>) {
  const { session } = useSession();
  const [localShowcase, setLocalShowcase] = useState(showcase);

  const user = session?.user;
  const isOwner = user ? showcase?.userId === user.id : false;

  return (
    <ShowcaseOwnerContext.Provider
      value={{ isOwner, showcase: localShowcase, setShowcase: setLocalShowcase }}
    >
      {children}
    </ShowcaseOwnerContext.Provider>
  );
}
