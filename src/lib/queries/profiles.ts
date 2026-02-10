import { Listing } from '@/lib/types';
import { isDemoMode, DEMO_LISTINGS } from '@/lib/demo-data';

export async function getListingsByUserId(userId: string): Promise<Listing[]> {
  if (isDemoMode()) {
    return DEMO_LISTINGS.filter((l) => l.user_id === userId && l.status !== 'deleted');
  }

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('listings')
    .select(`*, category:categories(*), location:locations(*), images:listing_images(*)`)
    .eq('user_id', userId)
    .neq('status', 'deleted')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user listings:', error);
    return [];
  }

  return (data as Listing[]) || [];
}
