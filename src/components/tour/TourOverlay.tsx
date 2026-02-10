'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTour } from '@/lib/contexts/TourContext';

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function TourOverlay() {
  const { isActive, currentStep, totalSteps, currentStepData, nextStep, skipTour } = useTour();
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [viewportSize, setViewportSize] = useState({ w: 0, h: 0 });

  const updatePosition = useCallback(() => {
    if (!currentStepData) return;

    const el = document.querySelector(`[data-tour-id="${currentStepData.targetId}"]`);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    } else {
      setTargetRect(null);
    }
    setViewportSize({ w: window.innerWidth, h: window.innerHeight });
  }, [currentStepData]);

  // Scroll target into view and update position
  useEffect(() => {
    if (!isActive || !currentStepData) return;

    const el = document.querySelector(`[data-tour-id="${currentStepData.targetId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Wait for scroll to settle
      const timer = setTimeout(updatePosition, 400);
      return () => clearTimeout(timer);
    }
  }, [isActive, currentStepData, updatePosition]);

  // Update on scroll/resize
  useEffect(() => {
    if (!isActive) return;

    const handleUpdate = () => requestAnimationFrame(updatePosition);
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);
    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [isActive, updatePosition]);

  if (!isActive || !currentStepData || !targetRect) return null;

  const padding = 8;
  const radius = 12;
  const x = targetRect.left - padding;
  const y = targetRect.top - padding;
  const w = targetRect.width + padding * 2;
  const h = targetRect.height + padding * 2;
  const vw = viewportSize.w;
  const vh = viewportSize.h;

  // SVG path with cutout (evenodd: outer rect - inner rounded rect)
  const svgPath = `
    M 0 0 H ${vw} V ${vh} H 0 Z
    M ${x + radius} ${y}
    H ${x + w - radius} Q ${x + w} ${y} ${x + w} ${y + radius}
    V ${y + h - radius} Q ${x + w} ${y + h} ${x + w - radius} ${y + h}
    H ${x + radius} Q ${x} ${y + h} ${x} ${y + h - radius}
    V ${y + radius} Q ${x} ${y} ${x + radius} ${y} Z
  `;

  // Tooltip positioning — responsive width for mobile
  const tooltipWidth = Math.min(280, vw - 32);
  const tooltipGap = 12;
  let tooltipStyle: React.CSSProperties = {};

  // On narrow screens, force bottom/top positioning (left/right won't fit)
  const isMobile = vw < 640;
  let position = currentStepData.position;
  if (isMobile && (position === 'left' || position === 'right')) {
    position = 'bottom';
  }

  if (position === 'bottom') {
    tooltipStyle = {
      top: y + h + padding + tooltipGap,
      left: Math.max(16, Math.min(x + w / 2 - tooltipWidth / 2, vw - tooltipWidth - 16)),
    };
  } else if (position === 'top') {
    tooltipStyle = {
      top: y - tooltipGap - 120,
      left: Math.max(16, Math.min(x + w / 2 - tooltipWidth / 2, vw - tooltipWidth - 16)),
    };
  } else if (position === 'left') {
    tooltipStyle = {
      top: y + h / 2 - 60,
      left: Math.max(16, x - tooltipWidth - tooltipGap),
    };
  } else if (position === 'right') {
    tooltipStyle = {
      top: y + h / 2 - 60,
      left: Math.min(vw - tooltipWidth - 16, x + w + tooltipGap),
    };
  }

  // Clamp tooltip to viewport
  if (typeof tooltipStyle.top === 'number' && tooltipStyle.top < 16) {
    tooltipStyle.top = 16;
  }
  if (typeof tooltipStyle.left === 'number' && tooltipStyle.left < 16) {
    tooltipStyle.left = 16;
  }

  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="tour-overlay" style={{ position: 'fixed', inset: 0, zIndex: 9998 }}>
      {/* SVG overlay with cutout */}
      <svg
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={svgPath} fill="rgba(0,0,0,0.6)" fillRule="evenodd" />
      </svg>

      {/* Tooltip */}
      <div
        className="tour-tooltip"
        style={{
          position: 'fixed',
          ...tooltipStyle,
          width: tooltipWidth,
          zIndex: 9999,
        }}
      >
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-4 sm:p-5">
          <h3 className="font-heading text-sm sm:text-base font-semibold text-slate-900 mb-1">
            {currentStepData.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-3 sm:mb-4">
            {currentStepData.description}
          </p>
          <div className="flex items-center justify-between">
            <button
              onClick={skipTour}
              className="text-xs sm:text-sm text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              Passer
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs text-slate-400">
                {currentStep + 1}/{totalSteps}
              </span>
              <button
                onClick={nextStep}
                className="bg-slate-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {isLastStep ? 'Terminer' : 'Suivant'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
