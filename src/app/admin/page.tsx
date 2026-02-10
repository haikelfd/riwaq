'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { adminUpdateListingStatus } from '@/lib/actions/listings';
import { Listing } from '@/lib/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatPrice, formatRelativeDate } from '@/lib/utils/format';

export default function AdminDashboard() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'active' | 'pending' | 'sold' | 'all'>('active');

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/admin/login');
        return;
      }

      // Check if admin
      const { data: admin } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!admin) {
        router.push('/admin/login');
        return;
      }

      setAdminId(user.id);
      await loadListings(supabase);
    }

    checkAuth();
  }, [router]);

  async function loadListings(supabase?: ReturnType<typeof createClient>) {
    const client = supabase || createClient();
    const { data } = await client
      .from('listings')
      .select(`*, category:categories(*), location:locations(*)`)
      .neq('status', 'deleted')
      .order('created_at', { ascending: false })
      .limit(100);

    setListings((data as Listing[]) || []);
    setLoading(false);
  }

  const handleAction = async (listingId: string, status: 'active' | 'deleted') => {
    if (!adminId) return;
    if (status === 'deleted' && !confirm('Supprimer cette annonce ?')) return;

    const result = await adminUpdateListingStatus(listingId, status, adminId);
    if (result.success) {
      await loadListings();
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const filteredListings = listings.filter((l) => {
    if (filter === 'all') return true;
    return l.status === filter;
  });

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-16 text-center text-slate-500">Chargement...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl font-bold text-slate-900">
          Administration
        </h1>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Déconnexion
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{listings.filter(l => l.status === 'active').length}</p>
          <p className="text-sm text-slate-500">Actives</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{listings.filter(l => l.status === 'pending').length}</p>
          <p className="text-sm text-slate-500">En attente</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{listings.filter(l => l.status === 'sold').length}</p>
          <p className="text-sm text-slate-500">Vendues</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{listings.length}</p>
          <p className="text-sm text-slate-500">Total</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['active', 'pending', 'sold', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              filter === f
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-900 hover:border-brand-500/30'
            }`}
          >
            {f === 'active' ? 'Actives' : f === 'pending' ? 'En attente' : f === 'sold' ? 'Vendues' : 'Toutes'}
          </button>
        ))}
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {filteredListings.map((listing) => (
          <div key={listing.id} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-sm font-medium text-slate-900 line-clamp-2">{listing.title}</h3>
              <Badge variant={listing.status === 'active' ? 'success' : listing.status === 'sold' ? 'sold' : 'warning'}>
                {listing.status === 'sold' ? 'vendu' : listing.status}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mb-3">
              <span>{formatPrice(listing.price)}</span>
              <span>{listing.location?.name}</span>
              <span>{formatRelativeDate(listing.created_at)}</span>
            </div>
            <div className="flex gap-2">
              {listing.status === 'pending' && (
                <Button size="sm" onClick={() => handleAction(listing.id, 'active')}>
                  Approuver
                </Button>
              )}
              <Button variant="danger" size="sm" onClick={() => handleAction(listing.id, 'deleted')}>
                Supprimer
              </Button>
            </div>
          </div>
        ))}
        {filteredListings.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-8 text-center text-slate-500">
            Aucune annonce.
          </div>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-900">Titre</th>
                <th className="text-left px-4 py-3 font-medium text-slate-900">Prix</th>
                <th className="text-left px-4 py-3 font-medium text-slate-900">Ville</th>
                <th className="text-left px-4 py-3 font-medium text-slate-900">Statut</th>
                <th className="text-left px-4 py-3 font-medium text-slate-900">Date</th>
                <th className="text-right px-4 py-3 font-medium text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.map((listing) => (
                <tr key={listing.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3 max-w-[200px] truncate">{listing.title}</td>
                  <td className="px-4 py-3">{formatPrice(listing.price)}</td>
                  <td className="px-4 py-3">{listing.location?.name}</td>
                  <td className="px-4 py-3">
                    <Badge variant={listing.status === 'active' ? 'success' : 'warning'}>
                      {listing.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatRelativeDate(listing.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      {listing.status === 'pending' && (
                        <Button size="sm" onClick={() => handleAction(listing.id, 'active')}>
                          Approuver
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleAction(listing.id, 'deleted')}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredListings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Aucune annonce.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
