'use client';

import { useSavedListings } from '@/lib/contexts/SavedListingsContext';

interface SaveButtonProps {
  listingId: string;
}

export default function SaveButton({ listingId }: SaveButtonProps) {
  const { isListingSaved, addListing, removeListing } = useSavedListings();
  const saved = isListingSaved(listingId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saved) {
      removeListing(listingId);
    } else {
      addListing(listingId);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
        saved
          ? 'bg-brand-50 shadow-sm'
          : 'bg-white/90 shadow-sm hover:bg-white'
      }`}
      aria-label={saved ? 'Retirer des sauvegardées' : 'Sauvegarder'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-4 h-4 transition-colors ${
          saved ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'
        }`}
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
    </button>
  );
}
