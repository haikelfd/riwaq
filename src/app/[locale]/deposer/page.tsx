import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import PostListingForm from '@/components/forms/PostListingForm';
import { getCategories, getLocations, getAllSubcategories } from '@/lib/queries/categories';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('postListing');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function PostListingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('postListing');

  const [categories, locations, subcategories] = await Promise.all([
    getCategories(),
    getLocations(),
    getAllSubcategories(),
  ]);

  return (
    <>
      {/* Zone A: Hero Banner */}
      <section className="relative overflow-hidden">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500/10 via-transparent to-accent-500/5" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 md:pt-20 md:pb-32">
          {/* Badge pill */}
          <div className="flex justify-center mb-5 deposer-hero-badge">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-white/70">{t('heroBadge')}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center mb-3 deposer-hero-title">
            <span className="block font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
              {t('heroTitle1')}
            </span>
            <span className="block font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">
                {t('heroTitle2')}
              </span>
            </span>
          </h1>

          <p className="text-center text-slate-400 text-sm md:text-base max-w-md mx-auto leading-relaxed deposer-hero-subtitle">
            {t('heroSubtitle')}
          </p>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 start-0 end-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Zone B: Form Area */}
      <section className="relative">
        {/* Background gradient blobs (desktop only) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="hidden lg:block absolute top-20 -start-40 w-80 h-80 bg-brand-500/5 rounded-full blur-3xl deposer-blob" />
          <div className="hidden lg:block absolute bottom-20 -end-40 w-80 h-80 bg-accent-500/5 rounded-full blur-3xl deposer-blob" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 -mt-10 pb-16 lg:pb-24">
          <PostListingForm categories={categories} subcategories={subcategories} locations={locations} />
        </div>
      </section>
    </>
  );
}
