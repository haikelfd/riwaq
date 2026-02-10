import Link from 'next/link';
import { Category } from '@/lib/types';
import { getCategoryIcon } from '@/components/ui/Icons';

interface CategoryGridProps {
  categories: Category[];
}

const categoryStyles: Record<string, { gradient: string; ring: string; iconColor: string }> = {
  'cafe-coffee': { gradient: 'from-amber-50 to-orange-50', ring: 'group-hover:ring-amber-200', iconColor: 'text-amber-600' },
  'cuisine-chaude': { gradient: 'from-red-50 to-pink-50', ring: 'group-hover:ring-red-200', iconColor: 'text-red-500' },
  'froid-refrigeration': { gradient: 'from-cyan-50 to-blue-50', ring: 'group-hover:ring-cyan-200', iconColor: 'text-cyan-600' },
  'mobilier': { gradient: 'from-emerald-50 to-teal-50', ring: 'group-hover:ring-emerald-200', iconColor: 'text-emerald-600' },
  'equipements-divers': { gradient: 'from-violet-50 to-purple-50', ring: 'group-hover:ring-violet-200', iconColor: 'text-violet-500' },
  'patisserie-boulangerie': { gradient: 'from-pink-50 to-rose-50', ring: 'group-hover:ring-pink-200', iconColor: 'text-pink-500' },
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16" data-tour-id="tour-categories">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-900">
            Catégories
          </h2>
          <p className="text-slate-500 text-sm mt-1">Parcourez par type d&apos;équipement</p>
        </div>
        <Link
          href="/annonces"
          className="text-sm font-medium text-brand-600 hover:text-brand-500 transition-colors hidden sm:block"
        >
          Voir tout &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((category) => {
          const style = categoryStyles[category.slug] || { gradient: 'from-slate-50 to-slate-100', ring: 'group-hover:ring-slate-200', iconColor: 'text-slate-400' };
          const IconComponent = getCategoryIcon(category.icon);
          return (
            <Link
              key={category.id || category.slug}
              href={`/categorie/${category.slug}`}
              className={`group relative flex flex-col items-center gap-3 p-6 bg-gradient-to-br ${style.gradient} rounded-2xl ring-1 ring-transparent ${style.ring} hover:shadow-lg transition-all duration-300`}
            >
              <IconComponent className={`w-8 h-8 ${style.iconColor} group-hover:scale-110 transition-transform duration-300`} />
              <span className="text-sm font-medium text-slate-700 text-center leading-tight">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
