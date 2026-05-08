'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSavedListings } from '@/lib/contexts/SavedListingsContext';
import { fetchSavedListings } from '@/lib/actions/saved';
import { Listing } from '@/lib/types';
import ListingCard from '@/components/listings/ListingCard';
import { PackageIcon } from '@/components/ui/Icons';
import Button from '@/components/ui/Button';
import { Link } from '@/i18n/navigation';

export default function SavedListingsPage() {
  const { savedIds, clearAll, removeListing, count, hydrated } = useSavedListings();
  const t = useTranslations('savedListings');
  const tc = useTranslations('common');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated) return; // Wait for localStorage to load

    async function loadSaved() {
      if (savedIds.length === 0) {
        setListings([]);
        setLoading(false);
        return;
      }

      const data = await fetchSavedListings(savedIds);
      setListings(data);

      // Clean up stale IDs that no longer exist
      const returnedIds = new Set(data.map((l) => l.id));
      savedIds.forEach((id) => {
        if (!returnedIds.has(id)) {
          removeListing(id);
        }
      });

      setLoading(false);
    }

    loadSaved();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedIds.length, hydrated]);

  const available = listings.filter((l) => l.status === 'active');
  const unavailable = listings.filter((l) => l.status !== 'active');

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-slate-500">
        {tc('loading')}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">
            {t('title')}
          </h1>
          <p className="text-slate-500 mt-1">
            {count === 0
              ? t('empty')
              : `${count} annonce${count > 1 ? 's' : ''} sauvegardee${count > 1 ? 's' : ''}`}
          </p>
        </div>
        {count > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm('Supprimer toutes les annonces sauvegardees ?')) {
                clearAll();
              }
            }}
          >
            {tc('delete')}
          </Button>
        )}
      </div>

      {count === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-slate-300 mx-auto mb-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          <p className="text-slate-500 text-base mb-4">
            {t('empty')}
          </p>
          <Link href="/annonces">
            <Button variant="outline">{t('browseListings')}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Available */}
          {available.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
                Disponibles ({available.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {available.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </div>
          )}

          {/* Unavailable */}
          {unavailable.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
                Plus disponibles ({unavailable.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-75">
                {unavailable.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
