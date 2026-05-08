import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Listing } from '@/lib/types';
import { formatPrice, formatRelativeDate } from '@/lib/utils/format';
import Badge from '@/components/ui/Badge';
import { getCategoryIcon } from '@/components/ui/Icons';
import SaveButton from '@/components/listings/SaveButton';

interface ListingCardProps {
  listing: Listing;
  compact?: boolean;
}

export default function ListingCard({ listing, compact = false }: ListingCardProps) {
  const t = useTranslations('common');
  const tb = useTranslations('browse');

  const imageUrl = listing.images && listing.images.length > 0
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-images/${listing.images[0].storage_path}`
    : null;

  const isSold = listing.status === 'sold';

  return (
    <Link
      href={`/annonce/${listing.id}`}
      className={`block bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 overflow-hidden group ${
        compact ? 'rounded-xl' : 'rounded-2xl'
      }`}
    >
      {/* Image */}
      <div className={`${compact ? 'aspect-square' : 'aspect-[4/3]'} bg-slate-100 relative overflow-hidden`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            {(() => {
              const IconComponent = getCategoryIcon(listing.category?.icon || '');
              return (
                <div className="text-center">
                  <IconComponent className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                  <span className="text-xs text-slate-400">{listing.category?.name}</span>
                </div>
              );
            })()}
          </div>
        )}

        {/* Sold overlay */}
        {isSold && (
          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
            <Badge variant="sold" className="text-sm px-3 py-1">{t('sold')}</Badge>
          </div>
        )}

        <div className={`absolute ${compact ? 'top-2 start-2' : 'top-3 start-3'} flex flex-col gap-1.5`}>
          <Badge variant={listing.condition === 'neuf' ? 'success' : 'default'}>
            {listing.condition === 'neuf' ? t('new') : t('used')}
          </Badge>
          {!compact && listing.delivery_type === 'livraison_nationale' && (
            <Badge variant="gold">{tb('nationalDelivery')}</Badge>
          )}
        </div>
        <div className={`absolute ${compact ? 'top-2 end-2' : 'top-3 end-3'}`}>
          <SaveButton listingId={listing.id} />
        </div>
      </div>

      {/* Content */}
      <div className={compact ? 'p-3' : 'p-4'}>
        <h3 className={`font-medium text-slate-900 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors ${
          compact ? 'text-xs mb-1.5' : 'text-sm mb-2'
        }`}>
          {listing.title}
        </h3>
        <p className={`font-bold ${compact ? 'text-sm mb-2' : 'text-lg mb-3'} ${isSold ? 'text-slate-400 line-through' : 'text-brand-600'}`}>
          {formatPrice(listing.price)}
        </p>
        <div className={`flex items-center justify-between text-slate-500 ${compact ? 'text-[11px]' : 'text-xs'}`}>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-slate-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {listing.location?.name || 'Tunisie'}
          </span>
          <span>{formatRelativeDate(listing.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}
