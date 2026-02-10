import { Listing } from '@/lib/types';
import ListingCard from './ListingCard';
import { PackageIcon } from '@/components/ui/Icons';

interface ListingGridProps {
  listings: Listing[];
  emptyMessage?: string;
}

export default function ListingGrid({ listings, emptyMessage = 'Aucune annonce trouvée.' }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
        <PackageIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 text-base">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
