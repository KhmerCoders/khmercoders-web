'use client';

import { Button } from '@/components/generated/button';
import { DialogHeader, DialogFooter } from '@/components/generated/dialog';
import { Input } from '@/components/generated/input';
import { Label } from '@/components/generated/label';
import { Textarea } from '@/components/generated/textarea';
import { StackNavigation } from '@/components/blocks/layout/StackNavigation';
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
import { Checkbox } from '@/components/generated/checkbox';
import {
  createExperienceAction,
  getUserExperiencesAction,
  removeExperienceAction,
  updateExperienceAction,
} from '@/server/actions/experiences';
import * as schema from '@/libs/db/schema';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/generated/dropdown-menu';
import { cn } from '@/utils';

export default function ProfileSetupExperiencePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [data, setData] = useState<(typeof schema.workExperience.$inferSelect)[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<string | null>(null);
  const [experienceToEdit, setExperienceToEdit] = useState<
    typeof schema.workExperience.$inferSelect | null
  >(null);
  // Track which dropdown is currently open to manage UI state properly
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [expandedExperienceId, setExpandedExperienceId] = useState<string | null>();

  const toggleExperienceDetails = (id: string) => {
    setExpandedExperienceId(prev => (prev === id ? null : id));
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setExperienceToEdit(null);
  };

  const handleSubmit = useCallback(async (data: ProfileSetupExperienceData) => {
    const result = await createExperienceAction({
      startYear: parseInt(data.startYear, 10),
      endYear: data.endYear ? parseInt(data.endYear, 10) : null,
      companyName: data.companyName.trim(),
      role: data.role.trim(),
      description: data.description.trim(),
    });

    const refreshExperience = await getUserExperiencesAction();

    if (result.success) {
      setData(refreshExperience.experiences);
    } else {
      throw new Error(result.message || 'Failed to create experience. Please try again.');
    }
  }, []);

  const handleEditSubmit = useCallback(
    async (data: ProfileSetupExperienceData) => {
      if (!experienceToEdit) return;

      const result = await updateExperienceAction(experienceToEdit.id, {
        startYear: parseInt(data.startYear, 10),
        endYear: data.endYear ? parseInt(data.endYear, 10) : null,
        companyName: data.companyName.trim(),
        role: data.role.trim(),
        description: data.description.trim(),
      });

      const refreshExperience = await getUserExperiencesAction();

      if (result.success) {
        setData(refreshExperience.experiences);
      } else {
        throw new Error(result.message || 'Failed to update experience. Please try again.');
      }
    },
    [experienceToEdit]
  );

  const handleDeleteConfirm = async () => {
    if (!experienceToDelete) return;

    try {
      const result = await removeExperienceAction(experienceToDelete);

      if (result.success) {
        const refreshResult = await getUserExperiencesAction();
        if (refreshResult.success) {
          setData(refreshResult.experiences);
        }
      } else {
        console.error('Failed to delete experience:', result.message);
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
    } finally {
      setDeleteConfirmOpen(false);
      setExperienceToDelete(null);
    }
  };

  useEffect(() => {
    const fetchExperiences = async () => {
      const result = await getUserExperiencesAction();
      if (result.success) {
        setData(result.experiences);
      } else {
        console.error('Failed to fetch experiences:', result.message);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <div className="container mx-auto py-8 max-w-4xl px-4">
      <StackNavigation defaultBackURL="/profile/setup/" />
      <div className="mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Work Experience</h1>
        <p className="text-muted-foreground">
          Add your professional experience to showcase your career journey.
        </p>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Experiences</h2>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          Add Experience
        </Button>
      </div>
      <div className="mt-6 space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-700 rounded-lg">
            <p className="text-muted-foreground mb-2">No experiences added yet.</p>
            <p className="text-sm text-muted-foreground">
              Click the Add Experience button to get started.
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left py-3 px-4 font-medium" style={{ width: '20%' }}>
                    Period
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Details</th>
                  <th className="text-right py-3 px-4 font-medium" style={{ width: '10%' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map(experience => (
                  <tr
                    key={experience.id}
                    className="border-t border-gray-800 hover:bg-muted/20 transition-colors"
                  >
                    <td className="py-3 px-4 align-top">
                      <div className="font-medium">
                        <span>{experience.startYear}</span>
                        <span className="px-1">-</span>
                        <span>{experience.endYear ?? 'Present'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{experience.role}</div>
                      <div className="text-sm text-amber-500">{experience.companyName}</div>
                      <div
                        className={cn(
                          'text-xs text-muted-foreground mt-2',
                          expandedExperienceId === experience.id ? '' : 'line-clamp-3'
                        )}
                      >
                        {experience.description ? (
                          <span className="whitespace-pre-line">{experience.description}</span>
                        ) : (
                          'No description provided'
                        )}
                      </div>
                      {experience.description &&
                        experience.description.split(/\r?\n/).length > 3 && (
                          <button
                            className="text-blue-500 hover:text-blue-700 hover:underline font-medium text-xs"
                            onClick={() => toggleExperienceDetails(experience.id)}
                          >
                            {expandedExperienceId === experience.id ? 'Show less' : 'Show more'}
                          </button>
                        )}
                    </td>
                    <td className="py-2 px-4 text-right align-top">
                      <div className="flex justify-end gap-2">
                        <div className="relative">
                          <DropdownMenu
                            open={openDropdownId === experience.id}
                            onOpenChange={open => {
                              setOpenDropdownId(open ? experience.id : null);
                            }}
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
                                onSelect={e => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  // Close dropdown first, then open dialog after a brief delay
                                  setOpenDropdownId(null);
                                  setExperienceToEdit(experience);
                                  setTimeout(() => {
                                    setIsDialogOpen(true);
                                  }, 10);
                                }}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onSelect={e => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  // Close dropdown first, then open dialog after a brief delay
                                  setOpenDropdownId(null);
                                  setExperienceToDelete(experience.id);
                                  setTimeout(() => {
                                    setDeleteConfirmOpen(true);
                                  }, 10);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {isDialogOpen && (
        <ProfileSetupExperienceDialog
          initialData={
            experienceToEdit
              ? {
                  startYear: experienceToEdit.startYear.toString(),
                  endYear: experienceToEdit.endYear ? experienceToEdit.endYear.toString() : null,
                  companyName: experienceToEdit.companyName,
                  role: experienceToEdit.role,
                  description: experienceToEdit.description || '',
                }
              : undefined
          }
          onClose={() => {
            handleCloseDialog();
            // Wait a moment before allowing dropdowns to be opened again
            setTimeout(() => {
              setOpenDropdownId(null);
            }, 100);
          }}
          onSubmit={experienceToEdit ? handleEditSubmit : handleSubmit}
          isEditing={!!experienceToEdit}
        />
      )}
      <AlertDialog
        open={deleteConfirmOpen}
        onOpenChange={open => {
          setDeleteConfirmOpen(open);
          if (!open) {
            // Wait a moment before allowing dropdowns to be opened again
            setTimeout(() => {
              setOpenDropdownId(null);
            }, 100);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the experience from your
              profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface ProfileSetupExperienceData {
  startYear: string;
  endYear: string | null;
  companyName: string;
  role: string;
  description: string;
}

function ProfileSetupExperienceDialog({
  initialData,
  onClose,
  onSubmit,
  isEditing = false,
}: {
  initialData?: ProfileSetupExperienceData;
  onClose: () => void;
  onSubmit: (data: ProfileSetupExperienceData) => Promise<void>;
  isEditing?: boolean;
}) {
  const [startYear, setStartYear] = useState<string>(initialData?.startYear || '');
  const [endYear, setEndYear] = useState<string | null>(initialData?.endYear || '');
  const [isPresent, setIsPresent] = useState<boolean>(initialData?.endYear === null);
  const [companyName, setCompanyName] = useState<string>(initialData?.companyName || '');
  const [role, setRole] = useState<string>(initialData?.role || '');
  const [description, setDescription] = useState<string>(initialData?.description || '');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Dialog
      open={true}
      onOpenChange={state => {
        if (!state) onClose();
      }}
    >
      <DialogContent
        className="sm:max-w-[425px]"
        onPointerDownOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => {
          // Allow escape key to close dialog
          onClose();
        }}
      >
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update details about your professional experience.'
              : 'Add details about your professional experience.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="startYear">Start Year</Label>
              <Input
                id="startYear"
                type="number"
                placeholder="e.g., 2020"
                value={startYear}
                onChange={e => setStartYear(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="endYear">End Year</Label>
              <Input
                id="endYear"
                type="number"
                placeholder={isPresent ? 'Present' : 'e.g., 2023'}
                value={isPresent ? '' : (endYear ?? '')}
                onChange={e => setEndYear(e.target.value || null)}
                disabled={isPresent}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <Checkbox
              id="isPresent"
              checked={isPresent}
              onCheckedChange={checked => {
                const isChecked = Boolean(checked);
                setIsPresent(isChecked);
                if (isChecked) {
                  setEndYear(null);
                }
              }}
            />
            <Label htmlFor="isPresent" className="text-sm font-normal ml-2 cursor-pointer">
              I currently work here
            </Label>
          </div>
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            placeholder="Company name"
            value={companyName}
            onChange={e => setCompanyName(e.currentTarget.value)}
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            placeholder="Your position"
            value={role}
            onChange={e => {
              setRole(e.target.value);
            }}
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your responsibilities and achievements"
            value={description}
            onChange={e => {
              setDescription(e.target.value);
            }}
            autoComplete="off"
          />
        </div>
        <DialogFooter>
          {/* Submit Button with Loading State */}
          <div className="w-full flex flex-col gap-2">
            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              onClick={async () => {
                try {
                  setLoading(true);
                  setError('');
                  await onSubmit({
                    startYear,
                    endYear: isPresent ? null : endYear,
                    companyName,
                    role,
                    description,
                  });
                  onClose();
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Failed to save experience');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditing ? 'Update' : 'Save'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
