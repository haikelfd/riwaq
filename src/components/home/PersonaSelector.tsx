'use client';

import { useTranslations } from 'next-intl';
import { PERSONAS } from '@/lib/constants/personas';
import { getCategoryIcon } from '@/components/ui/Icons';

interface PersonaSelectorProps {
  activePersona: string;
  onSelect: (key: string) => void;
}

export default function PersonaSelector({ activePersona, onSelect }: PersonaSelectorProps) {
  const t = useTranslations('personas');
  const tHome = useTranslations('home');

  return (
    <div className="pt-8 pb-6">
      {/* Section header — centered */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          {tHome('explorerTitle')}
        </h2>
        <p className="text-white/70 text-sm font-semibold mt-1.5 max-w-md mx-auto">
          {tHome('explorerSubtitle')}
        </p>
      </div>

      {/* Persona selection row — centered */}
      <div className="flex gap-3 justify-center overflow-x-auto pt-2 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        {PERSONAS.map((persona) => {
          const isActive = activePersona === persona.key;
          const Icon = getCategoryIcon(persona.icon);

          return (
            <button
              key={persona.key}
              onClick={() => onSelect(persona.key)}
              className={`
                relative flex items-center gap-3 px-5 py-3.5 rounded-2xl border-2 transition-all duration-300 cursor-pointer shrink-0
                ${isActive
                  ? 'border-white bg-white shadow-lg'
                  : 'border-white/30 bg-white/15 hover:bg-white/25 hover:border-white/50 backdrop-blur-sm'
                }
              `}
            >
              <div className={`
                w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300
                ${isActive ? 'bg-slate-50 shadow-sm' : 'bg-white/15'}
              `}>
                <Icon className={`w-5 h-5 transition-colors duration-300 ${
                  isActive ? persona.iconColor : 'text-white/80'
                }`} />
              </div>
              <div className="text-start">
                <span className={`text-sm font-semibold block transition-colors duration-300 ${
                  isActive ? 'text-slate-900' : 'text-white'
                }`}>
                  {t(persona.key)}
                </span>
                <span className={`text-[11px] font-medium leading-tight block transition-colors duration-300 ${
                  isActive ? 'text-slate-400' : 'text-white/70'
                }`}>
                  {t(persona.key + 'Desc')}
                </span>
              </div>
              {isActive && persona.key !== 'all' && (
                <div className="absolute -top-1.5 -end-1.5 w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
