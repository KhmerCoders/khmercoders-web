'use client';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader } from '../generated/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../generated/table';
import { useEffect, useState } from 'react';
import { UserUploadRecord } from '@/types';
import { getFileListAction } from '@/actions/file';
import { formatAgo, formatSize } from '@/utils/format';
import { File } from 'lucide-react';
import { renderIconFromContentType } from '@/utils/icons';
import { cn } from '@/utils';

interface UserUploadProps {
  onSelect: (file: string) => void;
  onClose: () => void;
  mode?: 'file' | 'upload';
}

export function UserUpload({ onSelect, onClose, mode }: UserUploadProps) {
  const [selectedTab, setSelectedTab] = useState<'file' | 'upload'>(mode ?? 'file');
  const [files, setFiles] = useState<UserUploadRecord[]>([]);

  useEffect(() => {
    getFileListAction()
      .then(setFiles)
      .catch(() => {});
  }, []);

  return (
    <Dialog
      open
      onOpenChange={state => {
        if (!state) onClose();
      }}
    >
      <DialogContent style={{ minWidth: 800 }}>
        <DialogHeader>
          <DialogTitle>File Manager</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Manage your files and uploads here.
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-6 flex flex-col" style={{ height: 500 }}>
          <ul className="flex shrink-0">
            <li
              className={`px-6 p-2 border-b-2 flex cursor-pointer ${
                selectedTab === 'file' ? 'border-yellow-500' : 'border-surface'
              }`}
              onClick={() => setSelectedTab('file')}
            >
              File
            </li>
            <li
              className={`px-6 p-2 border-b-2 flex cursor-pointer ${
                selectedTab === 'upload' ? 'border-yellow-500' : 'border-surface'
              }`}
              onClick={() => setSelectedTab('upload')}
            >
              Upload
            </li>
            <li className="grow border-b-2 border-surface"></li>
          </ul>

          <div className="flex grow overflow-y-auto overflow-x-hidden">
            {selectedTab === 'upload' && <FileUploadTabContent onSelect={onSelect} />}
            {selectedTab === 'file' && <FileListTabContent files={files} onSelect={onSelect} />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FileUploadTabContent({ onSelect }: { onSelect: (file: string) => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files ? Array.from(event.target.files) : [];
    setFiles(selectedFiles);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(droppedFiles);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploadProgress(0);

    const fakeProgressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null || prev >= 90) {
          clearInterval(fakeProgressInterval);
          return prev;
        }
        return prev + 10; // Increment progress by 10%
      });
    }, 200); // Update progress every 200ms

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) throw new Error('Upload failed');
        const json = (await response.json()) as { url: string };
        uploadedUrls.push(json.url);
      }

      clearInterval(fakeProgressInterval);
      setUploadProgress(100); // Set progress to 100% on successful upload

      setTimeout(() => {
        setUploadProgress(null);
        setFiles([]);
        onSelect(uploadedUrls[0]);
      }, 500); // Small delay to show 100% progress
    } catch (error) {
      clearInterval(fakeProgressInterval);
      setUploadProgress(null);
      console.error(error);
      alert('Failed to upload file(s)');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div
        className={cn(
          'flex flex-col items-center justify-center w-64 h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
          isDragOver
            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
            : 'border-gray-300 hover:border-yellow-500'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <div className="flex flex-col items-center justify-center">
          <File
            className={cn(
              `size-10 ${isDragOver ? 'text-yellow-500' : 'text-muted-foreground'}`,
              isDragOver && 'animate-pulse'
            )}
          />
          <p
            className={cn(
              'mt-2 text-sm',
              isDragOver ? 'text-yellow-600 dark:text-yellow-400' : 'text-muted-foreground'
            )}
          >
            {isDragOver ? 'Drop your file here' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          multiple
          onChange={handleFileChange}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {files.map((file, index) => {
            const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;

            return (
              <div key={index} className="flex flex-col items-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={`Preview ${index}`}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <File className="w-5 h-5" />
                    <span>{file.name}</span>
                  </div>
                )}
              </div>
            );
          })}
          <button
            onClick={handleUpload}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            Upload
          </button>
        </div>
      )}

      {uploadProgress !== null && (
        <div className="w-full mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-500 h-2 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {Math.round(uploadProgress)}% uploaded
          </p>
        </div>
      )}
    </div>
  );
}

function FileListTabContent({
  files,
  onSelect,
}: {
  files: UserUploadRecord[];
  onSelect: (file: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>File Description</TableHead>
          <TableHead className="text-right">Size</TableHead>
          <TableHead style={{ width: 150 }}>Created at</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map(file => (
          <TableRow key={file.id} className="cursor-pointer" onClick={() => onSelect(file.fileUrl)}>
            <TableCell>
              <div className="flex gap-2 items-center line-clamp-1">
                {renderIconFromContentType(file.fileType)}
                {file.fileName}
              </div>
            </TableCell>
            <TableCell className="text-right">{formatSize(file.fileSize)}</TableCell>
            <TableCell>{formatAgo(file.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
