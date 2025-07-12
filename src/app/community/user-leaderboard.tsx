import { DiscordIcon } from '@/components/atoms/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/generated/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/generated/table';
import { UserLevelBadge } from '@/components/user-level-badge';
import { UserLeaderboard } from '@/libs/db/chatbot';
import { UserRecordWithProfile } from '@/types';
import { Send } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

interface UserLeaderboardProps {
  data: UserLeaderboard[];
}

export function UserLeaderboardComponent({ data }: UserLeaderboardProps) {
  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => b.message_count - a.message_count);
  }, [data]);

  const userWithBadge = React.useCallback((user: UserRecordWithProfile) => {
    return (
      <>
        <span>{user.name}</span>
        <div className="mt-1.5">
          <UserLevelBadge level={user?.level} />
        </div>
      </>
    );
  }, []);

  return (
    <div className="font-mono text-lg">
      <h2 className="text-2xl font-bold">Top Contributors</h2>
      <p>Most active members in our community chats over the last 30 days</p>

      <Table className="border-double border-4 border-foreground my-4 rounded-lg bg-card">
        <TableHeader>
          <TableRow className="border-foreground">
            <TableHead className="w-12">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Linked</TableHead>
            <TableHead className="text-right">Messages</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((user, index) => (
            <TableRow
              key={`${user.platform}-${user.display_name}-${index}`}
              className="border-foreground"
            >
              <TableCell className="font-medium border-foreground">{index + 1}</TableCell>
              <TableCell className="border-foreground font-bold">
                {user.platform === 'telegram' ? (
                  <Send className="inline-block w-5 h-5 mr-2 text-blue-500" />
                ) : (
                  <DiscordIcon className="inline-block w-5 h-5 mr-2 text-purple-500" />
                )}
                {user.display_name}
              </TableCell>
              <TableCell>
                {user.user ? (
                  user.user.profile?.alias ? (
                    <Link href={`/@${user.user.profile.alias}`} className="flex gap-2 items-center">
                      <Avatar className="h-6 w-6">
                        {user.user.image ? (
                          <AvatarImage src={user.user.image} />
                        ) : (
                          <AvatarFallback />
                        )}
                      </Avatar>
                      {userWithBadge(user.user)}
                    </Link>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <Avatar className="h-6 w-6">
                        {user.user.image ? (
                          <AvatarImage src={user.user.image} />
                        ) : (
                          <AvatarFallback />
                        )}
                      </Avatar>
                      {userWithBadge(user.user)}
                    </div>
                  )
                ) : (
                  <span></span>
                )}
              </TableCell>
              <TableCell className="text-right border-gray-400">{user.message_count}</TableCell>
            </TableRow>
          ))}
          {sortedData.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
