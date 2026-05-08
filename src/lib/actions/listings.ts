'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { CreateListingData, Listing } from '@/lib/types';
import { resolveSellerByToken } from '@/lib/actions/sellers';
import { TIER_LIMITS, ANONYMOUS_LIMITS, type UserTier } from '@/lib/constants/tiers';
import { CUISINE_TYPE_VALUES } from '@/lib/constants/cuisine-types';
import { v4 as uuidv4 } from 'uuid';

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_FIELD_LENGTH = 100;

export async function createListing(data: CreateListingData): Promise<{
  success: boolean;
  listingId?: string;
  managementToken?: string;
  error?: string;
}> {
  const supabase = createAdminClient();
  const managementToken = uuidv4();
  const phone = data.phone.trim();

  // Server-side input validation
  if (!data.title?.trim() || data.title.trim().length > MAX_TITLE_LENGTH) {
    return { success: false, error: 'titleInvalid' };
  }
  if (data.description && data.description.length > MAX_DESCRIPTION_LENGTH) {
    return { success: false, error: 'descriptionTooLong' };
  }
  if (data.price !== null && data.price !== undefined && (data.price < 0 || data.price > 999999999)) {
    return { success: false, error: 'priceInvalid' };
  }
  if (!['neuf', 'occasion'].includes(data.condition)) {
    return { success: false, error: 'conditionInvalid' };
  }
  if (phone.replace(/\D/g, '').length < 8) {
    return { success: false, error: 'phoneInvalid' };
  }
  if (data.brand && data.brand.length > MAX_FIELD_LENGTH) {
    return { success: false, error: 'brandTooLong' };
  }
  if (data.model && data.model.length > MAX_FIELD_LENGTH) {
    return { success: false, error: 'modelTooLong' };
  }
  if (data.year && (data.year < 1900 || data.year > new Date().getFullYear() + 1)) {
    return { success: false, error: 'yearInvalid' };
  }
  if (data.energy_type && !['electrique', 'gaz', 'manuel', 'mixte'].includes(data.energy_type)) {
    return { success: false, error: 'energyTypeInvalid' };
  }
  if (data.delivery_type && !['sur_place', 'livraison', 'livraison_nationale'].includes(data.delivery_type)) {
    return { success: false, error: 'deliveryTypeInvalid' };
  }
  if (data.cuisine_type && !CUISINE_TYPE_VALUES.includes(data.cuisine_type)) {
    return { success: false, error: 'cuisineTypeInvalid' };
  }
  if (data.specs) {
    if (typeof data.specs !== 'object' || Array.isArray(data.specs)) {
      return { success: false, error: 'specsInvalid' };
    }
    const keys = Object.keys(data.specs);
    if (keys.length > 20) {
      return { success: false, error: 'specsTooMany' };
    }
    for (const key of keys) {
      const val = data.specs[key];
      if (typeof val !== 'string' && typeof val !== 'number') {
        return { success: false, error: 'specValueInvalid' };
      }
      if (typeof val === 'string' && val.length > MAX_FIELD_LENGTH) {
        return { success: false, error: 'specValueTooLong' };
      }
    }
  }

  // Enforce tier-based post limits
  let tierLimits = ANONYMOUS_LIMITS;
  if (data.user_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', data.user_id)
      .single();
    const userTier: UserTier = (profile?.tier as UserTier) || 'compte';
    tierLimits = TIER_LIMITS[userTier];

    const { count } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', data.user_id)
      .in('status', ['active', 'sold']);
    if ((count || 0) >= tierLimits.maxListings) {
      return { success: false, error: 'listingLimitReached' };
    }
  } else {
    // Anonymous users: max 5 listings per phone per 30-day window (any status)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('phone', phone)
      .is('user_id', null)
      .gte('created_at', thirtyDaysAgo.toISOString());
    if ((count || 0) >= tierLimits.maxListings) {
      return { success: false, error: 'monthlyLimitReached' };
    }
  }

  // Resolve seller_id from profile_token if provided
  let sellerId = data.seller_id || null;
  if (!sellerId && data.profile_token) {
    sellerId = await resolveSellerByToken(data.profile_token);
  }

  const insertData: Record<string, unknown> = {
    title: data.title.trim(),
    description: data.description.trim(),
    price: data.price,
    condition: data.condition,
    category_id: data.category_id,
    location_id: data.location_id,
    phone,
    seller_name: data.seller_name?.trim() || null,
    seller_id: sellerId,
    user_id: data.user_id || null,
    brand: data.brand?.trim() || null,
    model: data.model?.trim() || null,
    year: data.year || null,
    energy_type: data.energy_type || null,
    delivery_type: data.delivery_type || null,
    cuisine_type: data.cuisine_type || null,
    subcategory_id: data.subcategory_id || null,
    specs: data.specs && Object.keys(data.specs).length > 0 ? data.specs : {},
    management_token: managementToken,
    status: 'active',
  };

  // Set expiry based on tier
  if (tierLimits.expiryDays === null) {
    insertData.expires_at = null;
  } else {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + tierLimits.expiryDays);
    insertData.expires_at = expiresAt.toISOString();
  }

  const { data: listing, error } = await supabase
    .from('listings')
    .insert(insertData)
    .select('id')
    .single();

  if (error) {
    console.error('Error creating listing:', error);
    return { success: false, error: 'createError' };
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
  const supabase = createAdminClient();

  // Verify token ownership
  const { data: existing } = await supabase
    .from('listings')
    .select('id, user_id')
    .eq('management_token', token)
    .neq('status', 'deleted')
    .single();

  if (!existing) {
    return { success: false, error: 'listingNotFound' };
  }

  // Anonymous (free tier) listings cannot be edited
  if (!existing.user_id) {
    return { success: false, error: 'freeListingNotEditable' };
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
  if (data.delivery_type !== undefined) updateData.delivery_type = data.delivery_type || null;
  if (data.cuisine_type !== undefined) updateData.cuisine_type = data.cuisine_type || null;
  if (data.subcategory_id !== undefined) updateData.subcategory_id = data.subcategory_id || null;
  if (data.specs !== undefined) {
    updateData.specs = data.specs && Object.keys(data.specs).length > 0 ? data.specs : {};
  }

  const { error } = await supabase
    .from('listings')
    .update(updateData)
    .eq('id', existing.id);

  if (error) {
    console.error('Error updating listing:', error);
    return { success: false, error: 'updateError' };
  }

  return { success: true };
}

export async function deleteListing(
  token: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from('listings')
    .select('id')
    .eq('management_token', token)
    .neq('status', 'deleted')
    .single();

  if (!existing) {
    return { success: false, error: 'listingNotFound' };
  }

  const { error } = await supabase
    .from('listings')
    .update({ status: 'deleted' })
    .eq('id', existing.id);

  if (error) {
    console.error('Error deleting listing:', error);
    return { success: false, error: 'deleteError' };
  }

  return { success: true };
}

export async function markListingAsSold(
  token: string,
  sold: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from('listings')
    .select('id, status')
    .eq('management_token', token)
    .neq('status', 'deleted')
    .single();

  if (!existing) {
    return { success: false, error: 'listingNotFound' };
  }

  const newStatus = sold ? 'sold' : 'active';
  const { error } = await supabase
    .from('listings')
    .update({ status: newStatus })
    .eq('id', existing.id);

  if (error) {
    console.error('Error marking listing as sold:', error);
    return { success: false, error: 'statusUpdateError' };
  }

  return { success: true };
}

// Re-publish an expired anonymous listing (Découverte tier nudge)
export async function republishListing(
  token: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from('listings')
    .select('id, user_id, phone, status')
    .eq('management_token', token)
    .single();

  if (!existing) {
    return { success: false, error: 'listingNotFound' };
  }

  if (existing.status !== 'expired') {
    return { success: false, error: 'onlyExpiredRepublish' };
  }

  // For anonymous listings, check they haven't hit the limit
  if (!existing.user_id) {
    const { count } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('phone', existing.phone)
      .is('user_id', null)
      .in('status', ['active', 'sold']);
    if ((count || 0) >= ANONYMOUS_LIMITS.maxListings) {
      return { success: false, error: 'activeListingExists' };
    }
  }

  // Determine expiry based on whether user has an account
  let expiresAt: string | null = null;
  if (existing.user_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', existing.user_id)
      .single();
    const userTier: UserTier = (profile?.tier as UserTier) || 'compte';
    const tierLimits = TIER_LIMITS[userTier];
    if (tierLimits.expiryDays !== null) {
      const d = new Date();
      d.setDate(d.getDate() + tierLimits.expiryDays);
      expiresAt = d.toISOString();
    }
  } else {
    const d = new Date();
    d.setDate(d.getDate() + ANONYMOUS_LIMITS.expiryDays!);
    expiresAt = d.toISOString();
  }

  const { error } = await supabase
    .from('listings')
    .update({ status: 'active', expires_at: expiresAt })
    .eq('id', existing.id);

  if (error) {
    console.error('Error republishing listing:', error);
    return { success: false, error: 'republishError' };
  }

  return { success: true };
}

// Increment view count for a listing
export async function incrementListingViews(
  listingId: string
): Promise<void> {
  const supabase = createAdminClient();
  await supabase.rpc('increment_view_count', { listing_id: listingId });
}

// Admin actions
export async function adminUpdateListingStatus(
  listingId: string,
  status: 'active' | 'deleted' | 'sold',
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient();

  // Verify the caller is actually an admin before proceeding
  const { data: admin } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', adminId)
    .single();

  if (!admin) {
    return { success: false, error: 'unauthorized' };
  }

  const { error: updateError } = await supabase
    .from('listings')
    .update({ status })
    .eq('id', listingId);

  if (updateError) {
    return { success: false, error: 'moderationError' };
  }

  // Log the action (non-blocking — don't let log failure break the action)
  supabase.from('moderation_log').insert({
    listing_id: listingId,
    action: status === 'deleted' ? 'deleted' : 'approved',
    admin_id: adminId,
  }).then(({ error: logError }) => {
    if (logError) console.error('Error logging moderation action:', logError);
  });

  return { success: true };
}

// Check if a user is an admin (uses admin client to bypass RLS)
export async function checkIsAdmin(userId: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', userId)
    .single();
  return !!data;
}

// Fetch all listings for admin dashboard (uses admin client to bypass RLS)
export async function adminFetchListings(): Promise<Listing[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('listings')
    .select(`
      id, title, description, price, condition, category_id, location_id,
      phone, seller_name, seller_id, brand, model, year, energy_type, delivery_type,
      cuisine_type, subcategory_id, specs, status, created_at, expires_at, updated_at, user_id,
      category:categories(*), location:locations(*), subcategory:subcategories(*)
    `)
    .neq('status', 'deleted')
    .order('created_at', { ascending: false })
    .limit(100);
  return (data as unknown as Listing[]) || [];
}

// Server-safe query for client components (avoids importing queries/listings which pulls in next/headers)
export async function fetchListingByToken(token: string): Promise<Listing | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('listings')
    .select(`*, category:categories(*), location:locations(*), subcategory:subcategories(*), images:listing_images(*)`)
    .eq('management_token', token)
    .neq('status', 'deleted')
    .single();

  if (error) return null;
  return data as Listing;
}

// Delete a listing by ID — for authenticated users deleting their own listings
export async function deleteUserListing(
  listingId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from('listings')
    .select('id')
    .eq('id', listingId)
    .eq('user_id', userId)
    .neq('status', 'deleted')
    .single();

  if (!existing) {
    return { success: false, error: 'listingNotFoundShort' };
  }

  const { error } = await supabase
    .from('listings')
    .update({ status: 'deleted' })
    .eq('id', existing.id);

  if (error) {
    console.error('Error deleting user listing:', error);
    return { success: false, error: 'deleteError' };
  }

  return { success: true };
}
