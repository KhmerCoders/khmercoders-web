import type { BindingResourceType, MainDatabase, UserRecord } from '@/types';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { v4 as uuidv4 } from 'uuid';
import * as schema from '@/libs/db/schema';
import { eq, sql, and, notInArray } from 'drizzle-orm';
import { getContentTypeFromExtension } from '@/utils/content-type';
import { USER_UPLOAD_URL } from '@/constants';
import { getDB } from '@/libs/db';

interface UploadFileOptions {
  buffer: ArrayBuffer;
  filename: string;
  folder?: string;
}

interface UploadResponse {
  url: string;
  id: string;
}

const MAX_STORAGE_LIMIT = 1024 * 1024 * 1024; // 1 GB

export async function uploadFile(
  db: MainDatabase,
  user: UserRecord,
  { folder, filename, buffer }: UploadFileOptions
): Promise<UploadResponse> {
  const uuid = uuidv4();
  const extension = filename.split('.').pop() || '';
  const { env } = getCloudflareContext();

  if (!extension) {
    throw 'Invalid file name: no extension found';
  }

  if (user.storageUsed + buffer.byteLength > MAX_STORAGE_LIMIT) {
    throw new Error(
      'You have reached your storage limit. Please delete some files or upgrade your plan.'
    );
  }

  // Allow only image file, compression file, or pdf
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const compressionExtensions = ['zip', 'rar', 'tar', 'gz'];
  const videoExtensions = ['mp4', 'mov', 'avi', 'mkv'];
  const docExtensions = ['pdf'];

  const allowedExtensions = [
    ...imageExtensions,
    ...compressionExtensions,
    ...docExtensions,
    ...videoExtensions,
  ];

  if (!allowedExtensions.includes(extension.toLowerCase())) {
    throw new Error(
      'This extension is not allowed. If you think this is a mistake, please contact support.'
    );
  }

  const generatedFilename = `${uuid}.${extension}`;
  const path = [folder ?? '', generatedFilename].filter(Boolean).join('/');

  const contentType = getContentTypeFromExtension(extension);

  await env.USER_UPLOADS.put(path, buffer, {
    httpMetadata: {
      contentType,
    },
  });

  const url = `${USER_UPLOAD_URL}/${path}`;

  await db.batch([
    db.insert(schema.userUpload).values({
      id: uuid,
      userId: user.id, // Use the authenticated user's ID
      fileName: filename ?? generatedFilename,
      fileType: contentType,
      fileSize: buffer.byteLength,
      fileUrl: url,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    db
      .update(schema.user)
      .set({
        storageUsed: sql`${user.storageUsed} + ${Number(buffer.byteLength) ?? 0}`,
      })
      .where(eq(schema.user.id, user.id)),
  ]);

  return {
    id: uuid,
    url,
  };
}

/**
 * Associates uploaded files with specific resources in the system.
 *
 * Binding files to resources prevents accidental deletion of files that are in use,
 * maintains referential integrity, and helps track file usage across the application.
 * This ensures that files actively referenced by resources remain available and
 * provides better storage management.
 */
export async function syncUploadsToResource(
  userId: string,
  uploadIds: string[],
  resourceType: BindingResourceType,
  resourceId: string
) {
  // Return early if no upload IDs provided
  if (!uploadIds.length) {
    return { success: true, bindings: [] };
  }

  const db = await getDB();

  // Validate if all upload IDs exist and belong to the user
  const uploadRecords = await db.query.userUpload.findMany({
    where: (userUpload, { inArray, and, eq }) =>
      and(inArray(userUpload.id, uploadIds), eq(userUpload.userId, userId)),
  });

  if (uploadRecords.length !== uploadIds.length) {
    throw new Error('Some upload IDs do not exist or do not belong to the user.');
  }

  await db.batch([
    // Remove old bindings that aren't in the new list
    db
      .delete(schema.userUploadBinding)
      .where(
        and(
          eq(schema.userUploadBinding.resourceType, resourceType),
          eq(schema.userUploadBinding.resourceId, resourceId),
          notInArray(schema.userUploadBinding.userUploadId, uploadIds)
        )
      ),
    // Add new bindings, ignoring any that already exist
    db
      .insert(schema.userUploadBinding)
      .values(
        uploadRecords.map(upload => ({
          resourceType,
          resourceId,
          userUploadId: upload.id,
          createdAt: new Date(),
        }))
      )
      .onConflictDoNothing(),
  ]);
}

/**
 * Removes a user-uploaded file from the system.
 * This function deletes the file from storage and removes its record from the database.
 * It ensures that the file is not currently bound to any resources before deletion.
 * If the file is still in use, it throws an error to prevent accidental data loss.
 */
export async function removeUserUploadFile(uploadId: string) {
  const db = await getDB();

  // Make sure the upload is not bound to any resources
  const bindingCount = await db.query.userUploadBinding.findMany({
    where: eq(schema.userUploadBinding.userUploadId, uploadId),
  });

  if (bindingCount.length > 0) {
    throw new Error('This file is still in use by some resources. Please unbind it first.');
  }

  // Get the upload record to retrieve the file URL
  const uploadRecord = await db.query.userUpload.findFirst({
    where: eq(schema.userUpload.id, uploadId),
  });

  if (!uploadRecord) {
    throw new Error('Upload record not found.');
  }

  // Get file path from the URL
  const filePath = new URL(uploadRecord.fileUrl).pathname.replace(/^\//, '');

  const { env } = getCloudflareContext();

  // Delete the file from storage
  await env.USER_UPLOADS.delete(filePath);

  // Delete the upload record from the database
  // Delete the upload record and update user's storage usage in one batch
  await db.batch([
    db.delete(schema.userUpload).where(eq(schema.userUpload.id, uploadId)),
    db
      .update(schema.user)
      .set({
        storageUsed: sql`${schema.user.storageUsed} - ${uploadRecord.fileSize}`,
      })
      .where(eq(schema.user.id, uploadRecord.userId)),
  ]);
}
