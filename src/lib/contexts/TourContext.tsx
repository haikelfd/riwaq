'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { markTourAsSeen } from '@/lib/actions/auth';
import { useAuth } from '@/lib/contexts/AuthContext';

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-search',
    title: 'Recherchez du matériel',
    description: 'Utilisez la barre de recherche pour trouver exactement ce que vous cherchez.',
    position: 'bottom',
  },
  {
    targetId: 'tour-categories',
    title: 'Parcourez par catégorie',
    description: 'Café, cuisine, réfrigération... trouvez la bonne catégorie.',
    position: 'bottom',
  },
  {
    targetId: 'tour-save',
    title: 'Sauvegardez vos favoris',
    description: 'Cliquez sur le coeur pour retrouver une annonce plus tard.',
    position: 'left',
  },
  {
    targetId: 'tour-post',
    title: 'Déposez une annonce',
    description: 'Vendez votre matériel en quelques minutes. Gratuit et sans commission.',
    position: 'bottom',
  },
  {
    targetId: 'tour-account',
    title: 'Votre compte',
    description: 'Retrouvez vos annonces et gérez votre profil ici.',
    position: 'bottom',
  },
];

interface TourContextType {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  currentStepData: TourStep | null;
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  endTour: () => void;
}

const TourContext = createContext<TourContextType>({
  isActive: false,
  currentStep: 0,
  totalSteps: TOUR_STEPS.length,
  currentStepData: null,
  startTour: () => {},
  nextStep: () => {},
  prevStep: () => {},
  skipTour: () => {},
  endTour: () => {},
});

export function useTour() {
  return useContext(TourContext);
}

export function TourProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const markSeen = useCallback(async () => {
    if (user?.id) {
      await markTourAsSeen(user.id);
    }
  }, [user]);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const endTour = useCallback(async () => {
    setIsActive(false);
    setCurrentStep(0);
    await markSeen();
  }, [markSeen]);

  const skipTour = useCallback(async () => {
    setIsActive(false);
    setCurrentStep(0);
    await markSeen();
  }, [markSeen]);

  const nextStep = useCallback(() => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      endTour();
    }
  }, [currentStep, endTour]);

  const prevStep = useCallback(() => {
    setCurrentStep((s) => Math.max(0, s - 1));
  }, []);

  // Listen for custom event from profile page
  useEffect(() => {
    const handler = () => {
      // Small delay to let navigation complete
      setTimeout(() => startTour(), 500);
    };
    window.addEventListener('riwaq-start-tour', handler);
    return () => window.removeEventListener('riwaq-start-tour', handler);
  }, [startTour]);

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStep,
        totalSteps: TOUR_STEPS.length,
        currentStepData: isActive ? TOUR_STEPS[currentStep] : null,
        startTour,
        nextStep,
        prevStep,
        skipTour,
        endTour,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}
