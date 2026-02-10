'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { updateListing, deleteListing, markListingAsSold, fetchListingByToken } from '@/lib/actions/listings';
import { Listing, Category, Location, EnergyType } from '@/lib/types';
import { DEMO_CATEGORIES, DEMO_LOCATIONS, DEMO_LISTINGS } from '@/lib/demo-data';
import { ENERGY_TYPE_OPTIONS } from '@/lib/constants/energy-types';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

function isDemoMode() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !url || url === 'your_supabase_url_here';
}

export default function ManagePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [togglingSold, setTogglingSold] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: '',
    category_id: '',
    location_id: '',
    phone: '',
    seller_name: '',
    brand: '',
    model: '',
    year: '',
    energy_type: '',
  });

  useEffect(() => {
    async function loadData() {
      let listingData: Listing | null = null;
      let cats: Category[] = [];
      let locs: Location[] = [];

      if (isDemoMode()) {
        // Check both static demo listings and dynamically created ones via server action
        listingData = DEMO_LISTINGS.find((l) => l.management_token === token) || null;

        if (!listingData) {
          listingData = await fetchListingByToken(token);
        }

        cats = DEMO_CATEGORIES;
        locs = DEMO_LOCATIONS;
      } else {
        const supabase = createClient();

        const { data } = await supabase
          .from('listings')
          .select(`*, category:categories(*), location:locations(*), images:listing_images(*)`)
          .eq('management_token', token)
          .neq('status', 'deleted')
          .single();

        listingData = data as Listing | null;

        const [{ data: catData }, { data: locData }] = await Promise.all([
          supabase.from('categories').select('*').order('sort_order'),
          supabase.from('locations').select('*').order('name'),
        ]);

        cats = (catData as Category[]) || [];
        locs = (locData as Location[]) || [];
      }

      if (!listingData) {
        setLoading(false);
        setError('Annonce introuvable ou lien invalide.');
        return;
      }

      setListing(listingData);
      setCategories(cats);
      setLocations(locs);

      setFormData({
        title: listingData.title,
        description: listingData.description || '',
        price: listingData.price?.toString() || '',
        condition: listingData.condition,
        category_id: listingData.category_id,
        location_id: listingData.location_id,
        phone: listingData.phone,
        seller_name: listingData.seller_name || '',
        brand: listingData.brand || '',
        model: listingData.model || '',
        year: listingData.year?.toString() || '',
        energy_type: listingData.energy_type || '',
      });

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

    const result = await updateListing(token, {
      title: formData.title,
      description: formData.description,
      price: formData.price ? Number(formData.price) : null,
      condition: formData.condition as 'neuf' | 'occasion',
      category_id: formData.category_id,
      location_id: formData.location_id,
      phone: formData.phone,
      seller_name: formData.seller_name || undefined,
      brand: formData.brand || undefined,
      model: formData.model || undefined,
      year: formData.year ? Number(formData.year) : undefined,
      energy_type: (formData.energy_type as EnergyType) || undefined,
    });

    if (result.success) {
      setMessage('Annonce mise à jour avec succès.');
    } else {
      setError(result.error || 'Erreur lors de la mise à jour.');
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;

    setDeleting(true);
    const result = await deleteListing(token);

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Erreur lors de la suppression.');
      setDeleting(false);
    }
  };

  const handleToggleSold = async () => {
    if (!listing) return;
    setTogglingSold(true);
    setMessage('');
    setError('');

    const isSold = listing.status === 'sold';
    const result = await markListingAsSold(token, !isSold);

    if (result.success) {
      setListing((prev) => prev ? { ...prev, status: isSold ? 'active' : 'sold' } : prev);
      setMessage(isSold ? 'Annonce remise en vente.' : 'Annonce marquée comme vendue.');
    } else {
      setError(result.error || 'Erreur lors du changement de statut.');
    }

    setTogglingSold(false);
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center text-slate-500">
        Chargement...
      </div>
    );
  }

  if (error && !listing) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button variant="outline" onClick={() => router.push('/')}>Retour à l&apos;accueil</Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold text-slate-900 mb-2">
        Gérer votre annonce
      </h1>
      <p className="text-slate-500 mb-8">
        Modifiez ou supprimez votre annonce ci-dessous.
      </p>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <Input
          label="Titre"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
        />

        <Select
          label="Catégorie"
          value={formData.category_id}
          onChange={(e) => handleChange('category_id', e.target.value)}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Prix (TND)"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="À discuter"
          />
          <Select
            label="État"
            value={formData.condition}
            onChange={(e) => handleChange('condition', e.target.value)}
            options={[
              { value: 'occasion', label: 'Occasion' },
              { value: 'neuf', label: 'Neuf' },
            ]}
          />
        </div>

        <Select
          label="Ville"
          value={formData.location_id}
          onChange={(e) => handleChange('location_id', e.target.value)}
          options={locations.map((l) => ({ value: l.id, label: l.name }))}
        />

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-900 mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            rows={5}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors duration-200 resize-vertical"
          />
        </div>

        {/* Technical info */}
        <div className="pt-4 border-t border-slate-200">
          <h3 className="text-sm font-medium text-slate-900 mb-3">
            Informations techniques <span className="text-slate-400 font-normal">(optionnel)</span>
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Marque"
                placeholder="Ex: La Cimbali, Santos..."
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
              />
              <Input
                label="Modèle"
                placeholder="Ex: M27, N°1..."
                value={formData.model}
                onChange={(e) => handleChange('model', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Année"
                type="number"
                placeholder="Ex: 2022"
                value={formData.year}
                onChange={(e) => handleChange('year', e.target.value)}
              />
              <Select
                label="Type d'énergie"
                value={formData.energy_type}
                onChange={(e) => handleChange('energy_type', e.target.value)}
                options={ENERGY_TYPE_OPTIONS}
                placeholder="Sélectionner..."
              />
            </div>
          </div>
        </div>

        <Input
          label="Téléphone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          required
        />

        <Input
          label="Nom (optionnel)"
          value={formData.seller_name}
          onChange={(e) => handleChange('seller_name', e.target.value)}
        />

        {message && (
          <div className="bg-brand-50 text-brand-600 text-sm p-3 rounded-lg">{message}</div>
        )}
        {error && listing && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg">{error}</div>
        )}

        {/* Sold toggle */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-900">
                {listing?.status === 'sold' ? 'Annonce vendue' : 'Marquer comme vendu'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {listing?.status === 'sold'
                  ? 'Votre annonce reste visible mais les acheteurs sont informés.'
                  : 'Indiquez que cet article a été vendu.'}
              </p>
            </div>
            <button
              onClick={handleToggleSold}
              disabled={togglingSold}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                listing?.status === 'sold' ? 'bg-red-500' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  listing?.status === 'sold' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t border-slate-200">
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Suppression...' : 'Supprimer'}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
