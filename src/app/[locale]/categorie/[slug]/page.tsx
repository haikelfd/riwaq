import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import SearchBar from '@/components/ui/SearchBar';
import ListingFilters from '@/components/listings/ListingFilters';
import ListingGrid from '@/components/listings/ListingGrid';
import { getListingsByCategorySlug } from '@/lib/queries/listings';
import { getCategories, getLocations, getCategoryBySlug } from '@/lib/queries/categories';
import { ListingFilters as ListingFiltersType, Listing } from '@/lib/types';

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'cafe-coffee': ['machine cafe tunisie', 'machine espresso occasion', 'moulin cafe professionnel', 'equipement cafe'],
  'cuisine-chaude': ['four professionnel tunisie', 'friteuse professionnelle', 'grill restaurant', 'plaque cuisson'],
  'froid-refrigeration': ['refrigerateur professionnel', 'chambre froide tunisie', 'vitrine refrigeree', 'machine glacons'],
  'mobilier': ['mobilier restaurant tunisie', 'table restaurant', 'chaise cafe', 'comptoir bar'],
  'equipements-divers': ['lave vaisselle professionnel', 'robot coupe', 'caisse enregistreuse', 'hotte extraction'],
  'patisserie-boulangerie': ['four patissier tunisie', 'petrin professionnel', 'laminoir', 'batteur patisserie'],
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: 'Categorie introuvable' };

  return {
    title: `${category.name} — Materiel professionnel`,
    description: `Trouvez du materiel professionnel ${category.name.toLowerCase()} d'occasion en Tunisie sur Riwaq. Achetez et vendez au meilleur prix.`,
    keywords: CATEGORY_KEYWORDS[slug] || [],
    alternates: {
      canonical: `/categorie/${slug}`,
    },
    openGraph: {
      title: `${category.name} | Riwaq`,
      description: `Materiel ${category.name.toLowerCase()} professionnel d'occasion en Tunisie.`,
    },
  };
}

async function CategoryContent({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: Record<string, string | undefined>;
}) {
  const t = await getTranslations('browse');

  const filters: ListingFiltersType = {
    search: searchParams.search,
    location: searchParams.location,
    condition: searchParams.condition as ListingFiltersType['condition'],
    price_min: searchParams.price_min ? Number(searchParams.price_min) : undefined,
    price_max: searchParams.price_max ? Number(searchParams.price_max) : undefined,
    page: searchParams.page ? Number(searchParams.page) : 1,
  };

  const [result, categories, locations] = await Promise.all([
    getListingsByCategorySlug(slug, filters),
    getCategories(),
    getLocations(),
  ]);

  if (!result.categoryName) {
    notFound();
  }

  const { listings, total, categoryName } = result;
  const currentPage = filters.page || 1;
  const totalPages = Math.ceil(total / 12);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://riwaq.tn';
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: categoryName,
    numberOfItems: total,
    itemListElement: listings.slice(0, 10).map((listing: Listing, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}/annonce/${listing.id}`,
      name: listing.title,
    })),
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd).replace(/</g, '\\u003c') }}
    />
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold text-slate-900 mb-2">{categoryName}</h1>
      <p className="text-slate-500 mb-6">
        {total === 1
          ? t('resultCount', { count: total })
          : t('resultCountPlural', { count: total })}
      </p>

      <div className="mb-6">
        <SearchBar initialQuery={filters.search} />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-20">
            <h2 className="font-heading text-lg font-semibold text-slate-900 mb-4">{t('filters')}</h2>
            <Suspense fallback={<div>{t('loadingListings')}</div>}>
              <ListingFilters categories={categories} locations={locations} />
            </Suspense>
          </div>
        </aside>

        <div className="flex-1">
          <ListingGrid listings={listings} emptyMessage={`Aucune annonce dans ${categoryName} pour le moment.`} />

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <a
                  key={page}
                  href={`?${new URLSearchParams({
                    ...Object.fromEntries(
                      Object.entries(filters).filter(([, v]) => v !== undefined) as [string, string][]
                    ),
                    page: page.toString(),
                  }).toString()}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-900 hover:border-brand-500/30'
                  }`}
                >
                  {page}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('common');
  const sp = await searchParams;
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <p className="text-slate-500">{t('loading')}</p>
      </div>
    }>
      <CategoryContent slug={slug} searchParams={sp} />
    </Suspense>
  );
}
