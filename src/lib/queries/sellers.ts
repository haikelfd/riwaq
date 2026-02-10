import { Seller, Listing } from '@/lib/types';
import { isDemoMode, DEMO_SELLERS, DEMO_LISTINGS } from '@/lib/demo-data';

export async function getSellerById(id: string): Promise<Seller | null> {
  if (isDemoMode()) {
    return DEMO_SELLERS.find((s) => s.id === id) || null;
  }

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching seller:', error);
    return null;
  }

  return data as Seller;
}

export async function getSellerByToken(token: string): Promise<Seller | null> {
  if (isDemoMode()) {
    return DEMO_SELLERS.find((s) => s.management_token === token) || null;
  }

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('management_token', token)
    .single();

  if (error) {
    console.error('Error fetching seller by token:', error);
    return null;
  }

  return data as Seller;
}

export async function getListingsBySellerId(sellerId: string): Promise<Listing[]> {
  if (isDemoMode()) {
    return DEMO_LISTINGS.filter((l) => l.seller_id === sellerId);
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
    .eq('seller_id', sellerId)
    .in('status', ['active', 'sold'])
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching seller listings:', error);
    return [];
  }

  return (data as Listing[]) || [];
}
