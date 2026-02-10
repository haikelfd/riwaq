import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSellerById, getListingsBySellerId } from '@/lib/queries/sellers';
import { formatDate } from '@/lib/utils/format';
import ListingGrid from '@/components/listings/ListingGrid';

interface SellerPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: SellerPageProps): Promise<Metadata> {
  const { id } = await params;
  const seller = await getSellerById(id);
  if (!seller) return { title: 'Vendeur introuvable' };

  return {
    title: `${seller.full_name} — Vendeur sur Riwaq`,
    description: `Découvrez les annonces de ${seller.full_name} sur Riwaq, la plateforme tunisienne de matériel professionnel de restaurant.`,
  };
}

export default async function SellerPage({ params }: SellerPageProps) {
  const { id } = await params;
  const [seller, listings] = await Promise.all([
    getSellerById(id),
    getListingsBySellerId(id),
  ]);

  if (!seller) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Seller header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-brand-50 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-brand-600">
              {seller.full_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-900">
              {seller.full_name}
            </h1>
            <p className="text-sm text-slate-500">
              Membre depuis {formatDate(seller.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="mb-4">
        <h2 className="font-heading text-lg font-semibold text-slate-900">
          Annonces ({listings.length})
        </h2>
      </div>

      <ListingGrid
        listings={listings}
        emptyMessage="Ce vendeur n'a pas encore d'annonces actives."
      />
    </div>
  );
}
