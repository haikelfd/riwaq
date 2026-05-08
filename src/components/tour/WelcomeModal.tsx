'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useTour } from '@/lib/contexts/TourContext';
import { markTourAsSeen } from '@/lib/actions/auth';
import Button from '@/components/ui/Button';

export default function WelcomeModal() {
  const t = useTranslations('tour');
  const router = useRouter();
  const { user, profile } = useAuth();
  const { startTour } = useTour();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (user && profile && profile.has_seen_tour === false && !dismissed) {
      // Small delay to let the page settle after login
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [user, profile, dismissed]);

  if (!visible) return null;

  const handleDismiss = async () => {
    setVisible(false);
    setDismissed(true);
    if (user?.id) {
      await markTourAsSeen();
    }
  };

  const handleStartTour = () => {
    setVisible(false);
    setDismissed(true);
    router.push('/');
    // Start tour after navigation
    setTimeout(() => startTour(), 600);
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 tour-overlay"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 sm:p-8 text-center tour-tooltip">
        {/* Sparkle icon */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-7 sm:h-7 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
        </div>

        <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          {t('welcomeTitle')}
        </h2>
        <p className="text-slate-500 text-sm mb-6 sm:mb-8 leading-relaxed">
          {t('welcomeSubtitle')}
        </p>

        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={handleDismiss}>
            {t('welcomeNo')}
          </Button>
          <Button fullWidth onClick={handleStartTour}>
            {t('welcomeYes')}
          </Button>
        </div>
      </div>
    </div>
  );
}
