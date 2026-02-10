import HeroSearch from '@/components/home/HeroSearch';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedListings from '@/components/home/FeaturedListings';
import HowItWorks from '@/components/home/HowItWorks';
import { getCategories } from '@/lib/queries/categories';
import { getLatestListings } from '@/lib/queries/listings';
import { FolderIcon, MapPinIcon, SparklesIcon, HandshakeIcon } from '@/components/ui/Icons';
import Link from 'next/link';

export default async function HomePage() {
  const [categories, latestListings] = await Promise.all([
    getCategories(),
    getLatestListings(8),
  ]);

  return (
    <>
      <HeroSearch />

      {/* Stats bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-10 mb-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { value: '6', label: 'Catégories', icon: FolderIcon, color: 'text-brand-600' },
            { value: '24', label: 'Villes couvertes', icon: MapPinIcon, color: 'text-accent-600' },
            { value: '100%', label: 'Gratuit', icon: SparklesIcon, color: 'text-amber-500' },
            { value: 'Direct', label: 'Vendeur → Acheteur', icon: HandshakeIcon, color: 'text-emerald-500' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className={`w-6 h-6 mx-auto mb-1 ${stat.color}`} />
              <div className="text-xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <CategoryGrid categories={categories} />
      <FeaturedListings listings={latestListings} categories={categories} />
      <HowItWorks />

      {/* Trust / SEO section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-10 md:p-14 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Pourquoi Riwaq ?
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            Riwaq est la première plateforme tunisienne dédiée au matériel professionnel de restaurant et café d&apos;occasion.
            Fini le chaos des groupes Facebook et le bruit des plateformes généralistes.
            Trouvez exactement ce que vous cherchez — à Tunis, Sfax, Sousse, Nabeul, ou partout en Tunisie.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { title: 'Spécialisé', desc: 'Uniquement du matériel pro de restauration. Pas de bruit.' },
              { title: 'Sans friction', desc: 'Pas de compte obligatoire, pas de commission, pas de complication.' },
              { title: 'Local', desc: 'Fait pour la Tunisie, avec les villes et habitudes locales.' },
            ].map((item) => (
              <div key={item.title} className="p-4">
                <h3 className="font-heading text-base font-semibold text-slate-900 mb-1.5">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/annonces"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-500 transition-colors"
            >
              Découvrir les annonces
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
