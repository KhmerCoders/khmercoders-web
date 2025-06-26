'use client';

import { Button } from '@/components/generated/button';
import { DialogHeader, DialogFooter } from '@/components/generated/dialog';
import { Input } from '@/components/generated/input';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/generated/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/generated/alert-dialog';
import { useCallback, useEffect, useState } from 'react';
import { MoreHorizontal, Pencil, Trash2, ExternalLink, Check, Copy, BarChart2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/generated/dropdown-menu';
import { ShortenedLink, ShortenedLinkInput, urlSchema } from '@/services/shortened-links';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/generated/form';
import { Alert, AlertTitle, AlertDescription } from '@/components/generated/alert';
import { createShortenedLinkAction, getUserShortenedLinksAction } from '@/actions/shortened-links';
import { useRouter } from 'next/navigation';

const URL_PREFIX = 'kcc.li';

function CreateEditLinkDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ShortenedLinkInput) => Promise<void>;
  initialData?: ShortenedLink;
  isEditing?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ShortenedLinkInput>({
    resolver: standardSchemaResolver(urlSchema),
    defaultValues: {
      url: initialData?.originalUrl || '',
      slug: initialData?.slug || '',
    },
  });

  const slugValue = form.watch('slug');

  const handleSubmit = async (data: ShortenedLinkInput) => {
    try {
      setIsLoading(true);
      setError(null);
      await onSubmit(data);
      form.reset();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Link' : 'Create New Link'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Edit your shortened link details.'
              : 'Create a new shortened link for easy sharing.'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/your-long-url"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Slug (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="custom-slug" {...field} disabled={isLoading || isEditing} />
                  </FormControl>
                  <FormMessage />
                  {slugValue && (
                    <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                      <span>Preview:</span>
                      <code className="px-2 py-1 bg-muted rounded-md font-mono">
                        {URL_PREFIX}/{slugValue}
                      </code>
                    </div>
                  )}
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Link'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function ShortenedLinksPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [data, setData] = useState<ShortenedLink[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [linkToEdit, setLinkToEdit] = useState<ShortenedLink | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const router = useRouter();

  const fetchLinks = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getUserShortenedLinksAction();
      if (!result.success) {
        setError(result.message);
      }
      setData(result.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch links');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setLinkToEdit(null);
  };

  const handleCreate = async (formData: ShortenedLinkInput) => {
    const result = await createShortenedLinkAction(formData);
    if (!result.success) {
      throw new Error(result.message);
    }
    await fetchLinks();
  };

  const handleEdit = async (formData: ShortenedLinkInput) => {
    // TODO: Implement edit functionality
    console.log('Edit functionality not implemented yet');
  };

  const handleDelete = async () => {
    // TODO: Implement delete functionality
    console.log('Delete functionality not implemented yet');
    setDeleteConfirmOpen(false);
    setLinkToDelete(null);
  };

  const copyToClipboard = async (slug: string) => {
    const url = `${URL_PREFIX}/${slug}`;
    await navigator.clipboard.writeText(url);
  };

  if (isLoading && data.length === 0) {
    return (
      <div className="container mx-auto my-8 max-w-4xl px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto my-8 max-w-4xl px-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8 max-w-4xl px-4">
      <div className="mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Shortened Links</h1>
        <p className="text-muted-foreground">Create and manage your custom shortened links.</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Links</h2>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          Create New Link
        </Button>
      </div>

      <div className="mt-6">
        {data.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-700 rounded-lg">
            <p className="text-muted-foreground mb-2">No shortened links yet.</p>
            <p className="text-sm text-muted-foreground">
              Click the Create New Link button to get started.
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left py-3 px-4 font-medium">Shortened URL</th>
                  <th className="text-left py-3 px-4 font-medium">Original URL</th>
                  <th className="text-center py-3 px-4 font-medium">Created</th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map(link => (
                  <tr
                    key={link.id}
                    className="border-t border-gray-800 hover:bg-muted/20 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{`${URL_PREFIX}/${link.slug}`}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 relative"
                          onClick={async () => {
                            await copyToClipboard(`${URL_PREFIX}/${link.slug}`);
                            setCopiedId(link.id);
                            setTimeout(() => setCopiedId(null), 2000);
                          }}
                          title="Copy to clipboard"
                        >
                          <Copy
                            className={`h-4 w-4 transition-all ${copiedId === link.id ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
                          />
                          <Check
                            className={`h-4 w-4 absolute inset-0 m-auto transition-all text-green-500 ${copiedId === link.id ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
                          />
                        </Button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {link.originalUrl}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-muted-foreground">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 text-right">
                      <div className="flex justify-end">
                        <DropdownMenu
                          open={openDropdownId === link.id}
                          onOpenChange={open => setOpenDropdownId(open ? link.id : null)}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              disabled={isDialogOpen || deleteConfirmOpen}
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onSelect={() => {
                                setOpenDropdownId(null);
                                router.push(`/profile/setup/links/${link.slug}/insights`);
                              }}
                            >
                              <BarChart2 className="mr-2 h-4 w-4" />
                              View Insights
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onSelect={() => {
                                setOpenDropdownId(null);
                                setLinkToEdit(link);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-red-500"
                              onSelect={() => {
                                setOpenDropdownId(null);
                                setLinkToDelete(link.id);
                                setDeleteConfirmOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateEditLinkDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={linkToEdit ? handleEdit : handleCreate}
        initialData={linkToEdit ?? undefined}
        isEditing={!!linkToEdit}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this shortened link. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
