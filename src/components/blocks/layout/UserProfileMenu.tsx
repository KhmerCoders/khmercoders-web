'use client';
import { Avatar, AvatarFallback, AvatarImage } from '../../generated/avatar';
import SignInButton, { SignOutButton } from '../../atoms/github-login-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../generated/dropdown-menu';
import { User, Settings, ChartArea, Files, Newspaper, Link2 } from 'lucide-react';
import Link from 'next/link';
import { useSession } from '../../auth-provider';
import { Badge } from '../../generated/badge';

export function UserProfileMenu() {
  const { profile, session } = useSession();

  const user = session?.user;

  if (!user) {
    return <SignInButton />;
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="flex gap-2 items-center w-full">
          <Avatar className="cursor-pointer">
            <AvatarImage src={user.image || undefined} alt={user.name || 'User avatar'} />
            <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p>{user?.name}</p>
            <p className="text-muted-foreground">@{profile?.alias ?? 'guest'}</p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" style={{ width: '300px' }}>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={profile ? `/@${profile.alias}` : '/profile/setup/alias'}
            className="cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={'/profile/insight'} className="cursor-pointer">
            <ChartArea className="mr-2 h-4 w-4" />
            Profile Insight
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={'/profile/link-account'} className="cursor-pointer">
            <Link2 className="mr-2 h-4 w-4" />
            Link Account
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={`/profile/articles/create`} className="cursor-pointer">
            <Newspaper className="mr-2 h-4 w-4" />
            Create Article
            <div className="grow flex justify-end">
              <Badge>Beta</Badge>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/@${profile?.alias}/articles`} className="cursor-pointer">
            <Newspaper className="mr-2 h-4 w-4" />
            Articles
            <div className="grow flex justify-end">
              <Badge>Beta</Badge>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={'/profile/storage'} className="cursor-pointer">
            <Files className="mr-2 h-4 w-4" />
            Your Storage
            <div className="grow flex justify-end">
              <Badge>Beta</Badge>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile/setup" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
