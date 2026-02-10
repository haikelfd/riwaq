'use client';

import ImageUploader from './ImageUploader';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { ENERGY_TYPE_OPTIONS } from '@/lib/constants/energy-types';

interface StepDetailsProps {
  data: {
    description: string;
    brand: string;
    model: string;
    year: string;
    energy_type: string;
  };
  images: File[];
  onImagesChange: (images: File[]) => void;
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export default function StepDetails({ data, images, onImagesChange, onChange, errors }: StepDetailsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-900 mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          rows={5}
          placeholder="Décrivez votre matériel : marque, modèle, état, année d'achat..."
          value={data.description}
          onChange={(e) => onChange('description', e.target.value)}
          className={`
            w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white
            text-slate-900 placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
            transition-colors duration-200 resize-vertical
            ${errors.description ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500' : ''}
          `}
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>

      <ImageUploader images={images} onImagesChange={onImagesChange} />

      {/* Technical info section */}
      <div className="pt-4 border-t border-slate-200">
        <h3 className="text-sm font-medium text-slate-900 mb-3">
          Informations techniques <span className="text-slate-400 font-normal">(optionnel)</span>
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Marque"
              placeholder="Ex: La Cimbali, Santos..."
              value={data.brand}
              onChange={(e) => onChange('brand', e.target.value)}
            />
            <Input
              label="Modèle"
              placeholder="Ex: M27, N°1..."
              value={data.model}
              onChange={(e) => onChange('model', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Année"
              type="number"
              placeholder="Ex: 2022"
              value={data.year}
              onChange={(e) => onChange('year', e.target.value)}
            />
            <Select
              label="Type d'énergie"
              value={data.energy_type}
              onChange={(e) => onChange('energy_type', e.target.value)}
              options={ENERGY_TYPE_OPTIONS}
              placeholder="Sélectionner..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
