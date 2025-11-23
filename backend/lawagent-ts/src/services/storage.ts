import { supabaseAdmin } from './supabaseClient';
import { config } from '@/config';
import { v4 as uuidv4 } from 'uuid';

export interface SignedUploadUrlResponse {
  signedUrl: string;
  token: string;
  path: string;
}

export interface UploadMetadata {
  fileName: string;
  fileSize: number;
  mimeType: string;
  userId: string;
  caseId?: string;
}

/**
 * Generate a signed URL for file upload to Supabase Storage
 */
export const generateSignedUploadUrl = async (
  metadata: UploadMetadata
): Promise<SignedUploadUrlResponse> => {
  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase Storage is not configured. Please check your environment variables.');
    }

    // Generate unique file path
    const fileExtension = metadata.fileName.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `${metadata.userId}/${uniqueFileName}`;

    // Create signed URL for upload
    const { data, error } = await supabaseAdmin.storage
      .from(config.supabase.storageBucket)
      .createSignedUploadUrl(filePath);

    if (error) {
      throw new Error(`Failed to create signed URL: ${error.message}`);
    }

    return {
      signedUrl: data.signedUrl,
      token: data.token,
      path: filePath,
    };
  } catch (error) {
    console.error('Error generating signed upload URL:', error);
    throw new Error('Failed to generate upload URL');
  }
};

/**
 * Generate a signed URL for file download from Supabase Storage
 */
export const generateSignedDownloadUrl = async (
  filePath: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> => {
  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase Storage is not configured. Please check your environment variables.');
    }

    const { data, error } = await supabaseAdmin.storage
      .from(config.supabase.storageBucket)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      throw new Error(`Failed to create signed download URL: ${error.message}`);
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Error generating signed download URL:', error);
    throw new Error('Failed to generate download URL');
  }
};

/**
 * Delete a file from Supabase Storage
 */
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase Storage is not configured. Please check your environment variables.');
    }

    const { error } = await supabaseAdmin.storage
      .from(config.supabase.storageBucket)
      .remove([filePath]);

    if (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
};

/**
 * Get file info from Supabase Storage
 */
export const getFileInfo = async (filePath: string) => {
  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase Storage is not configured. Please check your environment variables.');
    }

    const { data, error } = await supabaseAdmin.storage
      .from(config.supabase.storageBucket)
      .list(filePath.split('/').slice(0, -1).join('/'), {
        search: filePath.split('/').pop(),
      });

    if (error) {
      throw new Error(`Failed to get file info: ${error.message}`);
    }

    return data[0] || null;
  } catch (error) {
    console.error('Error getting file info:', error);
    throw new Error('Failed to get file info');
  }
};