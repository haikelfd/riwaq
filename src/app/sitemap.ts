import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://riwaq.tn';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${BASE_URL}/annonces`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${BASE_URL}/deposer`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE_URL}/a-propos`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${BASE_URL}/conditions`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.2 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
  ];

  const categorySlugs = [
    'cafe-coffee',
    'cuisine-chaude',
    'froid-refrigeration',
    'mobilier',
    'equipements-divers',
    'patisserie-boulangerie',
  ];

  const categoryPages = categorySlugs.map((slug) => ({
    url: `${BASE_URL}/categorie/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Fetch active listings for individual listing URLs
  let listingPages: MetadataRoute.Sitemap = [];
  try {
    const { createAdminClient } = await import('@/lib/supabase/admin');
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('listings')
      .select('id, updated_at')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (data) {
      listingPages = data.map((listing) => ({
        url: `${BASE_URL}/annonce/${listing.id}`,
        lastModified: new Date(listing.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }
  } catch (err) {
    console.error('Sitemap: error fetching listings:', err);
  }

  return [...staticPages, ...categoryPages, ...listingPages];
}
