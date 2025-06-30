import type { ProfileRecord, UserRecord } from '@/types';
import { UserLevelBadge } from './user-level-badge';
import { cn } from '@/utils';
import Link from 'next/link';

interface ProfileHeaderProps {
  profile: ProfileRecord;
  user: UserRecord;
  selectedTab?: 'profile' | 'articles';
}

export function ProfileHeader({ selectedTab = 'profile', profile, user }: ProfileHeaderProps) {
  return (
    <div className="relative border-b border-gray-600">
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#f59e0b1a_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b1a_1px,transparent_1px)] bg-[size:35px_34px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="container relative z-10 mx-auto py-4 px-4 flex gap-3">
        <div
          className="w-20 h-20 rounded-full border-2 border-orange-400 bg-orange-100 overflow-hidden"
          style={
            user.image
              ? {
                  backgroundImage: `url(${user.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : {}
          }
        />
        <div className="flex flex-col justify-center">
          <div className="flex gap-2 items-center">
            <h1 className="font-semibold text-lg">{user.name}</h1>
            <UserLevelBadge level={user.level} />
          </div>
          <p className="text-gray-400 text-sm">{profile.title}</p>
          <p className="text-gray-400 text-sm font-mono">@{profile.alias}</p>
        </div>
      </div>

      <nav className="container relative z-10 mx-auto text-sm flex">
        <Link
          href={`/@${profile.alias}`}
          className={cn('p-2 px-4 border-b-4', { 'border-orange-500': selectedTab === 'profile' })}
        >
          Profile
        </Link>
        <Link
          href={`/@${profile.alias}/articles`}
          className={cn('p-2 px-4 border-b-4 border-background', {
            'border-orange-500': selectedTab === 'articles',
          })}
        >
          Articles
        </Link>
      </nav>
    </div>
  );
}
