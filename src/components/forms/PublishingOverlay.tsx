'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface PublishingOverlayProps {
  /** Whether the actual backend work is done */
  isDone: boolean;
  /** Called when the full animation sequence finishes and we're ready to navigate */
  onComplete: () => void;
  /** If an error occurred during submission */
  error?: string;
}

const STAGE_KEYS = ['stage1', 'stage2', 'stage3', 'stage4'] as const;
const STAGE_ICONS = ['upload', 'camera', 'check', 'publish'] as const;
const STAGE_DURATIONS = [2500, 2500, 2000, 2000];

export default function PublishingOverlay({ isDone, onComplete, error }: PublishingOverlayProps) {
  const t = useTranslations('publishingOverlay');
  const [stage, setStage] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Advance through stages on a timer
  useEffect(() => {
    if (completed || error) return;

    // If we're at the last stage and backend is done, mark completed
    if (stage >= STAGE_KEYS.length - 1 && isDone) {
      const timer = setTimeout(() => {
        setCompleted(true);
      }, 1200);
      return () => clearTimeout(timer);
    }

    // If we're at the last stage but backend isn't done yet, wait
    if (stage >= STAGE_KEYS.length - 1) return;

    const timer = setTimeout(() => {
      setStage((s) => s + 1);
    }, STAGE_DURATIONS[stage]);

    return () => clearTimeout(timer);
  }, [stage, isDone, completed, error]);

  // If backend finishes while we're still in early stages, let animation continue naturally
  // but if we're waiting at the last stage, the effect above handles it

  // After completed, wait for the final animation then call onComplete
  useEffect(() => {
    if (completed) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [completed, onComplete]);

  const progress = completed
    ? 100
    : Math.min(((stage + 1) / STAGE_KEYS.length) * 85, 95);

  return (
    <div className="publish-overlay-enter fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" />

      {/* Card */}
      <div className="publish-card-enter relative bg-white rounded-2xl shadow-2xl p-8 sm:p-10 max-w-sm w-full mx-4 text-center">
        {error ? (
          /* Error state */
          <div className="publish-stage-enter">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        ) : completed ? (
          /* Completed state */
          <div className="publish-stage-enter">
            <div className="publish-check-burst w-16 h-16 mx-auto mb-5 rounded-full bg-accent-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-accent-500 publish-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-heading text-xl font-bold text-slate-900 mb-1">{t('done')}</h3>
            <p className="text-sm text-slate-500">{t('redirecting')}</p>
          </div>
        ) : (
          /* Progress state */
          <>
            {/* Animated icon */}
            <div className="w-16 h-16 mx-auto mb-5 relative">
              <div className="absolute inset-0 rounded-full border-2 border-slate-100" />
              <svg className="absolute inset-0 w-16 h-16 publish-spinner" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="30" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"
                  strokeDasharray="140 60"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <StageIcon stage={stage} />
              </div>
            </div>

            {/* Stage label */}
            <div key={stage} className="publish-stage-enter mb-6">
              <p className="text-sm font-medium text-slate-900">{t(STAGE_KEYS[stage])}</p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 relative overflow-hidden"
                style={{
                  width: `${progress}%`,
                  transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    animation: 'progressShimmer 1.5s ease-in-out infinite',
                  }}
                />
              </div>
            </div>

            {/* Step dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {STAGE_KEYS.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                    i <= stage ? 'bg-brand-500 scale-125' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StageIcon({ stage }: { stage: number }) {
  const cls = "w-6 h-6 text-brand-600";
  switch (stage) {
    case 0:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      );
    case 1:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    case 2:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      );
    case 3:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    default:
      return null;
  }
}
