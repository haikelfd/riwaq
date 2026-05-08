'use client';

import { useMemo, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Category, Listing, CuisineType } from '@/lib/types';
import { CUISINE_TYPE_LABELS, CUISINE_TYPE_ICONS } from '@/lib/constants/cuisine-types';
import PersonaSelector from './PersonaSelector';
import ListingCard from '@/components/listings/ListingCard';

interface ExplorerSectionProps {
  activePersona: string;
  onSelect: (key: string) => void;
  listings: Listing[];
  categories: Category[];
  filterCategoryIds: string[] | null;
  personaLabel?: string;
  activeCuisineTypes?: CuisineType[];
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function ExplorerSection({
  activePersona,
  onSelect,
  listings,
  filterCategoryIds,
  personaLabel,
  activeCuisineTypes,
}: ExplorerSectionProps) {
  const t = useTranslations('home');
  const isExpanded = activePersona !== 'all';

  const ITEMS_PER_PAGE = 4;
  const [activeCuisineFilter, setActiveCuisineFilter] = useState<CuisineType | null>(null);

  const curatedListings = useMemo(() => {
    if (!filterCategoryIds || filterCategoryIds.length === 0) return [];
    let filtered = listings.filter((l) =>
      filterCategoryIds.includes(l.category_id)
    );
    if (activeCuisineFilter) {
      filtered = filtered.filter((l) => l.cuisine_type === activeCuisineFilter);
    }
    const seed = Math.floor(Date.now() / 3600000);
    return seededShuffle(filtered, seed);
  }, [listings, filterCategoryIds, activeCuisineFilter]);

  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(curatedListings.length / ITEMS_PER_PAGE);
  const pagedListings = curatedListings.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  // Reset page when persona or cuisine filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [filterCategoryIds, activeCuisineFilter]);

  // Reset cuisine filter when persona changes
  useEffect(() => {
    setActiveCuisineFilter(null);
  }, [activePersona]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div
        className="relative overflow-hidden rounded-3xl border border-slate-700/30 transition-all duration-600"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #334155 100%)',
          boxShadow: isExpanded
            ? '0 10px 40px rgba(15, 23, 42, 0.4), 0 4px 12px rgba(15, 23, 42, 0.25)'
            : '0 2px 8px rgba(15, 23, 42, 0.2)',
        }}
      >
        {/* Water ripple effect origin */}
        <div
          className={`pointer-events-none absolute rounded-full transition-all duration-700 ease-out
            ${isExpanded
              ? 'w-[200%] h-[200%] opacity-100'
              : 'w-0 h-0 opacity-0'
            }
          `}
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 40%, transparent 70%)',
          }}
        />

        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative px-5 sm:px-8">
          {/* PersonaSelector — always visible */}
          <PersonaSelector
            activePersona={activePersona}
            onSelect={onSelect}
          />

          {/* Cuisine type chips — only when "Restaurant" persona is active */}
          {activePersona === 'restaurant' && activeCuisineTypes && activeCuisineTypes.length > 0 && (
            <div className="pb-4 -mt-2">
              <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide py-1">
                <span className="text-[11px] font-semibold text-white/40 uppercase tracking-widest shrink-0">
                  {t('cuisines')}
                </span>
                {activeCuisineTypes.map((type) => {
                  const isActive = activeCuisineFilter === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setActiveCuisineFilter(isActive ? null : type)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-white text-slate-900 border-white shadow-sm'
                          : 'bg-white/10 border-white/15 text-white/80 hover:bg-white/20 hover:text-white hover:border-white/30'
                      }`}
                    >
                      <span className="text-sm">{CUISINE_TYPE_ICONS[type]}</span>
                      {CUISINE_TYPE_LABELS[type] || type}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Expandable curated listings panel */}
          <div
            className="explorer-panel"
            data-expanded={isExpanded}
          >
            <div>
              {curatedListings.length > 0 && (
                <div className="pb-8">
                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/25 to-transparent mb-6" />

                  <div className="text-center mb-5">
                    <h3 className="text-lg md:text-xl font-extrabold text-white tracking-tight">
                      {t('selectionForYour', { persona: personaLabel || '' })}
                    </h3>
                    <p className="text-sm font-medium text-white/70 mt-0.5">
                      {t('curatedForYou')}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {pagedListings.map((listing, i) => (
                      <div
                        key={listing.id}
                        className="explorer-card-enter"
                        style={{ animationDelay: `${i * 70}ms` }}
                      >
                        <ListingCard listing={listing} compact />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-6">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/15 border border-white/20 text-white transition-all duration-200 hover:bg-white/25 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalPages }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                              i === currentPage
                                ? 'bg-white scale-110'
                                : 'bg-white/30 hover:bg-white/50'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={currentPage === totalPages - 1}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/15 border border-white/20 text-white transition-all duration-200 hover:bg-white/25 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {isExpanded && curatedListings.length === 0 && (
                <div className="pb-8 text-center py-12">
                  <p className="text-white/60 text-sm">
                    {t('noListingsYet')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
