import { Listing, ListingFilters } from '@/lib/types';
import { isDemoMode, DEMO_LISTINGS, DEMO_CATEGORIES } from '@/lib/demo-data';
import { getAllDemoCreatedListings, getDemoListing, getDemoListingByToken } from '@/lib/demo-store';

const ITEMS_PER_PAGE = 12;

function allDemoListings(): Listing[] {
  return [...DEMO_LISTINGS, ...getAllDemoCreatedListings()];
}

function filterDemoListings(filters: ListingFilters): { listings: Listing[]; total: number } {
  let results = allDemoListings();

  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        (l.brand && l.brand.toLowerCase().includes(q)) ||
        (l.model && l.model.toLowerCase().includes(q))
    );
  }
  if (filters.category) {
    results = results.filter((l) => l.category_id === filters.category);
  }
  if (filters.location) {
    results = results.filter((l) => l.location_id === filters.location);
  }
  if (filters.condition) {
    results = results.filter((l) => l.condition === filters.condition);
  }
  if (filters.energy_type) {
    results = results.filter((l) => l.energy_type === filters.energy_type);
  }
  if (filters.price_min !== undefined) {
    results = results.filter((l) => l.price !== null && l.price >= filters.price_min!);
  }
  if (filters.price_max !== undefined) {
    results = results.filter((l) => l.price !== null && l.price <= filters.price_max!);
  }

  const total = results.length;
  const page = filters.page || 1;
  const from = (page - 1) * ITEMS_PER_PAGE;
  results = results.slice(from, from + ITEMS_PER_PAGE);

  return { listings: results, total };
}

export async function getListings(filters: ListingFilters = {}): Promise<{
  listings: Listing[];
  total: number;
}> {
  if (isDemoMode()) return filterDemoListings(filters);

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
  if (isDemoMode()) {
    const category = DEMO_CATEGORIES.find((c) => c.slug === slug);
    if (!category) return { listings: [], total: 0, categoryName: '' };
    const result = filterDemoListings({ ...filters, category: category.id });
    return { ...result, categoryName: category.name };
  }

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
  if (isDemoMode()) {
    return getDemoListing(id) || DEMO_LISTINGS.find((l) => l.id === id) || null;
  }

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
  if (isDemoMode()) {
    return getDemoListingByToken(token) || DEMO_LISTINGS.find((l) => l.management_token === token) || null;
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

  if (isDemoMode()) {
    return allDemoListings().filter((l) => ids.includes(l.id));
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
    console.error('Error fetching listings by ids:', error);
    return [];
  }

  return (data as Listing[]) || [];
}

export async function getLatestListings(limit = 6): Promise<Listing[]> {
  if (isDemoMode()) {
    return allDemoListings()
      .filter((l) => l.status === 'active')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
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
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching latest listings:', error);
    return [];
  }

  return (data as Listing[]) || [];
}
