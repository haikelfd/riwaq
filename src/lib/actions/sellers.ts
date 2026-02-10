'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { CreateSellerData } from '@/lib/types';
import { isDemoMode, DEMO_SELLERS } from '@/lib/demo-data';

export async function createSeller(data: CreateSellerData): Promise<{
  success: boolean;
  sellerId?: string;
  managementToken?: string;
  error?: string;
}> {
  if (isDemoMode()) {
    return {
      success: true,
      sellerId: 'demo-new-seller',
      managementToken: 'demo-seller-token-new',
    };
  }

  const supabase = createAdminClient();

  const { data: seller, error } = await supabase
    .from('sellers')
    .insert({
      full_name: data.full_name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || null,
    })
    .select('id, management_token')
    .single();

  if (error) {
    console.error('Error creating seller:', error);
    return { success: false, error: 'Erreur lors de la création du profil.' };
  }

  return {
    success: true,
    sellerId: seller.id,
    managementToken: seller.management_token,
  };
}

export async function updateSeller(
  token: string,
  data: Partial<CreateSellerData>
): Promise<{ success: boolean; error?: string }> {
  if (isDemoMode()) {
    return { success: true };
  }

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from('sellers')
    .select('id')
    .eq('management_token', token)
    .single();

  if (!existing) {
    return { success: false, error: 'Profil introuvable ou lien invalide.' };
  }

  const updateData: Record<string, unknown> = {};
  if (data.full_name !== undefined) updateData.full_name = data.full_name.trim();
  if (data.phone !== undefined) updateData.phone = data.phone.trim();
  if (data.email !== undefined) updateData.email = data.email?.trim() || null;

  const { error } = await supabase
    .from('sellers')
    .update(updateData)
    .eq('id', existing.id);

  if (error) {
    console.error('Error updating seller:', error);
    return { success: false, error: 'Erreur lors de la mise à jour du profil.' };
  }

  return { success: true };
}

export async function resolveSellerByToken(token: string): Promise<string | null> {
  if (isDemoMode()) {
    const seller = DEMO_SELLERS.find((s) => s.management_token === token);
    return seller?.id || null;
  }

  const supabase = createAdminClient();

  const { data } = await supabase
    .from('sellers')
    .select('id')
    .eq('management_token', token)
    .single();

  return data?.id || null;
}
