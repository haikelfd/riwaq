'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { updateProfile } from '@/lib/actions/auth';
import { Listing } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import ListingCard from '@/components/listings/ListingCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AccountPage() {
  const router = useRouter();
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
      const { data } = await supabase
        .from('listings')
        .select(`*, category:categories(*), location:locations(*), images:listing_images(*)`)
        .eq('user_id', user!.id)
        .neq('status', 'deleted')
        .order('created_at', { ascending: false });

      setListings((data as Listing[]) || []);
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
      setMessage('Profil mis à jour.');
      setEditing(false);
      router.refresh();
    }
    setSaving(false);
  };

  const handleStartTour = () => {
    // Dispatch custom event that TourContext listens for
    window.dispatchEvent(new CustomEvent('riwaq-start-tour'));
    router.push('/');
  };

  if (authLoading || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16 text-center text-slate-500">
        Chargement...
      </div>
    );
  }

  const phone = user.phone || profile?.phone || '';
  const displayPhone = phone.startsWith('+216')
    ? `+216 ${phone.slice(4, 6)} ${phone.slice(6, 9)} ${phone.slice(9)}`
    : phone;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">
        Mon compte
      </h1>

      {/* Profile card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-base sm:text-lg font-bold shrink-0">
              {profile?.full_name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              {editing ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Votre nom"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" onClick={handleSaveName} disabled={saving}>
                      {saving ? '...' : 'OK'}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="font-medium text-slate-900 truncate">
                  {profile?.full_name || 'Sans nom'}
                </p>
              )}
              <p className="text-sm text-slate-500 mt-0.5">{displayPhone}</p>
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
              Modifier
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
            Visite guidée
          </span>
        </Button>
      </div>

      {/* User's listings */}
      <div>
        <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900 mb-4">
          Mes annonces
          {!loadingListings && (
            <span className="text-slate-400 font-normal text-base ml-2">
              ({listings.length})
            </span>
          )}
        </h2>

        {loadingListings ? (
          <div className="text-center py-8 text-slate-500">Chargement...</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500 mb-4">Vous n&apos;avez pas encore d&apos;annonces.</p>
            <Button variant="outline" onClick={() => router.push('/deposer')}>
              Déposer une annonce
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="mt-12 pt-6 border-t border-slate-200">
        <Button variant="ghost" onClick={signOut}>
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}
