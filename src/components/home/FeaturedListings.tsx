'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Listing, Category } from '@/lib/types';
import ListingCard from '@/components/listings/ListingCard';
import { getCategoryIcon } from '@/components/ui/Icons';

interface FeaturedListingsProps {
  listings: Listing[];
  categories: Category[];
  filterCategoryIds?: string[] | null;
  personaLabel?: string;
  isHidden?: boolean;
}

export default function FeaturedListings({ listings, categories, filterCategoryIds, personaLabel, isHidden = false }: FeaturedListingsProps) {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // First apply persona filter, then category tab filter
  const personaFiltered = useMemo(() => {
    if (!filterCategoryIds || filterCategoryIds.length === 0) return listings;
    return listings.filter((l) => filterCategoryIds.includes(l.category_id));
  }, [listings, filterCategoryIds]);

  const filtered = activeCategory
    ? personaFiltered.filter((l) => l.category_id === activeCategory)
    : personaFiltered;

  // Only show category tabs that are relevant to the persona filter
  const visibleCategories = useMemo(() => {
    if (!filterCategoryIds || filterCategoryIds.length === 0) return categories;
    return categories.filter((c) => filterCategoryIds.includes(c.id));
  }, [categories, filterCategoryIds]);

  return (
    <div
      className="featured-listings-wrapper"
      data-hidden={isHidden}
      aria-hidden={isHidden}
    >
      <div>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-900">
                {personaLabel ? t('recentListingsPersonaTitle', { persona: personaLabel }) : t('recentListingsTitle')}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {personaLabel
                  ? t('recentListingsPersonaSubtitle', { persona: personaLabel.toLowerCase() })
                  : t('recentListingsSubtitle')}
              </p>
            </div>
            <Link
              href="/annonces"
              className="text-sm font-medium text-brand-600 hover:text-brand-500 transition-colors"
            >
              {t('viewAllListings')} &rarr;
            </Link>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeCategory === null
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {tCommon('all')}
            </button>
            {visibleCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {(() => {
                  const Icon = getCategoryIcon(cat.icon);
                  return <Icon className="w-4 h-4 me-1.5 inline-block" />;
                })()}
                {cat.name}
              </button>
            ))}
          </div>

          {/* Listing grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <div className="mb-3">
                {(() => {
                  const iconId = categories.find((c) => c.id === activeCategory)?.icon || '';
                  const Icon = getCategoryIcon(iconId);
                  return <Icon className="w-10 h-10 text-slate-300 mx-auto" />;
                })()}
              </div>
              <p className="text-slate-500 text-sm">
                {t('noListingsInCategory')}
              </p>
              <Link
                href="/deposer"
                className="inline-block mt-4 text-sm font-medium text-brand-600 hover:text-brand-500"
              >
                {t('beFirstToPublish')} &rarr;
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
