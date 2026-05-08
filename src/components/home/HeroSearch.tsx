'use client';

import { useTranslations } from 'next-intl';
import SearchBar from '@/components/ui/SearchBar';
import { Link } from '@/i18n/navigation';

export default function HeroSearch() {
  const t = useTranslations('home');

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500/10 via-transparent to-accent-500/5" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="pt-20 pb-24 md:pt-28 md:pb-32">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-white/70">{t('heroBadge')}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center mb-4">
            <span className="block font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
              {t('heroTitle1')}
            </span>
            <span className="block font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">
                {t('heroTitle2')}
              </span>
              <span className="text-white"> {t('heroTitle3')}</span>
            </span>
          </h1>

          <p className="text-center text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8" data-tour-id="tour-search">
            <SearchBar large placeholder={t('heroSearchPlaceholder')} />
          </div>

          {/* Seller CTA — compact orange */}
          <div className="max-w-xl mx-auto">
            <Link href="/tarifs" className="block group">
              <div className="bg-brand-600 hover:bg-brand-500 rounded-xl px-5 py-4 transition-all duration-200">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white font-semibold">
                        {t('sellerCtaTitle')}
                      </p>
                      <p className="text-xs text-white/70 font-medium mt-0.5">
                        {t('sellerCtaSubtitle')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/80 group-hover:text-white shrink-0 transition-colors">
                    <span className="text-xs font-semibold">{t('sellerCtaLink')}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 start-0 end-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
