import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import HeroSearch from '@/components/home/HeroSearch';
import HomeContent from '@/components/home/HomeContent';
import HowItWorks from '@/components/home/HowItWorks';
import { getCategories } from '@/lib/queries/categories';
import { getLatestListings, getActiveCuisineTypes } from '@/lib/queries/listings';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [categories, latestListings, activeCuisineTypes, t] = await Promise.all([
    getCategories(),
    getLatestListings(16),
    getActiveCuisineTypes(),
    getTranslations('home'),
  ]);

  return (
    <>
      <HeroSearch />

      {/* Why Riwaq — merged stats + value props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-10 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 border-b border-slate-100">
            {[
              { value: '6', label: t('statsCategories'), color: 'text-brand-600' },
              { value: '24', label: t('statsCities'), color: 'text-accent-600' },
              { value: '0 DT', label: t('statsFree'), color: 'text-amber-500' },
              { value: 'Direct', label: t('statsDirect'), color: 'text-emerald-600' },
            ].map((stat) => (
              <div key={stat.label} className="text-center py-4 sm:py-5">
                <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="p-6 sm:p-8 md:p-10">
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                {t('whyTitle')}
              </h2>
              <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                {t('whySubtitle')}
              </p>
            </div>

            {/* Value props grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              <div className="bg-slate-50 rounded-xl p-4 sm:p-5">
                <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="font-heading text-sm font-semibold text-slate-900 mb-1">{t('propSpecialized')}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{t('propSpecializedDesc')}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 sm:p-5">
                <div className="w-9 h-9 rounded-lg bg-accent-500/10 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-accent-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <h3 className="font-heading text-sm font-semibold text-slate-900 mb-1">{t('propDetailed')}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{t('propDetailedDesc')}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 sm:p-5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                </div>
                <h3 className="font-heading text-sm font-semibold text-slate-900 mb-1">{t('propFilters')}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{t('propFiltersDesc')}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 sm:p-5">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <h3 className="font-heading text-sm font-semibold text-slate-900 mb-1">{t('propFree')}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{t('propFreeDesc')}</p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-7">
              <Link
                href="/annonces"
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-500 transition-colors"
              >
                {t('discoverListings')}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HomeContent categories={categories} listings={latestListings} activeCuisineTypes={activeCuisineTypes} />

      <HowItWorks />
    </>
  );
}
