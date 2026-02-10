'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Listing, Category } from '@/lib/types';
import ListingCard from '@/components/listings/ListingCard';
import { getCategoryIcon, PackageIcon } from '@/components/ui/Icons';

interface FeaturedListingsProps {
  listings: Listing[];
  categories: Category[];
}

export default function FeaturedListings({ listings, categories }: FeaturedListingsProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? listings.filter((l) => l.category_id === activeCategory)
    : listings;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-900">
            Annonces récentes
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Découvrez les derniers équipements mis en vente
          </p>
        </div>
        <Link
          href="/annonces"
          className="text-sm font-medium text-brand-600 hover:text-brand-500 transition-colors"
        >
          Voir toutes les annonces &rarr;
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
          Tout
        </button>
        {categories.map((cat) => (
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
              return <Icon className="w-4 h-4 mr-1.5 inline-block" />;
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
            Aucune annonce dans cette catégorie pour le moment.
          </p>
          <Link
            href="/deposer"
            className="inline-block mt-4 text-sm font-medium text-brand-600 hover:text-brand-500"
          >
            Soyez le premier à publier &rarr;
          </Link>
        </div>
      )}
    </section>
  );
}
