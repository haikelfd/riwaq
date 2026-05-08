export interface Persona {
  key: string;
  icon: string;
  categorySlugs: string[];
  gradient: string;
  iconColor: string;
}

export const PERSONAS: Persona[] = [
  {
    key: 'restaurant',
    icon: 'chef-hat',
    categorySlugs: ['cuisine-chaude', 'froid-refrigeration', 'mobilier', 'equipements-divers'],
    gradient: 'from-red-50 to-orange-50',
    iconColor: 'text-red-500',
  },
  {
    key: 'cafe',
    icon: 'coffee',
    categorySlugs: ['cafe-coffee', 'froid-refrigeration', 'mobilier'],
    gradient: 'from-amber-50 to-yellow-50',
    iconColor: 'text-amber-600',
  },
  {
    key: 'patisserie',
    icon: 'croissant',
    categorySlugs: ['patisserie-boulangerie', 'cuisine-chaude', 'froid-refrigeration'],
    gradient: 'from-pink-50 to-rose-50',
    iconColor: 'text-pink-500',
  },
  {
    key: 'all',
    icon: 'sparkles',
    categorySlugs: [],
    gradient: 'from-slate-50 to-slate-100',
    iconColor: 'text-brand-500',
  },
];

export const PERSONA_STORAGE_KEY = 'riwaq-persona';
