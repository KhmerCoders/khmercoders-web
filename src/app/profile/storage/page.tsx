'use client';

import { getFileListAction } from '@/actions/file';
import { UserRecord, UserUploadRecordWithBinding } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/generated/table';
import { formatAgo, formatSize } from '@/utils/format';
import { renderIconFromContentType } from '@/utils/icons';
import { Button } from '@/components/generated/button';
import { useUserUpload } from '@/components/user-upload/context';
import { Copy, Ellipsis, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/generated/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/generated/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/generated/card';
import { useSession } from '@/components/auth-provider';
import { getUserAction } from '@/actions/users';

export default function StorageDetailPage() {
  const { session } = useSession();
  const [user, setUser] = useState<UserRecord | undefined>(session?.user);
  const [files, setFiles] = useState<UserUploadRecordWithBinding[]>([]);
  const { openUserUpload } = useUserUpload();

  const fetchData = useCallback(() => {
    getFileListAction()
      .then(setFiles)
      .catch(() => {});

    getUserAction().then(setUser).catch(console.error);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUploadClick = useCallback(() => {
    openUserUpload('upload').then(fetchData).catch(console.error);
  }, [fetchData]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-2">Your Storage</h1>

      <p className="text-sm mb-4 text-gray-400" style={{ maxWidth: '600px' }}>
        This is your storage that you want to share file publicly. Please noted everything here is
        public accessible, so do not upload any sensitive or private files here.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>{formatSize(user?.storageUsed ?? 0)} / 1 GB</CardTitle>
            <CardDescription>Storage Usage</CardDescription>
          </CardHeader>

          <CardFooter>
            <progress
              className="w-full h-2 bg-gray-200 rounded"
              value={(user?.storageUsed ?? 0) / 1073741824}
              max={1}
            ></progress>
          </CardFooter>
        </Card>
      </div>

      <div className="my-4">
        <Button onClick={handleUploadClick}>Upload</Button>
      </div>

      <div className="border rounded-lg shadow-sm">
        <FileTable files={files} />
      </div>
    </div>
  );
}

function FileTable({ files }: { files: UserUploadRecordWithBinding[] }) {
  const { toast } = useToast();

  if (files.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Description</TableHead>
            <TableHead className="text-right">Size</TableHead>
            <TableHead style={{ width: 50 }}>Binding</TableHead>
            <TableHead style={{ width: 150 }}>Created at</TableHead>
            <TableHead style={{ width: 50 }}></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              No files found
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>File Description</TableHead>
          <TableHead className="text-right">Size</TableHead>
          <TableHead style={{ width: 50 }}>Binding</TableHead>
          <TableHead style={{ width: 150 }}>Created at</TableHead>
          <TableHead style={{ width: 50 }}></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map(file => {
          return (
            <TableRow className="cursor-pointer" key={file.id}>
              <TableCell>
                <div className="flex gap-2 items-center line-clamp-1">
                  {renderIconFromContentType(file.fileType)}
                  {file.fileName}
                </div>
              </TableCell>
              <TableCell className="text-right">{formatSize(file.fileSize)}</TableCell>
              <TableCell>
                {(file.bindings ?? []).some(b => b.resourceType === 'profile') && (
                  <Badge>Profile</Badge>
                )}
                {(file.bindings ?? []).some(b => b.resourceType === 'blog') && (
                  <Badge>Profile</Badge>
                )}
              </TableCell>
              <TableCell>{formatAgo(file.createdAt)}</TableCell>
              <TableCell>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger>
                    <Ellipsis className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" align="start">
                    <DropdownMenuItem
                      onSelect={() => {
                        navigator.clipboard.writeText(file.fileUrl);
                        toast({
                          title: 'Link copied to clipboard',
                          description: file.fileUrl,
                          duration: 2000,
                        });
                      }}
                    >
                      <Copy />
                      Copy link
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <Trash />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
