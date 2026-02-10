'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { CreateListingData, Listing } from '@/lib/types';
import { resolveSellerByToken } from '@/lib/actions/sellers';
import { isDemoMode, DEMO_CATEGORIES, DEMO_LOCATIONS, DEMO_LISTINGS } from '@/lib/demo-data';
import { addDemoListing, getDemoListingByToken, updateDemoListing } from '@/lib/demo-store';
import { v4 as uuidv4 } from 'uuid';

export async function createListing(data: CreateListingData): Promise<{
  success: boolean;
  listingId?: string;
  managementToken?: string;
  error?: string;
}> {
  if (isDemoMode()) {
    const listingId = `demo-new-${Date.now()}`;
    const managementToken = `demo-token-new-${Date.now()}`;
    const category = DEMO_CATEGORIES.find((c) => c.id === data.category_id);
    const location = DEMO_LOCATIONS.find((l) => l.id === data.location_id);
    const now = new Date().toISOString();

    addDemoListing({
      id: listingId,
      title: data.title.trim(),
      description: data.description.trim(),
      price: data.price ?? null,
      condition: data.condition,
      category_id: data.category_id,
      location_id: data.location_id,
      phone: data.phone.trim(),
      seller_name: data.seller_name?.trim() || null,
      seller_id: data.seller_id || null,
      brand: data.brand?.trim() || null,
      model: data.model?.trim() || null,
      year: data.year || null,
      energy_type: data.energy_type || null,
      user_id: data.user_id || null,
      management_token: managementToken,
      status: 'active',
      created_at: now,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: now,
      category: category || undefined,
      location: location || undefined,
      images: [],
    });

    return { success: true, listingId, managementToken };
  }

  const supabase = createAdminClient();
  const managementToken = uuidv4();

  // Resolve seller_id from profile_token if provided
  let sellerId = data.seller_id || null;
  if (!sellerId && data.profile_token) {
    sellerId = await resolveSellerByToken(data.profile_token);
  }

  const { data: listing, error } = await supabase
    .from('listings')
    .insert({
      title: data.title.trim(),
      description: data.description.trim(),
      price: data.price,
      condition: data.condition,
      category_id: data.category_id,
      location_id: data.location_id,
      phone: data.phone.trim(),
      seller_name: data.seller_name?.trim() || null,
      seller_id: sellerId,
      user_id: data.user_id || null,
      brand: data.brand?.trim() || null,
      model: data.model?.trim() || null,
      year: data.year || null,
      energy_type: data.energy_type || null,
      management_token: managementToken,
      status: 'active',
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating listing:', error);
    return { success: false, error: 'Erreur lors de la création de l\'annonce.' };
  }

  return {
    success: true,
    listingId: listing.id,
    managementToken,
  };
}

export async function updateListing(
  token: string,
  data: Partial<CreateListingData>
): Promise<{ success: boolean; error?: string }> {
  if (isDemoMode()) {
    const existing = getDemoListingByToken(token) || DEMO_LISTINGS.find((l) => l.management_token === token);
    if (!existing) return { success: false, error: 'Annonce introuvable ou lien invalide.' };

    const updates: Record<string, unknown> = {};
    if (data.title !== undefined) updates.title = data.title.trim();
    if (data.description !== undefined) updates.description = data.description.trim();
    if (data.price !== undefined) updates.price = data.price;
    if (data.condition !== undefined) updates.condition = data.condition;
    if (data.phone !== undefined) updates.phone = data.phone.trim();
    if (data.seller_name !== undefined) updates.seller_name = data.seller_name?.trim() || null;
    if (data.brand !== undefined) updates.brand = data.brand?.trim() || null;
    if (data.model !== undefined) updates.model = data.model?.trim() || null;
    if (data.year !== undefined) updates.year = data.year || null;
    if (data.energy_type !== undefined) updates.energy_type = data.energy_type || null;
    updates.updated_at = new Date().toISOString();

    updateDemoListing(existing.id, updates);
    return { success: true };
  }

  const supabase = createAdminClient();

  // Verify token ownership
  const { data: existing } = await supabase
    .from('listings')
    .select('id')
    .eq('management_token', token)
    .neq('status', 'deleted')
    .single();

  if (!existing) {
    return { success: false, error: 'Annonce introuvable ou lien invalide.' };
  }

  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.description !== undefined) updateData.description = data.description.trim();
  if (data.price !== undefined) updateData.price = data.price;
  if (data.condition !== undefined) updateData.condition = data.condition;
  if (data.category_id !== undefined) updateData.category_id = data.category_id;
  if (data.location_id !== undefined) updateData.location_id = data.location_id;
  if (data.phone !== undefined) updateData.phone = data.phone.trim();
  if (data.seller_name !== undefined) updateData.seller_name = data.seller_name?.trim() || null;
  if (data.brand !== undefined) updateData.brand = data.brand?.trim() || null;
  if (data.model !== undefined) updateData.model = data.model?.trim() || null;
  if (data.year !== undefined) updateData.year = data.year || null;
  if (data.energy_type !== undefined) updateData.energy_type = data.energy_type || null;

  const { error } = await supabase
    .from('listings')
    .update(updateData)
    .eq('id', existing.id);

  if (error) {
    console.error('Error updating listing:', error);
    return { success: false, error: 'Erreur lors de la mise à jour.' };
  }

  return { success: true };
}

