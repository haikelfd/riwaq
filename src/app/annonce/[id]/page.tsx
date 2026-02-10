import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getListingById } from '@/lib/queries/listings';
import { formatPrice, formatDate } from '@/lib/utils/format';
import { ENERGY_TYPE_LABELS } from '@/lib/constants/energy-types';
import { EnergyType } from '@/lib/types';
import ListingGallery from '@/components/listings/ListingGallery';
import ContactButtons from '@/components/listings/ContactButtons';
import SaveButtonLarge from '@/components/listings/SaveButtonLarge';
import Badge from '@/components/ui/Badge';
import { getCategoryIcon } from '@/components/ui/Icons';
import Link from 'next/link';

interface ListingPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) return { title: 'Annonce introuvable' };

  return {
    title: listing.title,
    description: `${listing.title} - ${formatPrice(listing.price)} - ${listing.location?.name || 'Tunisie'}. ${listing.description.slice(0, 150)}`,
    openGraph: {
      title: `${listing.title} | Riwaq`,
      description: listing.description.slice(0, 200),
      type: 'article',
    },
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  const sortedImages = [...(listing.images || [])].sort((a, b) => a.sort_order - b.sort_order);

  const hasTechInfo = listing.brand || listing.model || listing.year || listing.energy_type;
  const isSold = listing.status === 'sold';
  const wasUpdated = listing.updated_at !== listing.created_at &&
    new Date(listing.updated_at).getTime() - new Date(listing.created_at).getTime() > 60000;

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.title,
    description: listing.description,
    ...(listing.brand && { brand: { '@type': 'Brand', name: listing.brand } }),
    ...(listing.model && { model: listing.model }),
    offers: {
      '@type': 'Offer',
      price: listing.price || undefined,
      priceCurrency: 'TND',
      availability: isSold
        ? 'https://schema.org/SoldOut'
        : 'https://schema.org/InStock',
      itemCondition: listing.condition === 'neuf'
        ? 'https://schema.org/NewCondition'
        : 'https://schema.org/UsedCondition',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-900 transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/annonces" className="hover:text-slate-900 transition-colors">Annonces</Link>
          {listing.category && (
            <>
              <span>/</span>
              <Link
                href={`/categorie/${listing.category.slug}`}
                className="hover:text-slate-900 transition-colors"
              >
                {listing.category.name}
              </Link>
            </>
          )}
        </nav>

        {/* Sold banner */}
        {isSold && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm text-red-700 font-medium">
              Cette annonce a été marquée comme vendue.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Gallery */}
          <div className="lg:col-span-2">
            <ListingGallery images={sortedImages} title={listing.title} />

            {/* Details */}
            <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6">
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                {listing.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`text-2xl font-bold ${isSold ? 'text-slate-400 line-through' : 'text-brand-600'}`}>
                  {formatPrice(listing.price)}
                </span>
                <Badge variant={listing.condition === 'neuf' ? 'success' : 'default'}>
                  {listing.condition === 'neuf' ? 'Neuf' : 'Occasion'}
                </Badge>
                {isSold && (
                  <Badge variant="sold">Vendu</Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-6 pb-6 border-b border-slate-200">
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {listing.location?.name || 'Tunisie'}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Publié le {formatDate(listing.created_at)}
                </span>
                {wasUpdated && (
                  <span className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Modifié le {formatDate(listing.updated_at)}
                  </span>
                )}
                {listing.category && (
                  <span className="flex items-center gap-1.5">
                    {(() => {
                      const Icon = getCategoryIcon(listing.category.icon);
                      return <Icon className="w-4 h-4" />;
                    })()}
                    {listing.category.name}
                  </span>
                )}
              </div>

              {/* Fiche technique */}
              {hasTechInfo && (
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <h2 className="font-heading text-lg font-semibold text-slate-900 mb-3">
                    Fiche technique
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {listing.brand && (
                      <div className="bg-slate-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-slate-500">Marque</p>
                        <p className="text-sm font-medium text-slate-900">{listing.brand}</p>
                      </div>
                    )}
                    {listing.model && (
                      <div className="bg-slate-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-slate-500">Modèle</p>
                        <p className="text-sm font-medium text-slate-900">{listing.model}</p>
                      </div>
                    )}
                    {listing.year && (
                      <div className="bg-slate-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-slate-500">Année</p>
                        <p className="text-sm font-medium text-slate-900">{listing.year}</p>
                      </div>
                    )}
                    {listing.energy_type && (
                      <div className="bg-slate-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-slate-500">Énergie</p>
                        <p className="text-sm font-medium text-slate-900">
                          {ENERGY_TYPE_LABELS[listing.energy_type as EnergyType]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h2 className="font-heading text-lg font-semibold text-slate-900 mb-3">
                  Description
                </h2>
                <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {listing.description || 'Aucune description fournie.'}
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-4 bg-slate-50 rounded-lg px-4 py-3">
              <p className="text-xs text-slate-500">
                Riwaq est une plateforme d&apos;annonces. Les transactions sont sous la responsabilité des utilisateurs.
              </p>
            </div>
          </div>

          {/* Right: Contact sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:sticky lg:top-20 space-y-4">
              <h3 className="font-heading text-lg font-semibold text-slate-900">
                Contacter le vendeur
              </h3>
              {(listing.seller_name || listing.seller) && (
                <div className="text-sm text-slate-500">
                  Vendeur :{' '}
                  {listing.seller ? (
                    <Link
                      href={`/vendeur/${listing.seller.id}`}
                      className="text-brand-600 font-medium hover:text-brand-500 transition-colors"
                    >
                      {listing.seller.full_name}
                    </Link>
                  ) : (
                    <span className="text-slate-900 font-medium">{listing.seller_name}</span>
                  )}
                </div>
              )}
              {isSold ? (
                <div className="bg-slate-50 rounded-lg px-4 py-3 text-center">
                  <p className="text-sm text-slate-500">Cet article a été vendu.</p>
                </div>
              ) : (
                <ContactButtons phone={listing.phone} title={listing.title} />
              )}
              <SaveButtonLarge listingId={listing.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
