'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Seller, Listing } from '@/lib/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ListingGrid from '@/components/listings/ListingGrid';
import { isDemoMode, DEMO_SELLERS, DEMO_LISTINGS } from '@/lib/demo-data';

export default function ProfileManagePage() {
  const params = useParams();
  const token = params.token as string;

  const [seller, setSeller] = useState<Seller | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    async function loadData() {
      if (isDemoMode()) {
        const demoSeller = DEMO_SELLERS.find((s) => s.management_token === token);
        if (demoSeller) {
          setSeller(demoSeller);
          setFormData({
            full_name: demoSeller.full_name,
            phone: demoSeller.phone,
            email: demoSeller.email || '',
          });
          setListings(DEMO_LISTINGS.filter((l) => l.seller_id === demoSeller.id));
        } else {
          setError('Profil introuvable ou lien invalide.');
        }
        setLoading(false);
        return;
      }

      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { data: sellerData } = await supabase
        .from('sellers')
        .select('*')
        .eq('management_token', token)
        .single();

      if (!sellerData) {
        setError('Profil introuvable ou lien invalide.');
        setLoading(false);
        return;
      }

      setSeller(sellerData as Seller);
      setFormData({
        full_name: sellerData.full_name,
        phone: sellerData.phone,
        email: sellerData.email || '',
      });

      const { data: listingData } = await supabase
        .from('listings')
        .select(`*, category:categories(*), location:locations(*), images:listing_images(*)`)
        .eq('seller_id', sellerData.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      setListings((listingData as Listing[]) || []);
      setLoading(false);
    }

    loadData();
  }, [token]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setError('');

    const { updateSeller } = await import('@/lib/actions/sellers');
    const result = await updateSeller(token, {
      full_name: formData.full_name,
      phone: formData.phone,
      email: formData.email || undefined,
    });

    if (result.success) {
      setMessage('Profil mis à jour avec succès.');
    } else {
      setError(result.error || 'Erreur lors de la mise à jour.');
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center text-slate-500">
        Chargement...
      </div>
    );
  }

  if (error && !seller) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-red-500 mb-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold text-slate-900 mb-2">
        Mon profil vendeur
      </h1>
      <p className="text-slate-500 mb-8">
        Gérez vos informations et retrouvez vos annonces.
      </p>

      {/* Profile form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 mb-8">
        <Input
          label="Nom complet"
          value={formData.full_name}
          onChange={(e) => handleChange('full_name', e.target.value)}
          required
        />
        <Input
          label="Téléphone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          required
        />
        <Input
          label="Email (optionnel)"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />

        {message && (
          <div className="bg-brand-50 text-brand-600 text-sm p-3 rounded-lg">{message}</div>
        )}
        {error && seller && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg">{error}</div>
        )}

        <div className="flex justify-end pt-4 border-t border-slate-200">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </div>

      {seller && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-slate-900">
            Mes annonces ({listings.length})
          </h2>
          <a
            href={`/vendeur/${seller.id}`}
            className="text-sm text-brand-600 hover:text-brand-500 transition-colors"
          >
            Voir mon profil public
          </a>
        </div>
      )}

      <ListingGrid
        listings={listings}
        emptyMessage="Vous n'avez pas encore d'annonces."
      />
    </div>
  );
}
