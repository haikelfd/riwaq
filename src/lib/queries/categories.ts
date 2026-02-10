import { Category, Location } from '@/lib/types';
import { isDemoMode, DEMO_CATEGORIES, DEMO_LOCATIONS } from '@/lib/demo-data';

export async function getCategories(): Promise<Category[]> {
  if (isDemoMode()) return DEMO_CATEGORIES;

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return (data as Category[]) || [];
}

export async function getLocations(): Promise<Location[]> {
  if (isDemoMode()) return DEMO_LOCATIONS;

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching locations:', error);
    return [];
  }

  return (data as Location[]) || [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (isDemoMode()) {
    return DEMO_CATEGORIES.find((c) => c.slug === slug) || null;
  }

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    return null;
  }

  return data as Category;
}
