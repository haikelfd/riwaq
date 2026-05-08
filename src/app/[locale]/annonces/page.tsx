import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import SearchBar from '@/components/ui/SearchBar';
import ListingFilters from '@/components/listings/ListingFilters';
import ListingGrid from '@/components/listings/ListingGrid';
import { getListings } from '@/lib/queries/listings';
import { getCategories, getLocations } from '@/lib/queries/categories';
import { ListingFilters as ListingFiltersType } from '@/lib/types';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('browse');
  return {
    title: t('title'),
    description: t('metaDescription'),
    alternates: {
      canonical: '/annonces',
    },
  };
}

interface BrowsePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

async function ListingsContent({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const t = await getTranslations('browse');

  const filters: ListingFiltersType = {
    search: searchParams.search,
    category: searchParams.category,
    location: searchParams.location,
    condition: searchParams.condition as ListingFiltersType['condition'],
    cuisine_type: searchParams.cuisine_type as ListingFiltersType['cuisine_type'],
    price_min: searchParams.price_min ? Number(searchParams.price_min) : undefined,
    price_max: searchParams.price_max ? Number(searchParams.price_max) : undefined,
    page: searchParams.page ? Number(searchParams.page) : 1,
  };

  const [result, categories, locations] = await Promise.all([
    getListings(filters),
    getCategories(),
    getLocations(),
  ]);
  const { listings, total, isRelated, relatedTerm } = result;

  const currentPage = filters.page || 1;
  const totalPages = Math.ceil(total / 12);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search bar */}
      <div className="mb-6">
        <SearchBar initialQuery={filters.search} />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 p-4 md:sticky md:top-20">
            <h2 className="font-heading text-lg font-semibold text-slate-900 mb-4">{t('filters')}</h2>
            <Suspense fallback={<div>{t('loadingListings')}</div>}>
              <ListingFilters categories={categories} locations={locations} />
            </Suspense>
          </div>
        </aside>

        {/* Listing results */}
        <div className="flex-1">
          {isRelated && relatedTerm && (
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-amber-800">
                {t('noExactResults', { term: relatedTerm })}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">
              {total === 1
                ? t('resultCount', { count: total })
                : t('resultCountPlural', { count: total })}
            </p>
          </div>

          <ListingGrid listings={listings} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {(() => {
                const pages: (number | '...')[] = [];
                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1);
                  if (currentPage > 3) pages.push('...');
                  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                    pages.push(i);
                  }
                  if (currentPage < totalPages - 2) pages.push('...');
                  pages.push(totalPages);
                }
                return pages.map((page, idx) =>
                  page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-sm text-slate-400">
                      ...
                    </span>
                  ) : (
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
                  )
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function BrowsePage({ params, searchParams }: BrowsePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('browse');
  const sp = await searchParams;
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <p className="text-slate-500">{t('loadingListings')}</p>
      </div>
    }>
      <ListingsContent searchParams={sp} />
    </Suspense>
  );
}
