'use client';

import { useMemo, useRef, useEffect, useState, forwardRef } from 'react';
import { useTranslations } from 'next-intl';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import IconSelect from '@/components/ui/IconSelect';
import SpecFields from './SpecFields';
import { Category, Subcategory } from '@/lib/types';
import {
  getCategoryIcon,
  BoltIcon, FlameIcon, HandIcon, CircleHalfIcon,
} from '@/components/ui/Icons';
import { getSpecsForSubcategory } from '@/lib/constants/subcategory-specs';
import { CUISINE_TYPE_OPTIONS } from '@/lib/constants/cuisine-types';

interface StepProduitProps {
  data: {
    category_id: string;
    subcategory_id: string;
    brand: string;
    model: string;
    year: string;
    energy_type: string;
    cuisine_type: string;
    specs: Record<string, string>;
  };
  onChange: (field: string, value: string) => void;
  onSpecChange: (key: string, value: string) => void;
  categories: Category[];
  subcategories: Subcategory[];
  errors: Record<string, string>;
}

// Section wrapper with reveal animation
const FormSection = forwardRef<HTMLDivElement, {
  index: number;
  visible: boolean;
  title: string;
  subtitle?: string;
  optional?: boolean;
  optionalLabel?: string;
  children: React.ReactNode;
}>(({ index, visible, title, subtitle, optional, optionalLabel, children }, ref) => {
  if (!visible) return null;

  return (
    <div
      ref={ref}
      className="form-section-reveal relative ps-8 pb-8"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Left accent line */}
      <div className="absolute start-[11px] top-7 bottom-0 w-0.5 bg-slate-200 lg:bg-gradient-to-b lg:from-brand-300 lg:to-slate-200" />

      {/* Section number badge */}
      <div className="section-badge-pop absolute -start-0 top-0 w-6 h-6 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">
        {index}
      </div>

      {/* Section header */}
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900 font-heading">
          {title}
          {optional && (
            <span className="text-slate-400 font-normal text-sm ms-2">({optionalLabel})</span>
          )}
        </h3>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Section content with staggered field animations */}
      <div className="field-stagger space-y-5">
        {children}
      </div>
    </div>
  );
});
FormSection.displayName = 'FormSection';

// Define which optional fields are relevant per category
const CATEGORY_FIELDS: Record<string, { energy: boolean; cuisine: boolean }> = {
  'cafe-coffee':            { energy: true,  cuisine: true },
  'cuisine-chaude':         { energy: true,  cuisine: true },
  'froid-refrigeration':    { energy: true,  cuisine: false },
  'mobilier':               { energy: false, cuisine: false },
  'equipements-divers':     { energy: true,  cuisine: false },
  'patisserie-boulangerie': { energy: true,  cuisine: true },
};

