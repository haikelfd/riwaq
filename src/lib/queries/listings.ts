import { Listing, ListingFilters } from '@/lib/types';

const ITEMS_PER_PAGE = 12;

export async function getListings(filters: ListingFilters = {}): Promise<{
  listings: Listing[];
  total: number;
}> {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const page = filters.page || 1;
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let query = supabase
    .from('listings')
    .select(`
      *,
      category:categories(*),
      location:locations(*),
      images:listing_images(*)
    `, { count: 'exact' })
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (filters.search) {
    query = query.textSearch('search_vector', filters.search, {
      type: 'websearch',
      config: 'french',
    });
  }

  if (filters.category) {
    query = query.eq('category_id', filters.category);
  }

  if (filters.location) {
    query = query.eq('location_id', filters.location);
  }

  if (filters.condition) {
    query = query.eq('condition', filters.condition);
  }

  if (filters.price_min !== undefined) {
    query = query.gte('price', filters.price_min);
  }

  if (filters.price_max !== undefined) {
    query = query.lte('price', filters.price_max);
  }

  if (filters.energy_type) {
    query = query.eq('energy_type', filters.energy_type);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching listings:', error);
    return { listings: [], total: 0 };
  }

  return {
    listings: (data as Listing[]) || [],
    total: count || 0,
  };
}

export async function getListingsByCategorySlug(slug: string, filters: ListingFilters = {}): Promise<{
  listings: Listing[];
  total: number;
  categoryName: string;
}> {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!category) {
    return { listings: [], total: 0, categoryName: '' };
  }

  const result = await getListings({ ...filters, category: category.id });
  return { ...result, categoryName: category.name };
}

export async function getListingById(id: string): Promise<Listing | null> {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      category:categories(*),
      location:locations(*),
      images:listing_images(*),
      seller:sellers(id, full_name, created_at)
    `)
    .eq('id', id)
    .in('status', ['active', 'sold'])
    .single();

  if (error) {
    console.error('Error fetching listing:', error);
    return null;
  }

  return data as Listing;
}

export async function getListingByToken(token: string): Promise<Listing | null> {
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
    .eq('management_token', token)
    .neq('status', 'deleted')
    .single();

  if (error) {
    console.error('Error fetching listing by token:', error);
    return null;
  }

  return data as Listing;
}

export async function getListingsByIds(ids: string[]): Promise<Listing[]> {
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
    console.error('Error fetching listings by ids:', error);
    return [];
  }

  return (data as Listing[]) || [];
}

export async function getLatestListings(limit = 6): Promise<Listing[]> {
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
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching latest listings:', error);
    return [];
  }

  return (data as Listing[]) || [];
}
