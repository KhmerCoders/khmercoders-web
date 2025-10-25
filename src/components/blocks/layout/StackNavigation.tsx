import { ChevronLeft, LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
  defaultBackURL?: string;
  actions?: React.ReactNode;
  icon?: LucideIcon;
}

export function StackNavigation({
  title,
  defaultBackURL,
  icon: IconComponent,
  actions,
}: HeaderProps) {
  return (
    <nav className="h-14 flex items-center px-4 border-b flex gap-2 sticky top-0 z-10 bg-background">
      {defaultBackURL && (
        <Link href={defaultBackURL} className="text-blue-600 hover:underline flex">
          <ChevronLeft /> Back
        </Link>
      )}
      <div className="grow flex items-center gap-2">
        {IconComponent && <IconComponent />}
        {title && <span className="font-semibold">{title}</span>}
      </div>
      <div>{actions}</div>
    </nav>
  );
}
