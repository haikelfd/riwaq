'use server';

import { Listing } from '@/lib/types';
import { isDemoMode, DEMO_LISTINGS } from '@/lib/demo-data';

export async function fetchSavedListings(ids: string[]): Promise<Listing[]> {
  if (ids.length === 0) return [];

  if (isDemoMode()) {
    return DEMO_LISTINGS.filter((l) => ids.includes(l.id));
  }

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      category:categories(*),
      location:locations(*),
      images:listing_images(*)
    `)
    .in('id', ids)
    .neq('status', 'deleted')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching saved listings:', error);
    return [];
  }

  return (data as Listing[]) || [];
}
