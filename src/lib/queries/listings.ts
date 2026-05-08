import { Listing, ListingFilters } from '@/lib/types';
import { getSearchExpansions } from '@/lib/constants/search-synonyms';

const ITEMS_PER_PAGE = 12;

// Never include management_token in public queries
const LISTING_SELECT = `
  id, title, description, price, condition, category_id, location_id,
  phone, seller_name, seller_id, brand, model, year, energy_type, delivery_type,
  cuisine_type, subcategory_id, specs, status, created_at, expires_at, updated_at, user_id
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyCommonFilters(query: any, filters: ListingFilters) {
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
  if (filters.cuisine_type) {
    query = query.eq('cuisine_type', filters.cuisine_type);
  }
  return query;
}

export async function getListings(filters: ListingFilters = {}): Promise<{
  listings: Listing[];
  total: number;
  isRelated?: boolean;
  relatedTerm?: string;
}> {
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const supabase = createAdminClient();
  const page = filters.page || 1;
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const selectClause = `${LISTING_SELECT},
      category:categories(*),
      location:locations(*),
      subcategory:subcategories(*),
      images:listing_images(*)
    `;

  // Build primary query
  let query = supabase
    .from('listings')
    .select(selectClause, { count: 'exact' })
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (filters.search) {
    query = query.textSearch('search_vector', filters.search, {
      type: 'websearch',
      config: 'french',
    });
  }

  query = applyCommonFilters(query, filters);

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching listings:', error);
    return { listings: [], total: 0 };
  }

  // Fallback: if full-text search returned 0 results, try fuzzy ilike search
  if (filters.search && (!data || data.length === 0)) {
    const term = `%${filters.search}%`;
    let fuzzyQuery = supabase
      .from('listings')
      .select(selectClause, { count: 'exact' })
      .eq('status', 'active')
      .or(`title.ilike.${term},brand.ilike.${term},model.ilike.${term},description.ilike.${term}`)
      .order('created_at', { ascending: false })
      .range(from, to);

    fuzzyQuery = applyCommonFilters(fuzzyQuery, filters);

    const { data: fuzzyData, count: fuzzyCount, error: fuzzyError } = await fuzzyQuery;

    if (!fuzzyError && fuzzyData && fuzzyData.length > 0) {
      return {
        listings: (fuzzyData as unknown as Listing[]) || [],
        total: fuzzyCount || 0,
      };
    }

    // Tier 3: Synonym expansion — search for related terms
    const expansions = getSearchExpansions(filters.search);
    if (expansions && expansions.length > 0) {
      const synonymQuery = expansions.join(' | ');
      let relatedQuery = supabase
        .from('listings')
        .select(selectClause, { count: 'exact' })
        .eq('status', 'active')
        .textSearch('search_vector', synonymQuery, {
          type: 'websearch',
          config: 'french',
        })
        .order('created_at', { ascending: false })
        .range(from, to);

      relatedQuery = applyCommonFilters(relatedQuery, filters);

      const { data: relatedData, count: relatedCount, error: relatedError } = await relatedQuery;

      if (!relatedError && relatedData && relatedData.length > 0) {
        return {
          listings: (relatedData as unknown as Listing[]) || [],
          total: relatedCount || 0,
          isRelated: true,
          relatedTerm: filters.search,
        };
      }
    }
  }

  return {
    listings: (data as unknown as Listing[]) || [],
    total: count || 0,
  };
}

export async function getListingsByCategorySlug(slug: string, filters: ListingFilters = {}): Promise<{
  listings: Listing[];
  total: number;
  categoryName: string;
}> {
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const supabase = createAdminClient();

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
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('listings')
    .select(`${LISTING_SELECT},
      category:categories(*),
      location:locations(*),
      subcategory:subcategories(*),
      images:listing_images(*),
      seller:sellers(id, full_name, created_at)
    `)
    .eq('id', id)
    .in('status', ['active', 'sold'])
    .single();

  if (error) {
    console.error('Error fetching listing:', error, '| id:', id);
    return null;
  }

  return data as unknown as Listing;
}

export async function getListingByToken(token: string): Promise<Listing | null> {
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('listings')
    .select(`${LISTING_SELECT},
      category:categories(*),
      location:locations(*),
      subcategory:subcategories(*),
      images:listing_images(*)
    `)
    .eq('management_token', token)
    .neq('status', 'deleted')
    .single();

  if (error) {
    console.error('Error fetching listing by token:', error);
    return null;
  }

  return data as unknown as Listing;
}

export async function getListingsByIds(ids: string[]): Promise<Listing[]> {
  if (ids.length === 0) return [];

  const { createAdminClient } = await import('@/lib/supabase/admin');
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('listings')
    .select(`${LISTING_SELECT},
      category:categories(*),
      location:locations(*),
      subcategory:subcategories(*),
      images:listing_images(*)
    `)
    .in('id', ids)
    .neq('status', 'deleted')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching listings by ids:', error);
    return [];
  }

  return (data as unknown as Listing[]) || [];
}

export async function getLatestListings(limit = 6): Promise<Listing[]> {
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('listings')
    .select(`${LISTING_SELECT},
      category:categories(*),
      location:locations(*),
      subcategory:subcategories(*),
      images:listing_images(*)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching latest listings:', error);
    return [];
  }

  return (data as unknown as Listing[]) || [];
}

export async function getActiveCuisineTypes(): Promise<string[]> {
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('listings')
    .select('cuisine_type')
    .eq('status', 'active')
    .not('cuisine_type', 'is', null);

  if (error || !data) return [];

  const unique = [...new Set(data.map((d: { cuisine_type: string }) => d.cuisine_type))];
  return unique.sort();
}
