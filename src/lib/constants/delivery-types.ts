import { DeliveryType } from '@/lib/types';

export const DELIVERY_TYPE_OPTIONS: { value: DeliveryType; label: string }[] = [
  { value: 'sur_place', label: 'Sur place (enlèvement)' },
  { value: 'livraison', label: 'Livraison disponible' },
  { value: 'livraison_nationale', label: 'Livraison toute la Tunisie' },
];

export const DELIVERY_TYPE_LABELS: Record<DeliveryType, string> = {
  sur_place: 'Enlèvement sur place',
  livraison: 'Livraison locale',
  livraison_nationale: 'Livraison toute la Tunisie',
};
