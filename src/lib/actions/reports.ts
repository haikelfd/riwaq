'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { ReportReason, ListingReport } from '@/lib/types';

const VALID_REASONS: ReportReason[] = [
  'photos_misleading', 'seller_unresponsive', 'already_sold',
  'scam', 'inappropriate', 'other',
];

export async function reportListing(data: {
  listing_id: string;
  reason: ReportReason;
  description?: string;
  reporter_phone?: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient();

  if (!data.listing_id) {
    return { success: false, error: 'listingNotFoundShort' };
  }
  if (!VALID_REASONS.includes(data.reason)) {
    return { success: false, error: 'reportReasonInvalid' };
  }
  if (data.description && data.description.length > 1000) {
    return { success: false, error: 'reportDescriptionTooLong' };
  }

  // Check listing exists and is active
  const { data: listing } = await supabase
    .from('listings')
    .select('id')
    .eq('id', data.listing_id)
    .eq('status', 'active')
    .single();

  if (!listing) {
    return { success: false, error: 'listingNotFoundShort' };
  }

  // Prevent duplicate reports from same phone on same listing
  if (data.reporter_phone) {
    const { count } = await supabase
      .from('listing_reports')
      .select('*', { count: 'exact', head: true })
      .eq('listing_id', data.listing_id)
      .eq('reporter_phone', data.reporter_phone)
      .eq('status', 'pending');
    if ((count || 0) > 0) {
      return { success: false, error: 'reportDuplicate' };
    }
  }

  const { error } = await supabase
    .from('listing_reports')
    .insert({
      listing_id: data.listing_id,
      reason: data.reason,
      description: data.description?.trim() || null,
      reporter_phone: data.reporter_phone?.trim() || null,
    });

  if (error) {
    console.error('Error creating report:', error);
    return { success: false, error: 'reportError' };
  }

  return { success: true };
}

export async function adminFetchReports(): Promise<ListingReport[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('listing_reports')
    .select('*, listing:listings(id, title, status)')
    .order('created_at', { ascending: false })
    .limit(100);
  return (data as unknown as ListingReport[]) || [];
}

export async function adminResolveReport(
  reportId: string,
  action: 'reviewed' | 'dismissed',
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient();

  // Verify admin
  const { data: admin } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', adminId)
    .single();

  if (!admin) {
    return { success: false, error: 'unauthorized' };
  }

  const { error } = await supabase
    .from('listing_reports')
    .update({
      status: action,
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', reportId);

  if (error) {
    return { success: false, error: 'reportResolveError' };
  }

  return { success: true };
}
