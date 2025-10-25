import { ShowcaseRow } from '@/components/showcase/ShowcaseRow';
import { getUserShowcases } from '@/server/services/showcase';

interface UserShowcasesProps {
  userId: string;
  currentUserId?: string;
}

export async function UserShowcases({ userId, currentUserId }: UserShowcasesProps) {
  const showcases = await getUserShowcases(userId, currentUserId);

  // Don't render anything if there are no showcases
  if (showcases.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 border-t p-4">
      {showcases.map(showcase => (
        <ShowcaseRow key={showcase.id} showcase={showcase} />
      ))}
    </div>
  );
}
