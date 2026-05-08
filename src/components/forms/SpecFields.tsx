'use client';

import { SpecFieldDefinition } from '@/lib/types';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface SpecFieldsProps {
  fields: SpecFieldDefinition[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

export default function SpecFields({ fields, values, onChange }: SpecFieldsProps) {
  if (fields.length === 0) return null;

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Caractéristiques spécifiques à ce type de produit
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => {
          if (field.type === 'select' && field.options) {
            return (
              <Select
                key={field.key}
                label={field.label}
                placeholder="Sélectionner..."
                value={values[field.key] || ''}
                onChange={(e) => onChange(field.key, e.target.value)}
                options={field.options}
              />
            );
          }

          return (
            <Input
              key={field.key}
              label={field.unit ? `${field.label} (${field.unit})` : field.label}
              type="number"
              placeholder={field.placeholder || ''}
              value={values[field.key] || ''}
              onChange={(e) => onChange(field.key, e.target.value)}
            />
          );
        })}
      </div>
    </div>
  );
}
