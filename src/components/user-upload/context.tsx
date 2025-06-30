'use client';
import { createContext, PropsWithChildren, useCallback, useContext, useRef, useState } from 'react';
import { UserUpload } from '.';

export const UserUploadContext = createContext<
  | {
      openUserUpload: (mode?: 'file' | 'upload') => Promise<string | null>;
    }
  | undefined
>(undefined);

export const useUserUpload = () => {
  const context = useContext(UserUploadContext);

  if (!context) {
    throw new Error('useUserUpload must be used within a UserUploadProvider');
  }

  return context;
};

export function UserUploadProvider({ children }: PropsWithChildren) {
  const resolverRef = useRef<((file: string | null) => void) | null>(null);
  const [mode, setMode] = useState<'file' | 'upload' | 'closed'>('closed');

  const openUserUpload = useCallback(
    async (option: 'file' | 'upload' = 'file') => {
      setMode(option);
      return new Promise<string | null>(resolver => {
        resolverRef.current = resolver;
      });
    },
    [resolverRef]
  );

  const handleSelect = useCallback(
    (file: string) => {
      if (resolverRef.current) {
        resolverRef.current(file);
      }
      setMode('closed');
    },
    [resolverRef]
  );

  const handleClose = useCallback(() => {
    if (resolverRef.current) {
      resolverRef.current(null);
      resolverRef.current = null;
    }
    setMode('closed');
  }, []);

  return (
    <UserUploadContext.Provider value={{ openUserUpload }}>
      {children}
      {mode !== 'closed' && (
        <UserUpload onClose={handleClose} onSelect={handleSelect} mode={mode} />
      )}
    </UserUploadContext.Provider>
  );
}
