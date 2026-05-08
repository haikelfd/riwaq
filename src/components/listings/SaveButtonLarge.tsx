'use client';

import { useTranslations } from 'next-intl';
import { useSavedListings } from '@/lib/contexts/SavedListingsContext';

interface SaveButtonLargeProps {
  listingId: string;
}

export default function SaveButtonLarge({ listingId }: SaveButtonLargeProps) {
  const { isListingSaved, addListing, removeListing } = useSavedListings();
  const t = useTranslations('listing');
  const saved = isListingSaved(listingId);

  const handleClick = () => {
    if (saved) {
      removeListing(listingId);
    } else {
      addListing(listingId);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
        saved
          ? 'bg-brand-50 text-brand-600 border border-brand-200'
          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      {saved ? t('saved') : t('saveIt')}
    </button>
  );
}
