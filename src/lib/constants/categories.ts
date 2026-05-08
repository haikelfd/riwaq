import { Category } from '@/lib/types';

export const CATEGORIES: Omit<Category, 'id'>[] = [
  {
    name: 'Café & Coffee',
    name_ar: 'قهوة ومعدات المقاهي',
    slug: 'cafe-coffee',
    icon: 'coffee',
    sort_order: 1,
  },
  {
    name: 'Cuisine chaude',
    name_ar: 'معدات الطبخ',
    slug: 'cuisine-chaude',
    icon: 'flame',
    sort_order: 2,
  },
  {
    name: 'Froid & Réfrigération',
    name_ar: 'تبريد وتجميد',
    slug: 'froid-refrigeration',
    icon: 'snowflake',
    sort_order: 3,
  },
  {
    name: 'Meubles & Agencement',
    name_ar: 'أثاث',
    slug: 'mobilier',
    icon: 'chair',
    sort_order: 4,
  },
  {
    name: 'Équipements divers',
    name_ar: 'معدات متنوعة',
    slug: 'equipements-divers',
    icon: 'wrench',
    sort_order: 5,
  },
  {
    name: 'Pâtisserie & Boulangerie',
    name_ar: 'حلويات ومخابز',
    slug: 'patisserie-boulangerie',
    icon: 'croissant',
    sort_order: 6,
  },
];
