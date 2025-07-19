// src/utils/uploadFiles.ts
import { InternalServerErrorException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();
const BUCKET = process.env.BUCKET_NAME!;
const SIGNED_URL_EXPIRY = 60 * 60; // 1 hour in seconds

export async function uploadFiles(
  supabase: SupabaseClient,
  files: Array<Express.Multer.File>,
  folder: string,
): Promise<string[]> {
  if (!folder) {
    throw new InternalServerErrorException('Upload folder is required');
  }

  const filePaths: string[] = [];

  for (const file of files) {
    const timestamp = Date.now();
    const uniqueName = `${timestamp}-${file.originalname}`;
    const filePath = `${folder}/${uniqueName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      throw new InternalServerErrorException(uploadError.message);
    }

    filePaths.push(filePath);
  }

  return filePaths;
}

export async function getSignedUrls(
  supabase: SupabaseClient,
  filePaths: string[],
): Promise<string[]> {
  const signedUrls: string[] = [];

  for (const path of filePaths) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, SIGNED_URL_EXPIRY);

    if (error || !data?.signedUrl) {
      console.error(
        `Failed to generate signed URL for: ${path}`,
        error?.message,
      );
      signedUrls.push(''); // or throw if preferred
    } else {
      signedUrls.push(data.signedUrl);
    }
  }

  return signedUrls;
}

export async function removeFileFromStorage(
  supabase: SupabaseClient,
  filePath: string,
): Promise<void> {
  try {
    console.log('Attempting to remove file at path:', filePath);

    const { data, error } = await supabase.storage
      .from('supastorage')
      .remove([filePath]);

    if (error) {
      console.error('File removal error details:', { message: error.message });
      throw new InternalServerErrorException(
        'Failed to remove file from storage: ' + error.message,
      );
    }

    console.log('File removal successful, data:', data);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Caught error during file removal:', error.message);
      throw new InternalServerErrorException(error.message);
    } else {
      console.error('Unknown error during file removal:', error);
      throw new InternalServerErrorException(
        'An unknown error occurred while removing the file',
      );
    }
  }
}
