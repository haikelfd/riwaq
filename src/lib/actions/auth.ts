'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { isDemoMode } from '@/lib/demo-data';

export async function updateProfile(
  userId: string,
  data: { full_name?: string }
): Promise<{ success: boolean; error?: string }> {
  if (isDemoMode()) return { success: true };

  const supabase = createAdminClient();

  const updateData: Record<string, unknown> = {};
  if (data.full_name !== undefined) updateData.full_name = data.full_name.trim() || null;

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: 'Erreur lors de la mise à jour du profil.' };
  }

  return { success: true };
}

export async function markTourAsSeen(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  if (isDemoMode()) return { success: true };

  const supabase = createAdminClient();

  const { error } = await supabase
    .from('profiles')
    .update({ has_seen_tour: true })
    .eq('id', userId);

  if (error) {
    console.error('Error marking tour as seen:', error);
    return { success: false, error: 'Erreur lors de la mise à jour.' };
  }

  return { success: true };
}
