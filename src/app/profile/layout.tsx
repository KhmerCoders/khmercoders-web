'use client';
import { useSession } from '@/components/auth-provider';

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session } = useSession();

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-lg">You must be logged in to view this page.</p>
        </div>
      </div>
    );
  }

  return children;
}
