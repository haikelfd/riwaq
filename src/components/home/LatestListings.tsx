import Link from 'next/link';
import { Listing } from '@/lib/types';
import ListingGrid from '@/components/listings/ListingGrid';
import Button from '@/components/ui/Button';

interface LatestListingsProps {
  listings: Listing[];
}

export default function LatestListings({ listings }: LatestListingsProps) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-slate-900">
          Dernières annonces
        </h2>
        <Link href="/annonces">
          <Button variant="ghost" size="sm">
            Voir tout &rarr;
          </Button>
        </Link>
      </div>
      <ListingGrid listings={listings} emptyMessage="Aucune annonce pour le moment. Soyez le premier à publier !" />
    </section>
  );
}
