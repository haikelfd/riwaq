'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import DeposerIllustration from './DeposerIllustration';

interface DeposerSidebarProps {
  currentStep: number;
  illustrationStage: number;
  formData: {
    title: string;
    price: string;
    condition: string;
    category_id: string;
  };
  subcategoryIcon?: string;
}

const TIP_DURATION = 30000;

export default function DeposerSidebar({ currentStep, illustrationStage, formData, subcategoryIcon }: DeposerSidebarProps) {
  const t = useTranslations('sidebar');
  const tc = useTranslations('constants');
  const [visibleTip, setVisibleTip] = useState<number | null>(0);
  const [tipFading, setTipFading] = useState(false);
  const prevStageRef = useRef(illustrationStage);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const STAGE_TIPS: Record<number, string> = {
    0: t('tip0'),
    1: t('tip1'),
    2: t('tip2'),
    3: t('tip3'),
    4: t('tip4'),
    5: t('tip5'),
    6: t('tip6'),
  };

  const scheduleFade = () => {
    fadeTimerRef.current = setTimeout(() => {
      setTipFading(true);
      timerRef.current = setTimeout(() => {
        setVisibleTip(null);
        setTipFading(false);
      }, 400);
    }, TIP_DURATION);
  };

  // Show tip when stage changes
  useEffect(() => {
    if (illustrationStage !== prevStageRef.current) {
      prevStageRef.current = illustrationStage;

      if (timerRef.current) clearTimeout(timerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);

      setTipFading(false);
      setVisibleTip(illustrationStage);
      scheduleFade();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [illustrationStage]);

  // Initial tip on mount
  useEffect(() => {
    scheduleFade();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tipText = visibleTip !== null ? STAGE_TIPS[visibleTip] : null;

  return (
    <div className="space-y-4">
      {/* Illustration card */}
      <div className="deposer-sidebar-card bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-7 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500/10 via-transparent to-transparent" />
        <div className="relative">
          <DeposerIllustration stage={illustrationStage} subcategoryIcon={subcategoryIcon} />
        </div>
      </div>

      {/* Contextual tip toast — pops in per stage, auto-hides after 30s */}
      {tipText && (
        <div
          key={visibleTip}
          className={tipFading ? 'sidebar-tip-exit' : 'sidebar-tip-enter'}
        >
          <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
            <div className="w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{tipText}</p>
          </div>
        </div>
      )}

      {/* Summary card on contact step */}
      {currentStep >= 2 && formData.title && (
        <div className="sidebar-content-enter bg-white border border-slate-200 rounded-2xl p-5">
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">{t('summary')}</p>
            <p className="font-medium text-slate-900 text-sm">{formData.title}</p>
            {formData.price && (
              <p className="text-brand-500 font-semibold text-sm">{formData.price} TND</p>
            )}
            {formData.condition && (
              <span className="inline-block text-xs bg-slate-200 px-2.5 py-1 rounded-full text-slate-600">
                {formData.condition === 'neuf' ? tc('conditions.neuf') : tc('conditions.occasion')}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Reassurance card */}
      <div className="bg-accent-50 border border-accent-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-accent-500/10 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-accent-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-accent-700">{t('freeTitle')}</span>
        </div>
        <p className="text-xs text-accent-600/80 leading-relaxed">
          {t('freeDesc')}
        </p>
      </div>
    </div>
  );
}
