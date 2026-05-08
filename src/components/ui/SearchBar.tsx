'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  large?: boolean;
}

export default function SearchBar({
  initialQuery = '',
  placeholder,
  large = false,
}: SearchBarProps) {
  const t = useTranslations('common');
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const resolvedPlaceholder = placeholder ?? t('searchPlaceholder');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    router.push(`/annonces?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative group">
        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`text-slate-400 group-focus-within:text-brand-500 transition-colors ${large ? 'w-5 h-5 ms-5' : 'w-4 h-4 ms-4'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={resolvedPlaceholder}
          className={`
            w-full bg-white border border-slate-200 rounded-2xl
            text-slate-900 placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
            transition-all duration-200 shadow-sm
            ${large ? 'ps-14 pe-14 sm:pe-36 py-4 sm:py-5 text-sm sm:text-base' : 'ps-11 pe-24 py-3 text-sm'}
          `}
        />
        <button
          type="submit"
          className={`
            absolute end-2 top-1/2 -translate-y-1/2
            bg-slate-900 text-white rounded-xl hover:bg-slate-800
            transition-all duration-200 cursor-pointer font-medium shadow-sm hover:shadow-md
            ${large ? 'px-3 sm:px-6 py-3 text-sm' : 'px-4 py-2 text-xs'}
          `}
        >
          {large && (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
          <span className={large ? 'hidden sm:inline' : ''}>{t('search')}</span>
        </button>
      </div>
    </form>
  );
}
