import { Button, buttonVariants } from '@/components/generated/button';
import Link from 'next/link';

export function ShowcaseBetaPage() {
  return (
    <div>
      <p className="p-4 flex justify-end">
        <Link href="/showcase/create" className={buttonVariants({ variant: 'default' })}>
          Add Showcase
        </Link>
      </p>
    </div>
  );
}
