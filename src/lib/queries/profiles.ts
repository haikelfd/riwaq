import { Listing } from '@/lib/types';

export async function getListingsByUserId(userId: string): Promise<Listing[]> {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('listings')
    .select(`*, category:categories(*), location:locations(*), images:listing_images(*)`)
    .eq('user_id', userId)
    .neq('status', 'deleted')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user listings:', error.code, error.message);
    return [];
  }

  return (data as Listing[]) || [];
}
