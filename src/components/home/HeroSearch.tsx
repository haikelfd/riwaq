import SearchBar from '@/components/ui/SearchBar';
import Link from 'next/link';

export default function HeroSearch() {
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
              <span className="text-xs font-medium text-white/70">La plateforme pro en Tunisie</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center mb-4">
            <span className="block font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
              Trouvez le matériel
            </span>
            <span className="block font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">
                professionnel
              </span>
              <span className="text-white"> idéal</span>
            </span>
          </h1>

          <p className="text-center text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Restaurant, café, boulangerie — achetez et vendez du matériel d&apos;occasion entre professionnels à travers toute la Tunisie.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8" data-tour-id="tour-search">
            <SearchBar large placeholder="Machine à café, four, réfrigérateur..." />
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'Machines à café', href: '/categorie/cafe-coffee' },
              { label: 'Fours', href: '/categorie/cuisine-chaude' },
              { label: 'Réfrigération', href: '/categorie/froid-refrigeration' },
              { label: 'Mobilier', href: '/categorie/mobilier' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-full transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
