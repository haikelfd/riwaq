'use client';

import { useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Category, Location } from '@/lib/types';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { CUISINE_TYPE_OPTIONS } from '@/lib/constants/cuisine-types';

interface ListingFiltersProps {
  categories: Category[];
  locations: Location[];
}

export default function ListingFilters({ categories, locations }: ListingFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('filters');
  const tc = useTranslations('constants');

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(window.location.pathname);
  };

  const hasActiveFilters = searchParams.toString().length > 0;

  return (
    <div className="space-y-4">
      <Select
        label={t('category')}
        placeholder={t('allCategories')}
        value={searchParams.get('category') || ''}
        onChange={(e) => updateFilter('category', e.target.value)}
        options={categories.map((c) => ({ value: c.id, label: c.name }))}
      />

      <Select
        label={t('city')}
        placeholder={t('allCities')}
        value={searchParams.get('location') || ''}
        onChange={(e) => updateFilter('location', e.target.value)}
        options={locations.map((l) => ({ value: l.id, label: l.name }))}
      />

      <Select
        label={t('condition')}
        placeholder={t('allConditions')}
        value={searchParams.get('condition') || ''}
        onChange={(e) => updateFilter('condition', e.target.value)}
        options={[
          { value: 'neuf', label: tc('conditions.neuf') },
          { value: 'occasion', label: tc('conditions.occasion') },
        ]}
      />

      <Select
        label={t('cuisineType')}
        placeholder={t('allCuisines')}
        value={searchParams.get('cuisine_type') || ''}
        onChange={(e) => updateFilter('cuisine_type', e.target.value)}
        options={CUISINE_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
      />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('price')}</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder={t('priceMin')}
            value={searchParams.get('price_min') || ''}
            onChange={(e) => updateFilter('price_min', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
          <input
            type="number"
            placeholder={t('priceMax')}
            value={searchParams.get('price_max') || ''}
            onChange={(e) => updateFilter('price_max', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" fullWidth onClick={clearFilters}>
          {t('clearFilters')}
        </Button>
      )}
    </div>
  );
}
