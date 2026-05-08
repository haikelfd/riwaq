import { CuisineType } from '@/lib/types';

export const CUISINE_TYPE_OPTIONS: { value: CuisineType; label: string; icon: string }[] = [
  { value: 'tunisienne', label: 'Tunisienne', icon: '🇹🇳' },
  { value: 'française', label: 'Française', icon: '🇫🇷' },
  { value: 'italienne', label: 'Italienne', icon: '🇮🇹' },
  { value: 'libanaise', label: 'Libanaise', icon: '🇱🇧' },
  { value: 'turque', label: 'Turque', icon: '🇹🇷' },
  { value: 'chinoise', label: 'Chinoise', icon: '🇨🇳' },
  { value: 'japonaise', label: 'Japonaise', icon: '🇯🇵' },
  { value: 'thaïlandaise', label: 'Thaïlandaise', icon: '🇹🇭' },
  { value: 'mexicaine', label: 'Mexicaine', icon: '🇲🇽' },
  { value: 'indienne', label: 'Indienne', icon: '🇮🇳' },
  { value: 'coréenne', label: 'Coréenne', icon: '🇰🇷' },
  { value: 'américaine', label: 'Américaine', icon: '🇺🇸' },
  { value: 'autre', label: 'Autre', icon: '🍽️' },
];

export const CUISINE_TYPE_LABELS: Record<CuisineType, string> = {
  tunisienne: 'Tunisienne',
  française: 'Française',
  italienne: 'Italienne',
  libanaise: 'Libanaise',
  turque: 'Turque',
  chinoise: 'Chinoise',
  japonaise: 'Japonaise',
  thaïlandaise: 'Thaïlandaise',
  mexicaine: 'Mexicaine',
  indienne: 'Indienne',
  coréenne: 'Coréenne',
  américaine: 'Américaine',
  autre: 'Autre',
};

export const CUISINE_TYPE_ICONS: Record<CuisineType, string> = Object.fromEntries(
  CUISINE_TYPE_OPTIONS.map((o) => [o.value, o.icon])
) as Record<CuisineType, string>;

export const CUISINE_TYPE_VALUES = CUISINE_TYPE_OPTIONS.map((o) => o.value);
