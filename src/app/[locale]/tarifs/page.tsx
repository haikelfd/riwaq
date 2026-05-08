import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

const tierIds = ['free', 'account', 'premium', 'store'] as const;

const tierColors = {
  free: {
    name: 'text-slate-600',
    price: 'text-slate-900',
    priceBadge: 'bg-slate-100 text-slate-600',
    check: 'text-slate-400',
    cta: 'bg-slate-800 hover:bg-slate-700 text-white shadow-sm hover:shadow-md',
    statBg: 'bg-slate-50',
    statValue: 'text-slate-900',
    border: 'border-slate-200 hover:border-slate-300',
    rightBg: '',
  },
  account: {
    name: 'text-emerald-600',
    price: 'text-emerald-700',
    priceBadge: 'bg-emerald-50 text-emerald-700',
    check: 'text-emerald-500',
    cta: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/15 hover:shadow-emerald-600/25',
    statBg: 'bg-emerald-50',
    statValue: 'text-emerald-600',
    border: 'border-emerald-200 hover:border-emerald-300',
    rightBg: 'sm:bg-emerald-50/50',
  },
  premium: {
    name: 'text-amber-600',
    price: 'text-amber-700',
    priceBadge: 'bg-amber-50 text-amber-700',
    check: 'text-amber-500',
    cta: 'bg-slate-100 text-slate-400 cursor-default',
    statBg: 'bg-amber-50',
    statValue: 'text-amber-600',
    border: 'border-amber-200 hover:border-amber-300',
    rightBg: 'sm:bg-amber-50/50',
  },
  store: {
    name: 'text-brand-600',
    price: 'text-brand-700',
    priceBadge: 'bg-brand-50 text-brand-700',
    check: 'text-brand-500',
    cta: 'bg-brand-100 text-brand-400 cursor-default',
    statBg: 'bg-brand-50',
    statValue: 'text-brand-600',
    border: 'border-brand-500',
    rightBg: 'sm:bg-brand-50/30',
  },
};

const tierPrices = {
  free: { price: '0', currency: 'TND' },
  account: { price: '0', currency: 'TND' },
  premium: null,
  store: null,
};

const tierMeta: Record<string, { highlighted: boolean; comingSoon: boolean; hasNote: boolean; hasStat: boolean; ctaHref?: string; statValue?: string }> = {
  free: { highlighted: false, comingSoon: false, hasNote: true, hasStat: false, ctaHref: '/deposer' },
  account: { highlighted: false, comingSoon: false, hasNote: false, hasStat: false, ctaHref: '/connexion' },
  premium: { highlighted: false, comingSoon: true, hasNote: false, hasStat: false },
  store: { highlighted: true, comingSoon: true, hasNote: false, hasStat: false },
};

