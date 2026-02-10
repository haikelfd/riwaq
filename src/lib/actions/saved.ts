'use server';

import { Listing } from '@/lib/types';

export async function fetchSavedListings(ids: string[]): Promise<Listing[]> {
  if (ids.length === 0) return [];

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