export default function StepProduit({
  data, onChange, onSpecChange,
  categories, subcategories, errors,
}: StepProduitProps) {
  const t = useTranslations('stepProduct');
  const tc = useTranslations('constants');
  const [revealedSections, setRevealedSections] = useState(1);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const subcategoryRef = useRef<HTMLDivElement | null>(null);
  const prevCategoryRef = useRef(data.category_id);

  // Reveal fiche technique once category is selected
  const targetSections = useMemo(() => {
    if (!data.category_id) return 1;
    return 2;
  }, [data.category_id]);

  // Scroll to subcategory area when a category is first selected
  useEffect(() => {
    if (data.category_id && data.category_id !== prevCategoryRef.current) {
      prevCategoryRef.current = data.category_id;
      setTimeout(() => {
        const el = subcategoryRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.7) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
    }
  }, [data.category_id]);

  // Reveal new sections
  useEffect(() => {
    if (targetSections > revealedSections) {
      setRevealedSections(targetSections);
    }
  }, [targetSections, revealedSections]);

  // Memoized options
  const categoryOptions = useMemo(() =>
    categories.map((c) => ({
      value: c.id,
      label: c.name,
      icon: getCategoryIcon(c.icon),
    })),
    [categories]
  );

  const filteredSubcategories = useMemo(() =>
    data.category_id
      ? subcategories.filter((sc) => sc.category_id === data.category_id)
      : [],
    [data.category_id, subcategories]
  );

  const subcategoryOptions = useMemo(() =>
    filteredSubcategories.map((sc) => ({
      value: sc.id,
      label: sc.name,
      icon: getCategoryIcon(sc.icon),
    })),
    [filteredSubcategories]
  );

  const energyOptions = [
    { value: 'electrique', label: tc('energyTypes.electrique'), icon: BoltIcon },
    { value: 'gaz', label: tc('energyTypes.gaz'), icon: FlameIcon },
    { value: 'manuel', label: tc('energyTypes.manuel'), icon: HandIcon },
    { value: 'mixte', label: tc('energyTypes.mixte'), icon: CircleHalfIcon },
  ];

  const handleCategoryChange = (value: string) => {
    onChange('category_id', value);
    if (value !== data.category_id) {
      onChange('subcategory_id', '');
      // Clear fields that may not be relevant for the new category
      const newCat = categories.find((c) => c.id === value);
      const newFields = CATEGORY_FIELDS[newCat?.slug || ''] || { energy: true, cuisine: true };
      if (!newFields.energy) onChange('energy_type', '');
      if (!newFields.cuisine) onChange('cuisine_type', '');
    }
  };

  const selectedCategory = categories.find((c) => c.id === data.category_id);
  const categorySlug = selectedCategory?.slug || '';
  const fields = CATEGORY_FIELDS[categorySlug] || { energy: true, cuisine: true };

  const selectedSubcategory = subcategories.find((sc) => sc.id === data.subcategory_id);
  const specFields = getSpecsForSubcategory(selectedSubcategory?.slug);

  return (
    <div className="space-y-0">
      {/* Section 1: Category + Subcategory */}
      <FormSection
        index={1}
        visible={true}
        ref={(el) => { sectionRefs.current[0] = el; }}
        title={t('whatAreYouSelling')}
        subtitle={t('chooseCategory')}
      >
        <IconSelect
          options={categoryOptions}
          value={data.category_id}
          onChange={handleCategoryChange}
          columns={3}
          error={errors.category_id}
        />

        <div ref={subcategoryRef}>
          {filteredSubcategories.length > 0 && (
            <div className="animate-[fadeSlideIn_0.3s_ease-out]">
              <IconSelect
                label={t('productType')}
                options={subcategoryOptions}
                value={data.subcategory_id}
                onChange={(v) => onChange('subcategory_id', v)}
                columns={3}
              />
            </div>
          )}
        </div>
      </FormSection>

      {/* Section 2: Fiche technique */}
      <FormSection
        index={2}
        visible={revealedSections >= 2}
        ref={(el) => { sectionRefs.current[1] = el; }}
        title={t('techSheet')}
        optional
        optionalLabel={t('techSheet').toLowerCase() !== t('techSheet') ? 'optionnel' : 'optionnel'}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('brand')}
            placeholder={t('brandPlaceholder')}
            value={data.brand}
            onChange={(e) => onChange('brand', e.target.value)}
          />
          <Input
            label={t('model')}
            placeholder={t('modelPlaceholder')}
            value={data.model}
            onChange={(e) => onChange('model', e.target.value)}
          />
        </div>
        <Input
          label={t('year')}
          type="number"
          placeholder={t('yearPlaceholder')}
          value={data.year}
          onChange={(e) => onChange('year', e.target.value)}
        />
        {fields.energy && (
          <IconSelect
            label={t('energyType')}
            options={energyOptions}
            value={data.energy_type}
            onChange={(v) => onChange('energy_type', v)}
            columns={4}
          />
        )}
        {fields.cuisine && (
          <div>
            <Select
              label={t('cuisineType')}
              placeholder={t('cuisinePlaceholder')}
              value={data.cuisine_type}
              onChange={(e) => onChange('cuisine_type', e.target.value)}
              options={CUISINE_TYPE_OPTIONS.map((o) => ({ value: o.value, label: `${o.icon} ${tc(`cuisineTypes.${o.value}`)}` }))}
            />
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              {t('cuisineHelp')}
            </p>
          </div>
        )}

        {specFields.length > 0 && (
          <div className="pt-4 border-t border-slate-200 animate-[fadeSlideIn_0.3s_ease-out]">
            <SpecFields
              fields={specFields}
              values={data.specs}
              onChange={onSpecChange}
            />
          </div>
        )}
      </FormSection>
    </div>
  );
}
