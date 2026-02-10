import { EnergyType } from '@/lib/types';

export const ENERGY_TYPE_OPTIONS: { value: EnergyType; label: string }[] = [
  { value: 'electrique', label: 'Électrique' },
  { value: 'gaz', label: 'Gaz' },
  { value: 'manuel', label: 'Manuel' },
  { value: 'mixte', label: 'Mixte' },
];

export const ENERGY_TYPE_LABELS: Record<EnergyType, string> = {
  electrique: 'Électrique',
  gaz: 'Gaz',
  manuel: 'Manuel',
  mixte: 'Mixte',
};
