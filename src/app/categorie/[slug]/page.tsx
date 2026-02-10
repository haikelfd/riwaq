import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SearchBar from '@/components/ui/SearchBar';
import ListingFilters from '@/components/listings/ListingFilters';
import ListingGrid from '@/components/listings/ListingGrid';
import { getListingsByCategorySlug } from '@/lib/queries/listings';
import { getCategories, getLocations, getCategoryBySlug } from '@/lib/queries/categories';
import { ListingFilters as ListingFiltersType } from '@/lib/types';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: 'Catégorie introuvable' };

  return {
    title: `${category.name} — Matériel professionnel`,
    description: `Trouvez du matériel professionnel ${category.name.toLowerCase()} d'occasion en Tunisie sur Riwaq.`,
  };
}

async function CategoryContent({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: Record<string, string | undefined>;
}) {
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold text-slate-900 mb-2">{categoryName}</h1>
      <p className="text-slate-500 mb-6">
        {total} annonce{total !== 1 ? 's' : ''} dans cette catégorie
      </p>

      <div className="mb-6">
        <SearchBar initialQuery={filters.search} />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-20">
            <h2 className="font-heading text-lg font-semibold text-slate-900 mb-4">Filtres</h2>
            <Suspense fallback={<div>Chargement...</div>}>
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
  );
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <p className="text-slate-500">Chargement...</p>
      </div>
    }>
      <CategoryContent slug={slug} searchParams={sp} />
    </Suspense>
  );
}
