'use client';

import { useState, useEffect, useMemo, useRef, Fragment } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Category, Location, Subcategory, EnergyType, DeliveryType, CuisineType } from '@/lib/types';
import { createListing } from '@/lib/actions/listings';
import { createSeller } from '@/lib/actions/sellers';
import { uploadListingImage } from '@/lib/actions/images';
import StepProduit from './StepProduit';
import StepAnnonce from './StepAnnonce';
import StepContact from './StepContact';
import DeposerSidebar from './DeposerSidebar';
import PublishingOverlay from './PublishingOverlay';
import Button from '@/components/ui/Button';

interface PostListingFormProps {
  categories: Category[];
  subcategories: Subcategory[];
  locations: Location[];
}

const STEP_KEYS = ['stepProduct', 'stepListing', 'stepContact'] as const;
const MOBILE_TIP_KEYS = ['tipProduct', 'tipListing', 'tipContact'] as const;

export default function PostListingForm({ categories, subcategories, locations }: PostListingFormProps) {
  const router = useRouter();
  const t = useTranslations('postListing');
  const tv = useTranslations('validation');
  const { user, profile } = useAuth();
  const isLoggedIn = !!user;
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishState, setPublishState] = useState<'idle' | 'publishing' | 'done' | 'error'>('idle');
  const [publishError, setPublishError] = useState<string | undefined>();
  const successUrlRef = useRef<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'back'>('forward');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<File[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  const STEPS = STEP_KEYS.map((key) => t(key));
  const MOBILE_TIPS = MOBILE_TIP_KEYS.map((key) => t(key));

  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    subcategory_id: '',
    price: '',
    condition: '',
    location_id: '',
    description: '',
    brand: '',
    model: '',
    year: '',
    energy_type: '',
    delivery_type: '',
    cuisine_type: '',
    phone: '',
    seller_name: '',
    create_profile: 'false',
    profile_token: '',
    profile_email: '',
    specs: {} as Record<string, string>,
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
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'subcategory_id' || field === 'category_id') {
        next.specs = {};
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSpecChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      specs: { ...prev.specs, [key]: value },
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.category_id) newErrors.category_id = tv('categoryRequired');
    }

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = tv('titleRequired');
      if (!formData.condition) newErrors.condition = tv('conditionRequired');
      if (!formData.location_id) newErrors.location_id = tv('cityRequired');
    }

    if (step === 2) {
      if (!formData.phone.trim()) newErrors.phone = tv('phoneRequired');
      else if (formData.phone.replace(/\D/g, '').length < 8)
        newErrors.phone = tv('phoneMinLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const scrollToTop = () => {
    setTimeout(() => {
      progressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setTransitionDirection('forward');
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
        setIsTransitioning(false);
        scrollToTop();
      }, 300);
    }
  };

  const handleBack = () => {
    setTransitionDirection('back');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
      setIsTransitioning(false);
      scrollToTop();
    }, 300);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setPublishState('publishing');
    setPublishError(undefined);

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
        delivery_type: (formData.delivery_type as DeliveryType) || undefined,
        cuisine_type: (formData.cuisine_type as CuisineType) || undefined,
        subcategory_id: formData.subcategory_id || undefined,
        specs: Object.keys(formData.specs).length > 0
          ? Object.fromEntries(Object.entries(formData.specs).filter(([, v]) => v !== ''))
          : undefined,
        seller_id: sellerId,
        profile_token: formData.profile_token || undefined,
        user_id: user?.id,
      });

      if (!result.success || !result.listingId) {
        setPublishState('error');
        setPublishError(result.error || t('errorCreation'));
        setIsSubmitting(false);
        return;
      }

      // Upload images
      for (let i = 0; i < images.length; i++) {
        const formDataImg = new FormData();
        formDataImg.append('file', images[i]);
        await uploadListingImage(result.listingId, formDataImg, i);
      }

      // Build success URL and signal the overlay that backend work is done
      let successUrl = `/deposer/succes?token=${result.managementToken}&id=${result.listingId}`;
      if (profileToken) {
        successUrl += `&profileToken=${profileToken}`;
      }
      successUrlRef.current = successUrl;
      setPublishState('done');
    } catch {
      setPublishState('error');
      setPublishError(t('errorGeneric'));
      setIsSubmitting(false);
    }
  };

  const handlePublishComplete = () => {
    router.push(successUrlRef.current);
  };

  const stepAnimationClass = isTransitioning
    ? (transitionDirection === 'forward' ? 'step-exit' : 'step-exit-back')
    : (transitionDirection === 'forward' ? 'step-enter' : 'step-enter-back');

  // Compute illustration stage (0-6) for the sidebar story
  const illustrationStage = useMemo(() => {
    if (currentStep === 2) return 6;
    if (currentStep === 1) {
      if (formData.price || formData.location_id) return 5;
      if (formData.condition) return 4;
      if (images.length > 0) return 3;
      if (formData.title.trim()) return 2;
      return 2;
    }
    // Step 0: product
    if (formData.category_id) return 1;
    return 0;
  }, [currentStep, formData.price, formData.location_id, formData.condition, formData.title, formData.category_id, images.length]);

  // Get the selected subcategory's icon for the sidebar illustration
  const subcategoryIcon = useMemo(() => {
    if (!formData.subcategory_id) return undefined;
    const sub = subcategories.find((s) => s.id === formData.subcategory_id);
    return sub?.icon;
  }, [formData.subcategory_id, subcategories]);

  return (
    <div className="relative z-10">
      {/* Progress indicator card */}
      <div ref={progressRef} className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 p-5 sm:p-6 mb-8 deposer-card-enter">
        <div className="flex items-center justify-center gap-0">
          {STEPS.map((step, index) => (
            <Fragment key={step}>
              {index > 0 && (
                <div className="w-14 sm:w-20 md:w-28 h-1 bg-slate-100 rounded-full overflow-hidden mx-2 sm:mx-3">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 progress-bar-fill relative overflow-hidden"
                    style={{ width: index <= currentStep ? '100%' : '0%' }}
                  >
                    <div className="absolute inset-0 hidden lg:block overflow-hidden">
                      <div
                        className="absolute top-0 bottom-0 w-[30%] bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        style={{ animation: 'progressShimmer 2s ease-in-out infinite' }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    index <= currentStep
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 scale-110'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {index < currentStep ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`text-xs font-medium transition-colors duration-300 ${
                    index <= currentStep ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {step}
                </span>
              </div>
            </Fragment>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block lg:w-5/12 xl:w-4/12">
          <div className="sticky top-24">
            <DeposerSidebar currentStep={currentStep} illustrationStage={illustrationStage} formData={formData} subcategoryIcon={subcategoryIcon} />
          </div>
        </aside>

        {/* Form column */}
        <div className="flex-1 min-w-0">
          {/* Logged-in info */}
          {isLoggedIn && profile && (
            <div className="bg-accent-50 text-accent-700 text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('loggedInAs', { name: profile.full_name || profile.phone || user?.email || '' })}
            </div>
          )}

          {/* Mobile tip banner */}
          <div className="lg:hidden mb-4">
            <div className="bg-brand-50 border border-brand-200 rounded-lg px-4 py-2.5 flex items-center gap-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-brand-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span className="text-xs text-brand-700">{MOBILE_TIPS[currentStep]}</span>
            </div>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 lg:p-8 lg:rounded-2xl lg:border-slate-200/80 lg:shadow-lg lg:shadow-slate-200/50 form-card-desktop deposer-card-enter-delayed">
            <div key={currentStep} className={stepAnimationClass}>
              {currentStep === 0 && (
                <StepProduit
                  data={formData}
                  onChange={handleChange}
                  onSpecChange={handleSpecChange}
                  categories={categories}
                  subcategories={subcategories}
                  errors={errors}
                />
              )}

              {currentStep === 1 && (
                <StepAnnonce
                  data={formData}
                  images={images}
                  onImagesChange={setImages}
                  onChange={handleChange}
                  locations={locations}
                  errors={errors}
                />
              )}

              {currentStep === 2 && (
                <StepContact
                  data={formData}
                  onChange={handleChange}
                  errors={errors}
                  isLoggedIn={isLoggedIn}
                  hasPhone={!!(profile?.phone)}
                  userName={profile?.full_name || undefined}
                />
              )}
            </div>

            {errors.submit && (
              <div className="mt-4 bg-red-50 text-red-500 text-sm p-3 rounded-lg">
                {errors.submit}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-6 pt-4 border-t border-slate-200">
              {currentStep > 0 ? (
                <Button variant="ghost" onClick={handleBack} disabled={isSubmitting || isTransitioning}>
                  {t('back')}
                </Button>
              ) : (
                <div />
              )}

              {currentStep < STEPS.length - 1 ? (
                <Button onClick={handleNext} disabled={isTransitioning}>
                  {t('next')}
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting || isTransitioning}>
                  {isSubmitting ? t('publishing') : t('publish')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Publishing overlay */}
      {publishState !== 'idle' && (
        <PublishingOverlay
          isDone={publishState === 'done'}
          onComplete={handlePublishComplete}
          error={publishError}
        />
      )}
    </div>
  );
}