export default async function TarifsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pricing');

  const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500/10 via-transparent to-accent-500/5" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute bottom-0 start-0 end-0 h-24 bg-gradient-to-t from-background to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-28 md:pt-28 md:pb-36 text-center">
          <div className="deposer-hero-badge inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            <span className="text-xs font-medium text-slate-300">{t('heroBadge')}</span>
          </div>

          <h1 className="deposer-hero-title font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t('heroTitle')}{' '}
            <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
              {t('heroTitleHighlight')}
            </span>
          </h1>

          <p className="deposer-hero-subtitle text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-14 relative z-10 pb-20">
        <div className="flex flex-col gap-5 pt-4">
          {tierIds.map((tierId, i) => {
            const color = tierColors[tierId];
            const meta = tierMeta[tierId];
            const priceInfo = tierPrices[tierId];
            const features: string[] = t.raw(`tiers.${tierId}.features`) as string[];

            return (
              <div
                key={tierId}
                className={`pricing-card-enter pricing-card-enter-${i + 1} relative rounded-2xl transition-all duration-300 hover:shadow-lg bg-white ${
                  meta.highlighted
                    ? `border-2 ${color.border} pricing-store-glow overflow-visible`
                    : `border ${color.border}`
                }`}
              >
                {meta.highlighted && (
                  <div className="pricing-badge-pop absolute -top-3.5 start-6 z-10">
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-[11px] font-bold px-3.5 py-1 rounded-full shadow-lg shadow-brand-500/25 whitespace-nowrap">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      {t('popular')}
                    </span>
                  </div>
                )}

                <div className={`flex flex-col sm:flex-row ${meta.highlighted ? 'pricing-store-shimmer rounded-2xl overflow-hidden' : ''}`}>
                  <div className="flex-1 p-6 sm:p-7">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className={`font-heading text-xl font-bold ${color.name}`}>
                        {t(`tiers.${tierId}.name`)}
                      </h3>
                      {priceInfo ? (
                        <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full ${color.priceBadge}`}>
                          <span className="font-bold text-base">{priceInfo.price}</span>
                          {priceInfo.currency}
                          <span className="mx-0.5 opacity-30">|</span>
                          <span className="font-medium text-xs opacity-75">{t(`tiers.${tierId}.priceNote`)}</span>
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${color.priceBadge}`}>
                          {t(`tiers.${tierId}.priceNote`)}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-500 leading-relaxed mb-5 max-w-lg">
                      {t(`tiers.${tierId}.description`)}
                    </p>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      {features.map((f: string) => (
                        <li key={f} className="flex items-start gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${color.check} shrink-0 mt-0.5`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          <span className="text-sm text-slate-700">{f}</span>
                        </li>
                      ))}
                    </ul>

                    {meta.hasNote && (
                      <div className="flex items-start gap-2 mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <span className="text-xs text-slate-400">{t(`tiers.${tierId}.note`)}</span>
                      </div>
                    )}
                  </div>

                  <div className={`sm:w-52 shrink-0 flex flex-col items-stretch justify-center gap-4 p-6 sm:p-7 border-t sm:border-t-0 sm:border-s border-slate-100 sm:rounded-e-2xl ${color.rightBg}`}>
                    {meta.hasStat && (
                      <div className={`text-center rounded-lg p-3 ${color.statBg}`}>
                        <span className={`font-heading text-3xl font-bold block ${color.statValue}`}>
                          {meta.statValue}
                        </span>
                        <span className="text-[11px] text-slate-500 leading-tight">{t(`tiers.${tierId}.stat`)}</span>
                      </div>
                    )}

                    {meta.comingSoon ? (
                      <span className={`block text-center px-5 py-3 rounded-xl text-sm font-medium ${color.cta}`}>
                        {t(`tiers.${tierId}.cta`)}
                      </span>
                    ) : (
                      <Link
                        href={meta.ctaHref!}
                        className={`block text-center px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${color.cta}`}
                      >
                        {t(`tiers.${tierId}.cta`)}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            FAQ
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-900">
            {t('faqTitle')}
          </h2>
        </div>
        <div className="space-y-3">
          {faqKeys.map((key, i) => (
            <details
              key={key}
              className="group bg-white rounded-xl border border-slate-200 hover:border-brand-200 transition-colors duration-200 overflow-hidden"
              {...(i === 0 ? { open: true } : {})}
            >
              <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                <span className="font-medium text-slate-900 group-open:text-brand-600 transition-colors duration-200">
                  {t(`faqs.${key}`)}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400 group-open:text-brand-500 shrink-0 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <div className="px-6 pb-5 -mt-1">
                <p className="text-sm text-slate-500 leading-relaxed">
                  {t(`faqs.a${key.slice(1)}`)}
                </p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 text-center">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-10 md:p-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-brand-500/10 via-transparent to-transparent" />
          <div className="relative">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
              {t('readyToSell')}
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
              {t('readyToSellSubtitle')}
            </p>
            <Link
              href="/deposer"
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-8 py-3.5 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30"
            >
              {t('postListing')}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
