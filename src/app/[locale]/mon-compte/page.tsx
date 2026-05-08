'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/contexts/AuthContext';
import { updateProfile } from '@/lib/actions/auth';
import { deleteUserListing } from '@/lib/actions/listings';
import { Listing } from '@/lib/types';
import { TIER_LIMITS, TIER_LABELS, type UserTier } from '@/lib/constants/tiers';
import { createClient } from '@/lib/supabase/client';
import ListingCard from '@/components/listings/ListingCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AccountPage() {
  const router = useRouter();
  const t = useTranslations('account');
  const tc = useTranslations('common');
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/connexion?redirect=/mon-compte');
    }
  }, [user, authLoading, router]);

  // Load user's listings
  useEffect(() => {
    if (!user) return;

    async function loadListings() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id, title, description, price, condition, category_id, location_id,
          phone, seller_name, seller_id, brand, model, year, energy_type, delivery_type,
          cuisine_type, subcategory_id, specs, view_count, status, created_at, expires_at, updated_at, user_id,
          category:categories(*), location:locations(*), subcategory:subcategories(*), images:listing_images(*)
        `)
        .eq('user_id', user!.id)
        .neq('status', 'deleted')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading user listings:', error.message);
      }
      setListings((data as unknown as Listing[]) || []);
      setLoadingListings(false);
    }

    loadListings();
  }, [user]);

  // Init name input when profile loads
  useEffect(() => {
    if (profile?.full_name) {
      setNameInput(profile.full_name);
    }
  }, [profile]);

  const handleSaveName = async () => {
    if (!user) return;
    setSaving(true);
    setMessage('');

    const result = await updateProfile(user.id, { full_name: nameInput });
    if (result.success) {
      setMessage(t('profileUpdated'));
      setEditing(false);
      router.refresh();
    }
    setSaving(false);
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!user) return;
    if (!confirm(t('deleteConfirm'))) return;

    const result = await deleteUserListing(listingId, user.id);
    if (result.success) {
      setListings((prev) => prev.filter((l) => l.id !== listingId));
    }
  };

  const userTier: UserTier = profile?.tier || 'compte';
  const tierConfig = TIER_LIMITS[userTier];
  const tierLabel = TIER_LABELS[userTier];
  const activeListingsCount = listings.filter((l) => l.status === 'active' || l.status === 'sold').length;
  const canPostMore = activeListingsCount < tierConfig.maxListings;

  const handleStartTour = () => {
    // Dispatch custom event that TourContext listens for
    window.dispatchEvent(new CustomEvent('riwaq-start-tour'));
    router.push('/');
  };

  if (authLoading || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16 text-center text-slate-500">
        {tc('loading')}
      </div>
    );
  }

  const phone = user.phone || profile?.phone || '';
  const email = user.email || profile?.email || '';
  const isGoogleUser = !phone && !!email;
  const displayPhone = phone.startsWith('+216')
    ? `+216 ${phone.slice(4, 6)} ${phone.slice(6, 9)} ${phone.slice(9)}`
    : phone;
  const displayIdentity = isGoogleUser ? email : displayPhone;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">
        {t('title')}
      </h1>

      {/* Profile card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-base sm:text-lg font-bold shrink-0">
                {profile?.full_name?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
            <div className="min-w-0">
              {editing ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder={t('namePlaceholder')}
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" onClick={handleSaveName} disabled={saving}>
                      {saving ? '...' : t('saveName')}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                      {t('cancelEdit')}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="font-medium text-slate-900 truncate">
                  {profile?.full_name || t('noName')}
                </p>
              )}
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-sm text-slate-500">{displayIdentity}</p>
                <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  userTier === 'store' ? 'bg-brand-100 text-brand-700' :
                  userTier === 'premium' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {tierLabel}
                </span>
              </div>
            </div>
          </div>
          {!editing && (
            <button
              onClick={() => {
                setNameInput(profile?.full_name || '');
                setEditing(true);
              }}
              className="text-sm text-brand-600 hover:text-brand-500 font-medium cursor-pointer shrink-0"
            >
              {t('editName')}
            </button>
          )}
        </div>
        {message && (
          <div className="mt-4 bg-brand-50 text-brand-600 text-sm p-3 rounded-lg">
            {message}
          </div>
        )}
      </div>

      {/* Tour button */}
      <div className="mb-6 sm:mb-8">
        <Button variant="outline" size="sm" onClick={handleStartTour}>
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
            {t('guidedTour')}
          </span>
        </Button>
      </div>

      {/* User's listings */}
      <div>
        <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900 mb-4">
          {t('myListings')}
          {!loadingListings && (
            <span className="text-slate-400 font-normal text-base ms-2">
              ({listings.length})
            </span>
          )}
        </h2>

        {loadingListings ? (
          <div className="text-center py-8 text-slate-500">{tc('loading')}</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500 mb-4">{t('noListings')}</p>
            <Button variant="outline" onClick={() => router.push('/deposer')}>
              {t('postListing')}
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <div key={listing.id} className="relative group">
                  <ListingCard listing={listing} />
                  {/* View count badge */}
                  <div className="absolute bottom-2 start-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-md px-2 py-0.5 text-xs text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {listing.view_count || 0}
                  </div>
                  <button
                    onClick={() => handleDeleteListing(listing.id)}
                    className="absolute top-2 end-2 w-8 h-8 bg-white/90 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title={tc('delete')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400 hover:text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              {canPostMore ? (
                <Button variant="outline" size="sm" onClick={() => router.push('/deposer')}>
                  {t('postListing')}
                </Button>
              ) : (
                <p className="text-sm text-slate-400">
                  {t('limitReached', { max: tierConfig.maxListings === Infinity ? t('unlimited') : tierConfig.maxListings })}
                </p>
              )}
              <p className="text-xs text-slate-400">
                {t('listingCount', { count: activeListingsCount, max: tierConfig.maxListings === Infinity ? '\u221E' : tierConfig.maxListings })}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Logout */}
      <div className="mt-12 pt-6 border-t border-slate-200">
        <Button variant="ghost" onClick={signOut}>
          {t('logout')}
        </Button>
      </div>
    </div>
  );
}
