'use client';

import { useMemo, useRef, useEffect, useState, forwardRef } from 'react';
import { useTranslations } from 'next-intl';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import IconSelect from '@/components/ui/IconSelect';
import ImageUploader from './ImageUploader';
import { Location } from '@/lib/types';
import {
  SparklesIcon, RecycleIcon,
  StoreIcon, TruckIcon, GlobeIcon,
} from '@/components/ui/Icons';

interface StepAnnonceProps {
  data: {
    title: string;
    price: string;
    condition: string;
    location_id: string;
    delivery_type: string;
    description: string;
  };
  images: File[];
  onImagesChange: (images: File[]) => void;
  onChange: (field: string, value: string) => void;
  locations: Location[];
  errors: Record<string, string>;
}

// Section wrapper with reveal animation
const FormSection = forwardRef<HTMLDivElement, {
  index: number;
  visible: boolean;
  title: string;
  subtitle?: string;
  optional?: boolean;
  children: React.ReactNode;
}>(({ index, visible, title, subtitle, optional, children }, ref) => {
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
            <span className="text-slate-400 font-normal text-sm ms-2">(optionnel)</span>
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

export default function StepAnnonce({
  data, images, onImagesChange, onChange,
  locations, errors,
}: StepAnnonceProps) {
  const t = useTranslations('stepListing');
  const [revealedSections, setRevealedSections] = useState(1);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Progressive reveal: 1.Title → 2.Photos → 3.Condition/Delivery → 4.Price/Location
  const targetSections = useMemo(() => {
    if (!data.title.trim()) return 1;
    if (!data.condition) return 3;   // reveal 2 (photos) + 3 (condition) together
    return 4;                         // reveal 4 (price/location)
  }, [data.title, data.condition]);

  // Reveal new sections and auto-scroll
  useEffect(() => {
    if (targetSections > revealedSections) {
      const prevRevealed = revealedSections;
      setRevealedSections(targetSections);
      if (prevRevealed === 1) return;
      const scrollToIndex = prevRevealed;
      setTimeout(() => {
        const el = sectionRefs.current[scrollToIndex];
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.6) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  }, [targetSections, revealedSections]);

  const conditionOptions = [
    { value: 'occasion', label: t('conditionUsed'), icon: RecycleIcon },
    { value: 'neuf', label: t('conditionNew'), icon: SparklesIcon },
  ];

  const deliveryOptions = [
    { value: 'sur_place', label: t('deliveryPickup'), icon: StoreIcon, description: t('deliveryPickupDesc') },
    { value: 'livraison', label: t('deliveryLocal'), icon: TruckIcon, description: t('deliveryLocalDesc') },
    { value: 'livraison_nationale', label: t('deliveryNational'), icon: GlobeIcon, description: t('deliveryNationalDesc') },
  ];

  return (
    <div className="space-y-0">
      {/* Section 1: Title */}
      <FormSection
        index={1}
        visible={true}
        ref={(el) => { sectionRefs.current[0] = el; }}
        title={t('yourListing')}
      >
        <Input
          label={t('titleLabel')}
          placeholder={t('titlePlaceholder')}
          value={data.title}
          onChange={(e) => onChange('title', e.target.value)}
          error={errors.title}
          required
        />
      </FormSection>

      {/* Section 2: Photos & Description */}
      <FormSection
        index={2}
        visible={revealedSections >= 2}
        ref={(el) => { sectionRefs.current[1] = el; }}
        title={t('photosAndDescription')}
      >
        <ImageUploader images={images} onImagesChange={onImagesChange} />

        {/* Photo tips callout */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl p-4 photo-tips-enter">
          <div className="flex gap-3.5">
            {/* Animated camera SVG */}
            <div className="shrink-0 w-12 h-12 rounded-lg bg-white/80 border border-amber-200/50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                <circle cx="12" cy="13" r="4">
                  <animate attributeName="r" values="4;4.5;4" dur="2s" repeatCount="indefinite" />
                </circle>
                {/* Shutter flash */}
                <circle cx="12" cy="13" r="4" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0">
                  <animate attributeName="r" values="4;8" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0" dur="3s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
            <div className="space-y-1.5 min-w-0">
              <p className="text-sm font-semibold text-amber-800">{t('photoTipsTitle')}</p>
              <ul className="space-y-1">
                <li className="flex items-start gap-2 text-xs text-amber-700 leading-relaxed">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{t.rich('photoTip1', { strong: (chunks) => <strong>{chunks}</strong> })}</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-amber-700 leading-relaxed">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{t.rich('photoTip2', { strong: (chunks) => <strong>{chunks}</strong> })}</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-amber-700 leading-relaxed">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{t.rich('photoTip3', { strong: (chunks) => <strong>{chunks}</strong> })}</span>
                </li>
              </ul>
            </div>
          </div>
          {/* Animated angle showcase */}
          <div className="flex justify-center gap-4 mt-3.5 pt-3 border-t border-amber-200/50">
            <div className="flex flex-col items-center gap-1 photo-angle-stagger">
              <div className="w-10 h-10 rounded-lg bg-white/70 border border-amber-200/60 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="12" cy="12" r="3" />
                  <line x1="12" y1="3" x2="12" y2="6" opacity="0.4" />
                </svg>
              </div>
              <span className="text-[10px] text-amber-600 font-medium">{t('anglesFront')}</span>
            </div>
            <div className="flex flex-col items-center gap-1 photo-angle-stagger" style={{ animationDelay: '150ms' }}>
              <div className="w-10 h-10 rounded-lg bg-white/70 border border-amber-200/60 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 3L3 21" opacity="0.2" />
                  <rect x="3" y="3" width="18" height="18" rx="2" transform="rotate(-15 12 12)" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <span className="text-[10px] text-amber-600 font-medium">{t('anglesSide')}</span>
            </div>
            <div className="flex flex-col items-center gap-1 photo-angle-stagger" style={{ animationDelay: '300ms' }}>
              <div className="w-10 h-10 rounded-lg bg-white/70 border border-amber-200/60 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="5" width="14" height="14" rx="2" />
                  <rect x="3" y="3" width="18" height="18" rx="2" opacity="0.3" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
              <span className="text-[10px] text-amber-600 font-medium">{t('anglesDetail')}</span>
            </div>
            <div className="flex flex-col items-center gap-1 photo-angle-stagger" style={{ animationDelay: '450ms' }}>
              <div className="w-10 h-10 rounded-lg bg-white/70 border border-amber-200/60 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <text x="12" y="14" textAnchor="middle" fontSize="6" fill="currentColor" stroke="none" fontWeight="bold">ID</text>
                </svg>
              </div>
              <span className="text-[10px] text-amber-600 font-medium">{t('anglesPlate')}</span>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-900 mb-1.5">
            {t('descriptionLabel')}
          </label>
          <textarea
            id="description"
            rows={5}
            placeholder={t('descriptionPlaceholder')}
            value={data.description}
            onChange={(e) => onChange('description', e.target.value)}
            className={`
              w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white
              text-slate-900 placeholder:text-slate-400
              focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
              transition-colors duration-200 resize-vertical
              ${errors.description ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500' : ''}
            `}
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>
      </FormSection>

      {/* Section 3: Condition & Delivery */}
      <FormSection
        index={3}
        visible={revealedSections >= 3}
        ref={(el) => { sectionRefs.current[2] = el; }}
        title={t('conditionAndDelivery')}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IconSelect
            label={t('conditionLabel')}
            options={conditionOptions}
            value={data.condition}
            onChange={(v) => onChange('condition', v)}
            columns={2}
            error={errors.condition}
            required
          />
          <IconSelect
            label={t('deliveryLabel')}
            options={deliveryOptions}
            value={data.delivery_type}
            onChange={(v) => onChange('delivery_type', v)}
            columns={3}
          />
        </div>
      </FormSection>

      {/* Section 4: Price & Location */}
      <FormSection
        index={4}
        visible={revealedSections >= 4}
        ref={(el) => { sectionRefs.current[3] = el; }}
        title={t('priceAndLocation')}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('priceLabel')}
            placeholder={t('pricePlaceholder')}
            type="number"
            min="0"
            value={data.price}
            onChange={(e) => onChange('price', e.target.value)}
            error={errors.price}
          />
          <Select
            label={t('cityLabel')}
            placeholder={t('cityPlaceholder')}
            value={data.location_id}
            onChange={(e) => onChange('location_id', e.target.value)}
            options={locations.map((l) => ({ value: l.id, label: l.name }))}
            error={errors.location_id}
            required
          />
        </div>
      </FormSection>
    </div>
  );
}
