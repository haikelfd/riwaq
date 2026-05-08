'use client';

import { ComponentType, useState, useRef } from 'react';

interface IconSelectOption {
  value: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  description?: string;
}

interface IconSelectProps {
  options: IconSelectOption[];
  value: string;
  onChange: (value: string) => void;
  columns?: 2 | 3 | 4 | 6;
  label?: string;
  error?: string;
  required?: boolean;
}

export default function IconSelect({
  options,
  value,
  onChange,
  columns = 3,
  label,
  error,
  required,
}: IconSelectProps) {
  const [justSelected, setJustSelected] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  };

  const handleSelect = (optionValue: string) => {
    const newValue = value === optionValue ? '' : optionValue;
    if (newValue) {
      setJustSelected(newValue);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setJustSelected(null), 600);
    }
    onChange(newValue);
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-900 mb-2">
          {label}
          {required && <span className="text-red-500 ms-0.5">*</span>}
        </label>
      )}
      <div className={`grid ${gridCols[columns]} gap-2`}>
        {options.map((option) => {
          const isSelected = value === option.value;
          const isJustSelected = justSelected === option.value;
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`
                relative flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer
                ${isSelected
                  ? 'border-brand-500 bg-brand-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }
              `}
              style={isJustSelected ? { animation: 'selectPulse 0.6s ease-out' } : undefined}
            >
              <span
                style={isJustSelected ? { display: 'inline-flex', animation: 'iconBounce 0.3s cubic-bezier(0.34,1.56,0.64,1)' } : undefined}
              >
                <Icon
                  className={`w-6 h-6 transition-colors duration-200 ${
                    isSelected ? 'text-brand-600' : 'text-slate-400'
                  }`}
                />
              </span>
              <span
                className={`text-xs font-medium text-center leading-tight transition-colors duration-200 ${
                  isSelected ? 'text-brand-700' : 'text-slate-600'
                }`}
              >
                {option.label}
              </span>
              {option.description && (
                <span className="text-[10px] text-slate-400 text-center leading-tight">
                  {option.description}
                </span>
              )}
              {isSelected && (
                <div
                  className="absolute top-1.5 end-1.5 w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center"
                  style={isJustSelected ? { animation: 'checkmarkAppear 0.25s cubic-bezier(0.34,1.56,0.64,1) 0.05s both' } : undefined}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export type { IconSelectOption, IconSelectProps };
