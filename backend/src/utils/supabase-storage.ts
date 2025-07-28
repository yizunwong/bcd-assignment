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
  subfolder?: string, // optional
  customFileNameFn?: (file: Express.Multer.File) => string, // optional
): Promise<string[]> {
  if (!folder) {
    throw new InternalServerErrorException('Upload folder is required');
  }

  const filePaths: string[] = [];

  for (const file of files) {
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/\s+/g, '_'); // space-safe
    const uniqueName = customFileNameFn
      ? customFileNameFn(file)
      : `${timestamp}-${sanitizedName}`;

    const filePath = `${folder}${subfolder ? `/${subfolder}` : ''}/${uniqueName}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true, // optional, based on your overwrite preference
      });

    if (error) {
      throw new InternalServerErrorException(`Upload failed: ${error.message}`);
    }

    filePaths.push(filePath);
  }

  return filePaths;
}

export async function getSignedUrls(
  supabase: SupabaseClient,
  filePaths: string[],
): Promise<string[]> {
  const results = await Promise.all(
    filePaths.map(async (path) => {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(path, SIGNED_URL_EXPIRY);

      if (error || !data?.signedUrl) {
        console.error(`Failed signed URL: ${path}`, error?.message);
        return '';
      }

      return data.signedUrl;
    }),
  );

  return results;
}

export async function removeFileFromStorage(
  supabase: SupabaseClient,
  filePath: string,
): Promise<void> {
  try {
    console.log('Attempting to remove file at path:', filePath);

    const { data, error } = await supabase.storage
      .from(BUCKET)
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
