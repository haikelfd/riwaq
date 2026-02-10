'use client';

import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Category, Location } from '@/lib/types';

interface StepBasicInfoProps {
  data: {
    title: string;
    category_id: string;
    price: string;
    condition: string;
    location_id: string;
  };
  onChange: (field: string, value: string) => void;
  categories: Category[];
  locations: Location[];
  errors: Record<string, string>;
}

export default function StepBasicInfo({ data, onChange, categories, locations, errors }: StepBasicInfoProps) {
  return (
    <div className="space-y-4">
      <Input
        label="Titre de l'annonce"
        placeholder="Ex: Machine à café 2 groupes La Cimbali"
        value={data.title}
        onChange={(e) => onChange('title', e.target.value)}
        error={errors.title}
        required
      />

      <Select
        label="Catégorie"
        placeholder="Choisir une catégorie"
        value={data.category_id}
        onChange={(e) => onChange('category_id', e.target.value)}
        options={categories.map((c) => ({ value: c.id, label: c.name }))}
        error={errors.category_id}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Prix (TND)"
          placeholder="Laisser vide = À discuter"
          type="number"
          min="0"
          value={data.price}
          onChange={(e) => onChange('price', e.target.value)}
          error={errors.price}
        />

        <Select
          label="État"
          placeholder="Choisir"
          value={data.condition}
          onChange={(e) => onChange('condition', e.target.value)}
          options={[
            { value: 'occasion', label: 'Occasion' },
            { value: 'neuf', label: 'Neuf' },
          ]}
          error={errors.condition}
          required
        />
      </div>

      <Select
        label="Ville"
        placeholder="Choisir une ville"
        value={data.location_id}
        onChange={(e) => onChange('location_id', e.target.value)}
        options={locations.map((l) => ({ value: l.id, label: l.name }))}
        error={errors.location_id}
        required
      />
    </div>
  );
}
