'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { CreateSellerData } from '@/lib/types';

export async function createSeller(data: CreateSellerData): Promise<{
  success: boolean;
  sellerId?: string;
  managementToken?: string;
  error?: string;
}> {
  // Server-side input validation
  if (!data.full_name?.trim() || data.full_name.trim().length > 100) {
    return { success: false, error: 'sellerNameInvalid' };
  }
  if (!data.phone?.trim() || data.phone.replace(/\D/g, '').length < 8) {
    return { success: false, error: 'sellerPhoneInvalid' };
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { success: false, error: 'sellerEmailInvalid' };
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
    console.error('Error creating seller:', error.code, error.message);
    return { success: false, error: 'sellerCreateError' };
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
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from('sellers')
    .select('id')
    .eq('management_token', token)
    .single();

  if (!existing) {
    return { success: false, error: 'sellerNotFound' };
  }

  // Validate update fields (same rules as createSeller)
  if (data.full_name !== undefined && (!data.full_name.trim() || data.full_name.trim().length > 100)) {
    return { success: false, error: 'sellerNameInvalid' };
  }
  if (data.phone !== undefined && (!data.phone.trim() || data.phone.replace(/\D/g, '').length < 8)) {
    return { success: false, error: 'sellerPhoneInvalid' };
  }
  if (data.email !== undefined && data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { success: false, error: 'sellerEmailInvalid' };
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
    console.error('Error updating seller:', error.code, error.message);
    return { success: false, error: 'sellerUpdateError' };
  }

  return { success: true };
}

export async function fetchSellerByToken(token: string): Promise<{
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  created_at: string;
  updated_at: string;
} | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('sellers')
    .select('id, full_name, phone, email, created_at, updated_at')
    .eq('management_token', token)
    .single();
  return data;
}

export async function fetchSellerListings(sellerId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('listings')
    .select(`
      id, title, description, price, condition, category_id, location_id,
      phone, seller_name, seller_id, brand, model, year, energy_type, delivery_type, subcategory_id, specs,
      status, created_at, expires_at, updated_at, user_id,
      category:categories(*), location:locations(*), images:listing_images(*), subcategory:subcategories(*)
    `)
    .eq('seller_id', sellerId)
    .in('status', ['active', 'sold'])
    .order('created_at', { ascending: false });
  return data || [];
}

export async function resolveSellerByToken(token: string): Promise<string | null> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('sellers')
    .select('id')
    .eq('management_token', token)
    .single();

  return data?.id || null;
}
