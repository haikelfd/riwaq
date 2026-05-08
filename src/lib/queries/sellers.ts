import { Seller, Listing } from '@/lib/types';

export async function getSellerById(id: string): Promise<Seller | null> {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  // Never expose management_token in public queries
  const { data, error } = await supabase
    .from('sellers')
    .select('id, full_name, phone, email, created_at, updated_at')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching seller:', error.code, error.message);
    return null;
  }

  return data as unknown as Seller;
}

export async function getSellerByToken(token: string): Promise<Seller | null> {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sellers')
    .select('id, full_name, phone, email, created_at, updated_at')
    .eq('management_token', token)
    .single();

  if (error) {
    console.error('Error fetching seller by token:', error.code, error.message);
    return null;
  }

  return data as Seller;
}

export async function getListingsBySellerId(sellerId: string): Promise<Listing[]> {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('listings')
    .select(`
      id, title, description, price, condition, category_id, location_id,
      phone, seller_name, seller_id, brand, model, year, energy_type, delivery_type,
      status, created_at, expires_at, updated_at, user_id,
      category:categories(*),
      location:locations(*),
      images:listing_images(*)
    `)
    .eq('seller_id', sellerId)
    .in('status', ['active', 'sold'])
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching seller listings:', error.code, error.message);
    return [];
  }

  return (data as unknown as Listing[]) || [];
}
