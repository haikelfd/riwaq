'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { v4 as uuidv4 } from 'uuid';

export async function uploadListingImage(
  listingId: string,
  formData: FormData,
  sortOrder: number
): Promise<{ success: boolean; imagePath?: string; error?: string }> {
  const supabase = createAdminClient();
  const file = formData.get('file') as File;

  if (!file) {
    return { success: false, error: 'Aucun fichier fourni.' };
  }

  // Whitelist safe image MIME types (block SVG to prevent XSS)
  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { success: false, error: 'Format accepté : JPEG, PNG, WebP ou GIF.' };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: 'L\'image ne doit pas dépasser 5 Mo.' };
  }

  // Whitelist extensions to prevent malicious file types
  const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { success: false, error: 'Extension non autorisée.' };
  }

  // Validate file magic numbers to prevent spoofed MIME types
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const isJPEG = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
  const isPNG = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
  const isGIF = bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46;
  const isWEBP = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46
    && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  if (!isJPEG && !isPNG && !isGIF && !isWEBP) {
    return { success: false, error: 'Le contenu du fichier ne correspond pas à un format image valide.' };
  }
  const fileName = `${listingId}/${uuidv4()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('listing-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Error uploading image:', uploadError.message);
    return { success: false, error: 'Erreur lors du téléchargement de l\'image.' };
  }

  // Save reference in DB
  const { error: dbError } = await supabase.from('listing_images').insert({
    listing_id: listingId,
    storage_path: fileName,
    sort_order: sortOrder,
  });

  if (dbError) {
    console.error('Error saving image reference:', dbError.code, dbError.message);
    return { success: false, error: 'Erreur lors de l\'enregistrement de l\'image.' };
  }

  return { success: true, imagePath: fileName };
}

export async function deleteListingImage(
  imageId: string,
  storagePath: string
): Promise<{ success: boolean; error?: string }> {
  // Validate storage path to prevent path traversal
  if (storagePath.includes('..') || !storagePath.match(/^[a-f0-9-]+\/[a-f0-9-]+\.\w+$/)) {
    return { success: false, error: 'Chemin de fichier invalide.' };
  }

  const supabase = createAdminClient();

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('listing-images')
    .remove([storagePath]);

  if (storageError) {
    console.error('Error deleting image from storage:', storageError.message);
  }

  // Delete from DB
  const { error: dbError } = await supabase
    .from('listing_images')
    .delete()
    .eq('id', imageId);

  if (dbError) {
    console.error('Error deleting image record:', dbError.code, dbError.message);
    return { success: false, error: 'Erreur lors de la suppression de l\'image.' };
  }

  return { success: true };
}
