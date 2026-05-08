import Link from 'next/link';
import type { CuisineType } from '@/lib/types';

interface CuisineChipsProps {
  types: CuisineType[];
  labels: Record<CuisineType, string>;
}

export default function CuisineChips({ types, labels }: CuisineChipsProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-2">
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-2">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider shrink-0">
          Cuisines
        </span>
        {types.map((type) => (
          <Link
            key={type}
            href={`/annonces?cuisine_type=${type}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:border-brand-500/40 hover:text-brand-600 transition-colors shrink-0"
          >
            {labels[type] || type}
          </Link>
        ))}
      </div>
    </section>
  );
}
