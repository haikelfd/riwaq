'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { updateListing, deleteListing, markListingAsSold, fetchListingByToken, republishListing } from '@/lib/actions/listings';
import { Listing, Category, Location, Subcategory, EnergyType, DeliveryType } from '@/lib/types';
import { ENERGY_TYPE_OPTIONS } from '@/lib/constants/energy-types';
import { DELIVERY_TYPE_OPTIONS } from '@/lib/constants/delivery-types';
import { getSpecsForSubcategory } from '@/lib/constants/subcategory-specs';
import SpecFields from '@/components/forms/SpecFields';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

export default function ManagePage() {
  const params = useParams();
  const router = useRouter();
  const tc = useTranslations('common');
  const token = params.token as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [togglingSold, setTogglingSold] = useState(false);
  const [republishing, setRepublishing] = useState(false);
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
    delivery_type: '',
    subcategory_id: '',
  });
  const [specs, setSpecs] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();

      const [listingData, { data: catData }, { data: locData }, { data: subData }] = await Promise.all([
        fetchListingByToken(token),
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('locations').select('*').order('name'),
        supabase.from('subcategories').select('*').order('sort_order'),
      ]);

      const cats = (catData as Category[]) || [];
      const locs = (locData as Location[]) || [];
      const subs = (subData as Subcategory[]) || [];

      if (!listingData) {
        setLoading(false);
        setError('Annonce introuvable ou lien invalide.');
        return;
      }

      setListing(listingData);
      setCategories(cats);
      setSubcategories(subs);
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
        delivery_type: listingData.delivery_type || '',
        subcategory_id: listingData.subcategory_id || '',
      });

      // Populate specs from listing, converting values to strings
      if (listingData.specs && typeof listingData.specs === 'object') {
        const stringSpecs: Record<string, string> = {};
        for (const [k, v] of Object.entries(listingData.specs)) {
          stringSpecs[k] = String(v);
        }
        setSpecs(stringSpecs);
      }

      setLoading(false);
    }

    loadData();
  }, [token]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'subcategory_id' || field === 'category_id') {
      setSpecs({});
    }
  };

  const handleSpecChange = (key: string, value: string) => {
    setSpecs((prev) => ({ ...prev, [key]: value }));
  };

  const selectedSubcategory = subcategories.find((sc) => sc.id === formData.subcategory_id);
  const specFields = getSpecsForSubcategory(selectedSubcategory?.slug);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setError('');

    // Clean specs: remove empty string values
    const cleanedSpecs: Record<string, string | number> = {};
    for (const [k, v] of Object.entries(specs)) {
      if (v !== '') cleanedSpecs[k] = v;
    }

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
      delivery_type: (formData.delivery_type as DeliveryType) || undefined,
      subcategory_id: formData.subcategory_id || undefined,
      specs: cleanedSpecs,
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

  const handleRepublish = async () => {
    setRepublishing(true);
    setMessage('');
    setError('');

    const result = await republishListing(token);
    if (result.success) {
      setListing((prev) => prev ? { ...prev, status: 'active' } : prev);
      setMessage('Annonce republiée avec succès !');
    } else {
      setError(result.error || 'Erreur lors de la republication.');
    }
    setRepublishing(false);
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
        {tc('loading')}
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

      {/* Expired listing banner with republish option */}
      {listing?.status === 'expired' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div className="flex-1">
              <h3 className="font-medium text-amber-800 mb-1">Annonce expirée</h3>
              <p className="text-sm text-amber-700 mb-3">
                Votre annonce n&apos;est plus visible. Vous pouvez la republier pour 4 jours supplémentaires.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button size="sm" onClick={handleRepublish} disabled={republishing}>
                  {republishing ? 'Republication...' : 'Republier mon annonce'}
                </Button>
                {!listing.user_id && (
                  <Button size="sm" variant="outline" onClick={() => router.push('/connexion')}>
                    Créer un compte — 30 jours de visibilité
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
          onChange={(e) => {
            handleChange('category_id', e.target.value);
            if (e.target.value !== formData.category_id) handleChange('subcategory_id', '');
          }}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />

        {subcategories.filter((sc) => sc.category_id === formData.category_id).length > 0 && (
          <Select
            label="Type de produit"
            placeholder="Choisir (optionnel)"
            value={formData.subcategory_id}
            onChange={(e) => handleChange('subcategory_id', e.target.value)}
            options={subcategories
              .filter((sc) => sc.category_id === formData.category_id)
              .map((sc) => ({ value: sc.id, label: sc.name }))}
          />
        )}

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

        <Select
          label="Mode de remise"
          placeholder="Non spécifié"
          value={formData.delivery_type}
          onChange={(e) => handleChange('delivery_type', e.target.value)}
          options={DELIVERY_TYPE_OPTIONS}
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
            {specFields.length > 0 && (
              <SpecFields fields={specFields} values={specs} onChange={handleSpecChange} />
            )}
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
