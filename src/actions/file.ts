'use server';
import { withAuthAction } from './middleware';

export const getFileListAction = withAuthAction(async ({ db, user }) => {
  const files = await db.query.userUpload.findMany({
    where: (upload, { eq }) => eq(upload.userId, user.id),
    orderBy: (upload, { desc }) => desc(upload.createdAt),
    with: {
      bindings: {},
    },
  });

  return files;
});
