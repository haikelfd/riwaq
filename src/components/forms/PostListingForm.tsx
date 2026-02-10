'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Category, Location, EnergyType } from '@/lib/types';
import { createListing } from '@/lib/actions/listings';
import { createSeller } from '@/lib/actions/sellers';
import { uploadListingImage } from '@/lib/actions/images';
import StepBasicInfo from './StepBasicInfo';
import StepDetails from './StepDetails';
import StepContact from './StepContact';
import Button from '@/components/ui/Button';

interface PostListingFormProps {
  categories: Category[];
  locations: Location[];
}

const STEPS = ['Informations', 'Détails', 'Contact'];

export default function PostListingForm({ categories, locations }: PostListingFormProps) {
  const router = useRouter();
  const { user, profile } = useAuth();
  const isLoggedIn = !!user;
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    price: '',
    condition: '',
    location_id: '',
    description: '',
    brand: '',
    model: '',
    year: '',
    energy_type: '',
    phone: '',
    seller_name: '',
    create_profile: 'false',
    profile_token: '',
    profile_email: '',
  });

  // Pre-fill from profile when logged in
  useEffect(() => {
    if (isLoggedIn && profile) {
      setFormData((prev) => ({
        ...prev,
        phone: prev.phone || profile.phone || '',
        seller_name: prev.seller_name || profile.full_name || '',
      }));
    }
  }, [isLoggedIn, profile]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.title.trim()) newErrors.title = 'Le titre est requis.';
      if (!formData.category_id) newErrors.category_id = 'La catégorie est requise.';
      if (!formData.condition) newErrors.condition = 'L\'état est requis.';
      if (!formData.location_id) newErrors.location_id = 'La ville est requise.';
    }

    if (step === 2) {
      if (!formData.phone.trim()) newErrors.phone = 'Le numéro de téléphone est requis.';
      else if (formData.phone.replace(/\D/g, '').length < 8)
        newErrors.phone = 'Le numéro doit contenir au moins 8 chiffres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      let sellerId: string | undefined;
      let profileToken: string | undefined;

      // Create seller profile if requested
      if (formData.create_profile === 'true') {
        const sellerResult = await createSeller({
          full_name: formData.seller_name || formData.phone,
          phone: formData.phone,
          email: formData.profile_email || undefined,
        });

        if (sellerResult.success && sellerResult.sellerId) {
          sellerId = sellerResult.sellerId;
          profileToken = sellerResult.managementToken;
        }
      }

      const result = await createListing({
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
        seller_id: sellerId,
        profile_token: formData.profile_token || undefined,
        user_id: user?.id,
      });

      if (!result.success || !result.listingId) {
        setErrors({ submit: result.error || 'Erreur lors de la création.' });
        setIsSubmitting(false);
        return;
      }

      // Upload images
      for (let i = 0; i < images.length; i++) {
        const formDataImg = new FormData();
        formDataImg.append('file', images[i]);
        await uploadListingImage(result.listingId, formDataImg, i);
      }

      // Redirect to success with management token
      let successUrl = `/deposer/succes?token=${result.managementToken}&id=${result.listingId}`;
      if (profileToken) {
        successUrl += `&profileToken=${profileToken}`;
      }
      router.push(successUrl);
    } catch {
      setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                index <= currentStep
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`ml-2 text-sm hidden sm:inline ${
                index <= currentStep ? 'text-slate-900 font-medium' : 'text-slate-500'
              }`}
            >
              {step}
            </span>
            {index < STEPS.length - 1 && (
              <div
                className={`w-8 sm:w-16 h-0.5 mx-2 transition-colors ${
                  index < currentStep ? 'bg-slate-900' : 'bg-slate-100'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Logged-in info */}
      {isLoggedIn && profile && (
        <div className="bg-accent-50 text-accent-700 text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Connecté en tant que {profile.full_name || profile.phone} — votre annonce sera liée à votre compte.
        </div>
      )}

      {/* Form content */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {currentStep === 0 && (
          <StepBasicInfo
            data={formData}
            onChange={handleChange}
            categories={categories}
            locations={locations}
            errors={errors}
          />
        )}

        {currentStep === 1 && (
          <StepDetails
            data={formData}
            images={images}
            onImagesChange={setImages}
            onChange={handleChange}
            errors={errors}
          />
        )}

        {currentStep === 2 && (
          <StepContact
            data={formData}
            onChange={handleChange}
            errors={errors}
            isLoggedIn={isLoggedIn}
            userName={profile?.full_name || undefined}
          />
        )}

        {errors.submit && (
          <div className="mt-4 bg-red-50 text-red-500 text-sm p-3 rounded-lg">
            {errors.submit}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6 pt-4 border-t border-slate-200">
          {currentStep > 0 ? (
            <Button variant="ghost" onClick={handleBack} disabled={isSubmitting}>
              Retour
            </Button>
          ) : (
            <div />
          )}

          {currentStep < STEPS.length - 1 ? (
            <Button onClick={handleNext}>
              Suivant
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Publication...' : 'Publier l\'annonce'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
