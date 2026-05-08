import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getListingById } from '@/lib/queries/listings';
import { formatPrice, formatDate } from '@/lib/utils/format';
import { ENERGY_TYPE_LABELS } from '@/lib/constants/energy-types';
import { DELIVERY_TYPE_LABELS } from '@/lib/constants/delivery-types';
import { CUISINE_TYPE_LABELS } from '@/lib/constants/cuisine-types';
import { EnergyType, DeliveryType, CuisineType } from '@/lib/types';
import { getSpecsForSubcategory, getSpecDisplayValue } from '@/lib/constants/subcategory-specs';
import { incrementListingViews } from '@/lib/actions/listings';
import ListingGallery from '@/components/listings/ListingGallery';
import ContactButtons from '@/components/listings/ContactButtons';
import SaveButtonLarge from '@/components/listings/SaveButtonLarge';
import ReportButton from '@/components/listings/ReportButton';
import OwnerActions from '@/components/listings/OwnerActions';
import Badge from '@/components/ui/Badge';
import { getCategoryIcon } from '@/components/ui/Icons';
import { Link } from '@/i18n/navigation';

interface ListingPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslations('listing');
  const listing = await getListingById(id);
  if (!listing) return { title: t('notFound') };

  const firstImage = listing.images?.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)[0];
  const imageUrl = firstImage
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-images/${firstImage.storage_path}`
    : undefined;

  return {
    title: listing.title,
    description: `${listing.title} - ${formatPrice(listing.price)} - ${listing.location?.name || 'Tunisie'}. ${listing.description.slice(0, 150)}`,
    alternates: {
      canonical: `/annonce/${id}`,
    },
    openGraph: {
      title: `${listing.title} | Riwaq`,
      description: listing.description.slice(0, 200),
      type: 'article',
      ...(imageUrl && {
        images: [{ url: imageUrl, width: 800, height: 600, alt: listing.title }],
      }),
    },
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('listing');
  const tc = await getTranslations('common');

  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  // Track view (fire-and-forget, don't block rendering)
  incrementListingViews(listing.id).catch(() => {});

  const sortedImages = [...(listing.images || [])].sort((a, b) => a.sort_order - b.sort_order);

  const hasSpecs = listing.specs && Object.keys(listing.specs).length > 0;
  const specFields = getSpecsForSubcategory(listing.subcategory?.slug);
  const hasTechInfo = listing.brand || listing.model || listing.year || listing.energy_type || listing.delivery_type || listing.subcategory || hasSpecs;
  const isSold = listing.status === 'sold';
  const wasUpdated = listing.updated_at !== listing.created_at &&
    new Date(listing.updated_at).getTime() - new Date(listing.created_at).getTime() > 60000;

  // JSON-LD structured data
  const listingImages = sortedImages
    .map((img) => `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-images/${img.storage_path}`)
    .slice(0, 5);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.title,
    description: listing.description,
    ...(listingImages.length > 0 && { image: listingImages }),
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
      ...(listing.location && {
        availableAtOrFrom: {
          '@type': 'Place',
          name: listing.location.name,
          address: { '@type': 'PostalAddress', addressCountry: 'TN', addressRegion: listing.location.name },
        },
      }),
    },
    ...(listing.seller && {
      seller: { '@type': 'Person', name: listing.seller.full_name },
    }),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('breadcrumbHome'), item: process.env.NEXT_PUBLIC_SITE_URL || 'https://riwaq.tn' },
      { '@type': 'ListItem', position: 2, name: t('breadcrumbListings'), item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://riwaq.tn'}/annonces` },
      ...(listing.category ? [{
        '@type': 'ListItem', position: 3, name: listing.category.name,
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://riwaq.tn'}/categorie/${listing.category.slug}`,
      }] : []),
      { '@type': 'ListItem', position: listing.category ? 4 : 3, name: listing.title },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-900 transition-colors">{t('breadcrumbHome')}</Link>
          <span>/</span>
          <Link href="/annonces" className="hover:text-slate-900 transition-colors">{t('breadcrumbListings')}</Link>
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
              {t('soldBanner')}
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
                  {listing.condition === 'neuf' ? tc('new') : tc('used')}
                </Badge>
                {listing.delivery_type === 'livraison_nationale' && (
                  <Badge variant="gold">{t('deliveryNational')}</Badge>
                )}
                {listing.cuisine_type && (
                  <Badge variant="default">
                    {CUISINE_TYPE_LABELS[listing.cuisine_type as CuisineType]}
                  </Badge>
                )}
                {isSold && (
                  <Badge variant="sold">{tc('sold')}</Badge>
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
                  {t('publishedOn', { date: formatDate(listing.created_at) })}
                </span>
                {wasUpdated && (
                  <span className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {t('modifiedOn', { date: formatDate(listing.updated_at) })}
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
                    {t('techSheet')}
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {listing.subcategory && (
                      <div className="bg-slate-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-slate-500">{t('type')}</p>
                        <p className="text-sm font-medium text-slate-900">{listing.subcategory.name}</p>
                      </div>
                    )}
                    {listing.brand && (
                      <div className="bg-slate-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-slate-500">{t('brand')}</p>
                        <p className="text-sm font-medium text-slate-900">{listing.brand}</p>
                      </div>
                    )}
                    {listing.model && (
                      <div className="bg-slate-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-slate-500">{t('model')}</p>
                        <p className="text-sm font-medium text-slate-900">{listing.model}</p>
                      </div>
                    )}
                    {listing.year && (
                      <div className="bg-slate-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-slate-500">{t('year')}</p>
                        <p className="text-sm font-medium text-slate-900">{listing.year}</p>
                      </div>
                    )}
                    {listing.energy_type && (
                      <div className="bg-slate-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-slate-500">{t('energy')}</p>
                        <p className="text-sm font-medium text-slate-900">
                          {ENERGY_TYPE_LABELS[listing.energy_type as EnergyType]}
                        </p>
                      </div>
                    )}
                    {listing.delivery_type && (
                      <div className={`rounded-lg px-3 py-2 ${listing.delivery_type === 'livraison_nationale' ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50'}`}>
                        <p className="text-xs text-slate-500">{t('deliveryMode')}</p>
                        <p className={`text-sm font-medium ${listing.delivery_type === 'livraison_nationale' ? 'text-amber-700' : 'text-slate-900'}`}>
                          {DELIVERY_TYPE_LABELS[listing.delivery_type as DeliveryType]}
                        </p>
                      </div>
                    )}
                    {hasSpecs && specFields.map((field) => {
                      const value = listing.specs?.[field.key];
                      if (value === undefined || value === null || value === '') return null;
                      return (
                        <div key={field.key} className="bg-slate-50 rounded-lg px-3 py-2">
                          <p className="text-xs text-slate-500">{field.label}</p>
                          <p className="text-sm font-medium text-slate-900">
                            {getSpecDisplayValue(field, value)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h2 className="font-heading text-lg font-semibold text-slate-900 mb-3">
                  {t('description')}
                </h2>
                <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {listing.description || t('noDescription')}
                </div>
              </div>
            </div>

            {/* Safety tips */}
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
              <div className="flex items-center gap-2 mb-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <h3 className="text-sm font-semibold text-amber-800">{t('safetyTitle')}</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-700 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="shrink-0 mt-0.5">&bull;</span>
                  {t('safetyTip1')}
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="shrink-0 mt-0.5">&bull;</span>
                  {t('safetyTip2')}
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="shrink-0 mt-0.5">&bull;</span>
                  {t('safetyTip3')}
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="shrink-0 mt-0.5">&bull;</span>
                  {t('safetyTip4')}
                </li>
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="mt-3 px-4 py-2">
              <p className="text-[11px] text-slate-400">
                {t('disclaimer')}
              </p>
            </div>
          </div>

          {/* Right: Contact sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:sticky lg:top-20 space-y-4">
              <h3 className="font-heading text-lg font-semibold text-slate-900">
                {t('contactSeller')}
              </h3>
              {(listing.seller_name || listing.seller) && (
                <div className="text-sm text-slate-500">
                  {t('seller')} :{' '}
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
                  <p className="text-sm text-slate-500">{t('soldItem')}</p>
                </div>
              ) : (
                <ContactButtons phone={listing.phone} title={listing.title} />
              )}
              <SaveButtonLarge listingId={listing.id} />
              {!isSold && <ReportButton listingId={listing.id} />}
              <OwnerActions listingId={listing.id} listingUserId={listing.user_id || null} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