export async function deleteListing(
  token: string
): Promise<{ success: boolean; error?: string }> {
  if (isDemoMode()) {
    const existing = getDemoListingByToken(token) || DEMO_LISTINGS.find((l) => l.management_token === token);
    if (!existing) return { success: false, error: 'Annonce introuvable ou lien invalide.' };
    updateDemoListing(existing.id, { status: 'deleted' });
    return { success: true };
  }

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from('listings')
    .select('id')
    .eq('management_token', token)
    .neq('status', 'deleted')
    .single();

  if (!existing) {
    return { success: false, error: 'Annonce introuvable ou lien invalide.' };
  }

  const { error } = await supabase
    .from('listings')
    .update({ status: 'deleted' })
    .eq('id', existing.id);

  if (error) {
    console.error('Error deleting listing:', error);
    return { success: false, error: 'Erreur lors de la suppression.' };
  }

  return { success: true };
}

export async function markListingAsSold(
  token: string,
  sold: boolean
): Promise<{ success: boolean; error?: string }> {
  if (isDemoMode()) {
    const existing = getDemoListingByToken(token) || DEMO_LISTINGS.find((l) => l.management_token === token);
    if (!existing) return { success: false, error: 'Annonce introuvable ou lien invalide.' };
    updateDemoListing(existing.id, { status: sold ? 'sold' : 'active' });
    return { success: true };
  }

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from('listings')
    .select('id, status')
    .eq('management_token', token)
    .neq('status', 'deleted')
    .single();

  if (!existing) {
    return { success: false, error: 'Annonce introuvable ou lien invalide.' };
  }

  const newStatus = sold ? 'sold' : 'active';
  const { error } = await supabase
    .from('listings')
    .update({ status: newStatus })
    .eq('id', existing.id);

  if (error) {
    console.error('Error marking listing as sold:', error);
    return { success: false, error: 'Erreur lors de la mise à jour du statut.' };
  }

  return { success: true };
}

// Admin actions
export async function adminUpdateListingStatus(
  listingId: string,
  status: 'active' | 'deleted' | 'sold',
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  if (isDemoMode()) {
    updateDemoListing(listingId, { status });
    return { success: true };
  }

  const supabase = createAdminClient();

  const { error: updateError } = await supabase
    .from('listings')
    .update({ status })
    .eq('id', listingId);

  if (updateError) {
    return { success: false, error: 'Erreur lors de la modération.' };
  }

  // Log the action
  await supabase.from('moderation_log').insert({
    listing_id: listingId,
    action: status === 'deleted' ? 'deleted' : 'approved',
    admin_id: adminId,
  });

  return { success: true };
}

// Server-safe query for client components (avoids importing queries/listings which pulls in next/headers)
export async function fetchListingByToken(token: string): Promise<Listing | null> {
  if (isDemoMode()) {
    return getDemoListingByToken(token) || DEMO_LISTINGS.find((l) => l.management_token === token) || null;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('listings')
    .select(`*, category:categories(*), location:locations(*), images:listing_images(*)`)
    .eq('management_token', token)
    .neq('status', 'deleted')
    .single();

  if (error) return null;
  return data as Listing;
}
