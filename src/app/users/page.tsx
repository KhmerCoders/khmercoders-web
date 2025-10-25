import { MainLayout } from '@/components/blocks/layout/MainLayout';
import { StackNavigation } from '@/components/blocks/layout/StackNavigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/generated/avatar';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/generated/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/generated/pagination';
import { getUserCount, getUserList } from '@/server/services/users';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users | Khmer Coders',
  description: "Browse and connect with developers in Cambodia's largest coding community.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/users`,
  },
};

interface UserPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function UserPage({ searchParams }: UserPageProps) {
  const pageSize = 20;
  const currentPage = parseInt(searchParams.page ?? '1', 10);
  const page = Math.max(1, currentPage); // Ensure page is at least 1

  const users = await getUserList(page, pageSize);
  const count = await getUserCount();
  const totalPages = Math.ceil(count / pageSize);

  return (
    <MainLayout>
      <StackNavigation title="Users" />

      <div className="border rounded overflow-hidden m-4">
        <Table className="w-full">
          <TableHeader className="bg-muted font-bold">
            <TableRow>
              <TableCell className="text-right" style={{ width: 30 }}>
                #
              </TableCell>
              <TableCell style={{ width: 50 }}></TableCell>
              <TableCell>Name</TableCell>
              <TableCell className="text-right" style={{ width: 50 }}>
                Followers
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(({ user, member_profile }, idx) => (
              <TableRow key={user.id}>
                <TableCell className="text-right">{(page - 1) * pageSize + idx + 1}</TableCell>
                <TableCell>
                  <Link href={`/@${member_profile.alias}`}>
                    <Avatar>
                      {user.image ? <AvatarImage src={user.image} /> : <AvatarFallback />}
                    </Avatar>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/@${member_profile.alias}`} className="cursor-pointer">
                    <p className="font-semibold hover:underline">{user.name}</p>
                    {member_profile.title && (
                      <p className="text-muted-foreground">{member_profile.title}</p>
                    )}
                  </Link>
                </TableCell>
                <TableCell className="text-right" style={{ width: 50 }}>
                  {user.followersCount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center my-8">
          <Pagination>
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious href={`/users?page=${page - 1}`} />
                </PaginationItem>
              )}

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;

                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (page <= 3) {
                  pageNumber = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = page - 2 + i;
                }

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href={`/users?page=${pageNumber}`}
                      isActive={pageNumber === page}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {page < totalPages && (
                <PaginationItem>
                  <PaginationNext href={`/users?page=${page + 1}`} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Display pagination info */}
      <div className="text-center text-sm text-muted-foreground mb-4">
        Showing {Math.min((page - 1) * pageSize + 1, count)} to {Math.min(page * pageSize, count)}{' '}
        of {count} users
      </div>
    </MainLayout>
  );
}
