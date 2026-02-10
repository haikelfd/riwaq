'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { isDemoMode } from '@/lib/demo-data';
import { v4 as uuidv4 } from 'uuid';

export async function uploadListingImage(
  listingId: string,
  formData: FormData,
  sortOrder: number
): Promise<{ success: boolean; imagePath?: string; error?: string }> {
  if (isDemoMode()) {
    return { success: true, imagePath: `demo/${listingId}/${sortOrder}.jpg` };
  }

  const supabase = createAdminClient();
  const file = formData.get('file') as File;

  if (!file) {
    return { success: false, error: 'Aucun fichier fourni.' };
  }

  // Validate file
  if (!file.type.startsWith('image/')) {
    return { success: false, error: 'Le fichier doit être une image.' };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: 'L\'image ne doit pas dépasser 5 Mo.' };
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${listingId}/${uuidv4()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('listing-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return { success: false, error: 'Erreur lors du téléchargement de l\'image.' };
  }

  // Save reference in DB
  const { error: dbError } = await supabase.from('listing_images').insert({
    listing_id: listingId,
    storage_path: fileName,
    sort_order: sortOrder,
  });

  if (dbError) {
    console.error('Error saving image reference:', dbError);
    return { success: false, error: 'Erreur lors de l\'enregistrement de l\'image.' };
  }

  return { success: true, imagePath: fileName };
}

export async function deleteListingImage(
  imageId: string,
  storagePath: string
): Promise<{ success: boolean; error?: string }> {
  if (isDemoMode()) {
    return { success: true };
  }

  const supabase = createAdminClient();

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('listing-images')
    .remove([storagePath]);

  if (storageError) {
    console.error('Error deleting image from storage:', storageError);
  }

  // Delete from DB
  const { error: dbError } = await supabase
    .from('listing_images')
    .delete()
    .eq('id', imageId);

  if (dbError) {
    console.error('Error deleting image record:', dbError);
    return { success: false, error: 'Erreur lors de la suppression de l\'image.' };
  }

  return { success: true };
}
