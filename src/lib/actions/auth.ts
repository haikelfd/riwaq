'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

async function getAuthenticatedUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function updateProfile(
  data: { full_name?: string }
): Promise<{ success: boolean; error?: string }> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, error: 'unauthorized' };

  const supabase = createAdminClient();

  const updateData: Record<string, unknown> = {};
  if (data.full_name !== undefined) updateData.full_name = data.full_name.trim() || null;

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile:', error.code, error.message);
    return { success: false, error: 'profileUpdateError' };
  }

  return { success: true };
}

export async function markTourAsSeen(): Promise<{ success: boolean; error?: string }> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, error: 'unauthorized' };

  const supabase = createAdminClient();

  const { error } = await supabase
    .from('profiles')
    .update({ has_seen_tour: true })
    .eq('id', userId);

  if (error) {
    console.error('Error marking tour as seen:', error.code, error.message);
    return { success: false, error: 'tourUpdateError' };
  }

  return { success: true };
}
