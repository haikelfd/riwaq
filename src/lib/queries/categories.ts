import { Category, Location, Subcategory } from '@/lib/types';

export async function getCategories(): Promise<Category[]> {
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const supabase = createAdminClient();

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
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const supabase = createAdminClient();

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
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const supabase = createAdminClient();

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

export async function getSubcategories(categoryId: string): Promise<Subcategory[]> {
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('subcategories')
    .select('*')
    .eq('category_id', categoryId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }

  return (data as Subcategory[]) || [];
}

export async function getAllSubcategories(): Promise<Subcategory[]> {
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('subcategories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching all subcategories:', error);
    return [];
  }

  return (data as Subcategory[]) || [];
}
