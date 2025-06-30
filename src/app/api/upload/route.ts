import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth, ApiAuthContext } from '../middleware';
import { uploadFile } from '@/services/upload';

export const POST = withApiAuth(async (req: NextRequest, { env, user, db }: ApiAuthContext) => {
  try {
    // Make sure we have the required services available
    if (!env || !env.USER_UPLOADS) {
      return NextResponse.json(
        { error: 'Storage or image processing service unavailable' },
        { status: 503 }
      );
    }

    // Get the form data from the request
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    // Validate file exists
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to ArrayBuffer for processing
    const arrayBuffer = await file.arrayBuffer();

    const { url } = await uploadFile(db, user, {
      buffer: arrayBuffer,
      filename: file.name,
    });

    // Ensure the upload service returned a valid URL
    if (!url) {
      return NextResponse.json(
        { error: 'File upload service failed to return a valid URL. Please try again later.' },
        { status: 500 }
      );
    }

    // Return the URL and path of the uploaded file
    return NextResponse.json({
      success: true,
      url,
    });
  } catch (error) {
    console.error('Profile upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
});
