'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/contexts/AuthContext';
import { adminUpdateListingStatus, checkIsAdmin, adminFetchListings } from '@/lib/actions/listings';
import { adminFetchReports, adminResolveReport } from '@/lib/actions/reports';
import { REPORT_REASON_LABELS } from '@/lib/constants/report-reasons';
import { Listing, ListingReport } from '@/lib/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatPrice, formatRelativeDate } from '@/lib/utils/format';

type Section = 'listings' | 'reports';

export default function AdminDashboard() {
  const router = useRouter();
  const tc = useTranslations('common');
  const { user, loading: authLoading, signOut } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [reports, setReports] = useState<ListingReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [section, setSection] = useState<Section>('listings');
  const [filter, setFilter] = useState<'active' | 'pending' | 'sold' | 'all'>('active');
  const [actionError, setActionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  // Wait for AuthContext, then verify admin via server action
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/admin/login');
      return;
    }

    async function init() {
      try {
        const admin = await checkIsAdmin();
        if (!admin) {
          router.push('/admin/login');
          return;
        }
        setIsAdmin(true);

        const [listingsData, reportsData] = await Promise.all([
          adminFetchListings(),
          adminFetchReports(),
        ]);
        setListings(listingsData);
        setReports(reportsData);
      } catch (err) {
        console.error('Admin init error:', err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [user, authLoading, router]);

  const handleAction = async (listingId: string, status: 'active' | 'deleted') => {
    if (!user) return;
    if (status === 'deleted' && !confirm('Supprimer cette annonce ?')) return;

    setActionError('');
    setSuccessMessage('');
    try {
      const result = await adminUpdateListingStatus(listingId, status);
      if (result.success) {
        const data = await adminFetchListings();
        setListings(data);
        setSuccessMessage(status === 'deleted' ? 'Annonce supprimée avec succès.' : 'Annonce approuvée avec succès.');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setActionError(result.error || 'Erreur lors de l\'action.');
      }
    } catch {
      setActionError('Erreur de connexion au serveur.');
    }
  };

  const handleReportAction = async (reportId: string, action: 'reviewed' | 'dismissed') => {
    if (!user) return;

    setActionError('');
    setSuccessMessage('');
    try {
      const result = await adminResolveReport(reportId, action);
      if (result.success) {
        const data = await adminFetchReports();
        setReports(data);
        setSuccessMessage(action === 'reviewed' ? 'Signalement examiné.' : 'Signalement ignoré.');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setActionError(result.error || 'Erreur lors de l\'action.');
      }
    } catch {
      setActionError('Erreur de connexion au serveur.');
    }
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/admin/login';
  };

  const filteredListings = listings.filter((l) => {
    if (filter === 'all') return true;
    return l.status === filter;
  });

  if (authLoading || (loading && !isAdmin)) {
    return <div className="max-w-6xl mx-auto px-4 py-16 text-center text-slate-500">{tc('loading')}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="font-heading text-xl sm:text-3xl font-bold text-slate-900">
          Administration
        </h1>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Déconnexion
        </Button>
      </div>

      {/* Error banner */}
      {actionError && (
        <div className="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError('')} className="text-red-400 hover:text-red-600 ms-2 cursor-pointer">&times;</button>
        </div>
      )}

      {/* Success banner */}
      {successMessage && (
        <div className="mb-4 bg-green-50 text-green-700 text-sm p-3 rounded-lg flex items-center justify-between">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage('')} className="text-green-400 hover:text-green-600 ms-2 cursor-pointer">&times;</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{listings.filter(l => l.status === 'active').length}</p>
          <p className="text-xs sm:text-sm text-slate-500">Actives</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{listings.filter(l => l.status === 'pending').length}</p>
          <p className="text-xs sm:text-sm text-slate-500">En attente</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-red-600">{listings.filter(l => l.status === 'sold').length}</p>
          <p className="text-xs sm:text-sm text-slate-500">Vendues</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{listings.length}</p>
          <p className="text-xs sm:text-sm text-slate-500">Total</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 text-center">
          <p className={`text-xl sm:text-2xl font-bold ${pendingReportsCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>{pendingReportsCount}</p>
          <p className="text-xs sm:text-sm text-slate-500">Signalements</p>
        </div>
      </div>

      {/* Section toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSection('listings')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            section === 'listings'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-900 hover:border-brand-500/30'
          }`}
        >
          Annonces
        </button>
        <button
          onClick={() => setSection('reports')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 ${
            section === 'reports'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-900 hover:border-brand-500/30'
          }`}
        >
          Signalements
          {pendingReportsCount > 0 && (
            <span className={`inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full ${
              section === 'reports' ? 'bg-white text-slate-900' : 'bg-amber-500 text-white'
            }`}>
              {pendingReportsCount}
            </span>
          )}
        </button>
      </div>

      {/* ===== LISTINGS SECTION ===== */}
      {section === 'listings' && (
        <>
          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {(['active', 'pending', 'sold', 'all'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
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
                    <th className="text-start px-4 py-3 font-medium text-slate-900">Titre</th>
                    <th className="text-start px-4 py-3 font-medium text-slate-900">Prix</th>
                    <th className="text-start px-4 py-3 font-medium text-slate-900">Ville</th>
                    <th className="text-start px-4 py-3 font-medium text-slate-900">Statut</th>
                    <th className="text-start px-4 py-3 font-medium text-slate-900">Date</th>
                    <th className="text-end px-4 py-3 font-medium text-slate-900">Actions</th>
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
                      <td className="px-4 py-3 text-end">
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
        </>
      )}

      {/* ===== REPORTS SECTION ===== */}
      {section === 'reports' && (
        <>
          {/* Mobile card list */}
          <div className="md:hidden space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 line-clamp-1">
                      {report.listing?.title || 'Annonce supprimée'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {REPORT_REASON_LABELS[report.reason]}
                    </p>
                  </div>
                  <Badge variant={report.status === 'pending' ? 'warning' : report.status === 'reviewed' ? 'success' : 'default'}>
                    {report.status === 'pending' ? 'en attente' : report.status === 'reviewed' ? 'examiné' : 'ignoré'}
                  </Badge>
                </div>
                {report.description && (
                  <p className="text-xs text-slate-500 mb-2 line-clamp-2">{report.description}</p>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 mb-3">
                  <span>{formatRelativeDate(report.created_at)}</span>
                  {report.reporter_phone && <span>{report.reporter_phone}</span>}
                </div>
                {report.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleReportAction(report.id, 'reviewed')}>
                      Examiner
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleReportAction(report.id, 'dismissed')}>
                      Ignorer
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {reports.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 px-4 py-8 text-center text-slate-500">
                Aucun signalement.
              </div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-start px-4 py-3 font-medium text-slate-900">Annonce</th>
                    <th className="text-start px-4 py-3 font-medium text-slate-900">Raison</th>
                    <th className="text-start px-4 py-3 font-medium text-slate-900">Description</th>
                    <th className="text-start px-4 py-3 font-medium text-slate-900">Statut</th>
                    <th className="text-start px-4 py-3 font-medium text-slate-900">Date</th>
                    <th className="text-end px-4 py-3 font-medium text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-t border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 max-w-[180px]">
                        {report.listing ? (
                          <a
                            href={`/annonce/${report.listing.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-600 hover:text-brand-500 truncate block"
                          >
                            {report.listing.title}
                          </a>
                        ) : (
                          <span className="text-slate-400">Supprimée</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-700 max-w-[180px] truncate">
                        {REPORT_REASON_LABELS[report.reason]}
                      </td>
                      <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate">
                        {report.description || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={report.status === 'pending' ? 'warning' : report.status === 'reviewed' ? 'success' : 'default'}>
                          {report.status === 'pending' ? 'en attente' : report.status === 'reviewed' ? 'examiné' : 'ignoré'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{formatRelativeDate(report.created_at)}</td>
                      <td className="px-4 py-3 text-end">
                        {report.status === 'pending' && (
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" onClick={() => handleReportAction(report.id, 'reviewed')}>
                              Examiner
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleReportAction(report.id, 'dismissed')}>
                              Ignorer
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {reports.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                        Aucun signalement.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
