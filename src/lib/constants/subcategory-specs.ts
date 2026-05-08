import { SpecFieldDefinition } from '@/lib/types';

export const SUBCATEGORY_SPECS: Record<string, SpecFieldDefinition[]> = {
  // ═══════════════════════════════════════════════════════════
  // Café & Coffee (8)
  // ═══════════════════════════════════════════════════════════
  'machine-espresso': [
    {
      key: 'automation', label: 'Type de machine', type: 'select',
      options: [
        { value: 'auto', label: 'Automatique' },
        { value: 'semi', label: 'Semi-automatique' },
        { value: 'manual', label: 'Manuelle' },
      ],
    },
    {
      key: 'group_heads', label: 'Nombre de groupes', type: 'select',
      options: [
        { value: '1', label: '1 groupe' },
        { value: '2', label: '2 groupes' },
        { value: '3', label: '3 groupes' },
        { value: '4', label: '4 groupes' },
      ],
    },
    {
      key: 'water_connection', label: 'Alimentation eau', type: 'select',
      options: [
        { value: 'direct', label: 'Branchement direct' },
        { value: 'reservoir', label: 'Réservoir' },
      ],
    },
  ],
  'moulin-cafe': [
    {
      key: 'grind_type', label: 'Type de mouture', type: 'select',
      options: [
        { value: 'on-demand', label: 'À la demande' },
        { value: 'doser', label: 'Avec doseur' },
      ],
    },
    {
      key: 'burr_type', label: 'Type de meules', type: 'select',
      options: [
        { value: 'flat', label: 'Plates' },
        { value: 'conical', label: 'Coniques' },
      ],
    },
  ],
  'percolateur': [
    { key: 'capacity', label: 'Capacité', type: 'number', unit: 'L' },
  ],
  'machine-cafe-filtre': [
    { key: 'capacity', label: 'Capacité', type: 'number', unit: 'tasses' },
    {
      key: 'carafe_type', label: 'Type de verseuse', type: 'select',
      options: [
        { value: 'glass', label: 'Verre' },
        { value: 'thermal', label: 'Thermos' },
      ],
    },
  ],
  'vitrine-patisserie-cafe': [
    {
      key: 'temperature', label: 'Température', type: 'select',
      options: [
        { value: 'ambient', label: 'Ambiante' },
        { value: 'refrigerated', label: 'Réfrigérée' },
      ],
    },
    { key: 'shelves', label: 'Nombre d\'étagères', type: 'number' },
  ],
  'blender-mixeur': [
    { key: 'capacity', label: 'Capacité', type: 'number', unit: 'L' },
  ],
  'presse-agrumes': [
    {
      key: 'automation', label: 'Type', type: 'select',
      options: [
        { value: 'manual', label: 'Manuel' },
        { value: 'auto', label: 'Automatique' },
      ],
    },
  ],
  'fontaine-boissons': [
    { key: 'tanks', label: 'Nombre de bacs', type: 'number' },
    {
      key: 'refrigerated', label: 'Réfrigérée', type: 'select',
      options: [
        { value: 'yes', label: 'Oui' },
        { value: 'no', label: 'Non' },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════
  // Cuisine chaude (12)
  // ═══════════════════════════════════════════════════════════
  'four': [
    {
      key: 'oven_type', label: 'Type de four', type: 'select',
      options: [
        { value: 'convection', label: 'Convection' },
        { value: 'combi', label: 'Mixte (combi)' },
        { value: 'deck', label: 'À sole' },
      ],
    },
    { key: 'trays', label: 'Nombre de plaques', type: 'number' },
  ],
  'friteuse': [
    {
      key: 'tanks', label: 'Nombre de bacs', type: 'select',
      options: [
        { value: '1', label: '1 bac' },
        { value: '2', label: '2 bacs' },
      ],
    },
    { key: 'capacity', label: 'Capacité', type: 'number', unit: 'L' },
  ],
  'grill-plancha': [
    {
      key: 'surface', label: 'Surface', type: 'select',
      options: [
        { value: 'flat', label: 'Lisse' },
        { value: 'ridged', label: 'Rainurée' },
        { value: 'mixed', label: 'Mixte (lisse + rainurée)' },
      ],
    },
    { key: 'width', label: 'Largeur', type: 'number', unit: 'cm' },
  ],
  'plaque-cuisson': [
    { key: 'burners', label: 'Nombre de feux', type: 'number' },
  ],
  'cuisiniere': [
    { key: 'burners', label: 'Nombre de feux', type: 'number' },
    {
      key: 'has_oven', label: 'Four intégré', type: 'select',
      options: [
        { value: 'yes', label: 'Avec four' },
        { value: 'no', label: 'Sans four' },
      ],
    },
  ],
  'bain-marie': [
    { key: 'tanks', label: 'Nombre de bacs', type: 'number' },
  ],
  'four-pizza': [
    {
      key: 'pizza_type', label: 'Type de four', type: 'select',
      options: [
        { value: 'deck', label: 'À sole' },
        { value: 'conveyor', label: 'À convoyeur' },
        { value: 'wood', label: 'À bois' },
      ],
    },
    {
      key: 'chambers', label: 'Nombre de chambres', type: 'select',
      options: [
        { value: '1', label: '1 chambre' },
        { value: '2', label: '2 chambres' },
        { value: '3', label: '3 chambres' },
      ],
    },
  ],
  'salamandre': [
    { key: 'width', label: 'Largeur', type: 'number', unit: 'cm' },
  ],
  'rotissoire': [
    { key: 'spits', label: 'Nombre de broches', type: 'number' },
  ],
  'crepiere': [
    {
      key: 'plates', label: 'Nombre de plaques', type: 'select',
      options: [
        { value: '1', label: '1 plaque' },
        { value: '2', label: '2 plaques' },
      ],
    },
    { key: 'diameter', label: 'Diamètre', type: 'number', unit: 'cm' },
  ],
  'toaster-pro': [
    {
      key: 'toaster_type', label: 'Type', type: 'select',
      options: [
        { value: 'conveyor', label: 'À convoyeur' },
        { value: 'slot', label: 'Grille-pain' },
        { value: 'salamander', label: 'Salamandre' },
      ],
    },
  ],
  'cuiseur-pates': [
    { key: 'baskets', label: 'Nombre de paniers', type: 'number' },
  ],

  // ═══════════════════════════════════════════════════════════
  // Froid & Réfrigération (9)
  // ═══════════════════════════════════════════════════════════
  'refrigerateur': [
    {
      key: 'format', label: 'Format', type: 'select',
      options: [
        { value: 'upright', label: 'Armoire' },
        { value: 'under-counter', label: 'Bas / Sous comptoir' },
        { value: 'countertop', label: 'Comptoir' },
      ],
    },
    { key: 'doors', label: 'Nombre de portes', type: 'number' },
    { key: 'capacity', label: 'Capacité', type: 'number', unit: 'L' },
  ],
  'congelateur': [
    {
      key: 'format', label: 'Format', type: 'select',
      options: [
        { value: 'chest', label: 'Bahut (coffre)' },
        { value: 'upright', label: 'Armoire' },
      ],
    },
    { key: 'capacity', label: 'Capacité', type: 'number', unit: 'L' },
  ],
  'vitrine-refrigeree': [
    {
      key: 'vitrine_type', label: 'Type', type: 'select',
      options: [
        { value: 'countertop', label: 'Sur comptoir' },
        { value: 'floor', label: 'Sur pied' },
      ],
    },
    { key: 'shelves', label: 'Nombre d\'étagères', type: 'number' },
  ],
  'machine-glacons': [
    { key: 'production', label: 'Production', type: 'number', unit: 'kg/jour' },
    {
      key: 'ice_type', label: 'Type de glaçons', type: 'select',
      options: [
        { value: 'hollow', label: 'Creux' },
        { value: 'full', label: 'Pleins' },
        { value: 'crushed', label: 'Pilée' },
      ],
    },
  ],
  'table-refrigeree': [
    { key: 'doors', label: 'Nombre de portes', type: 'number' },
    { key: 'width', label: 'Longueur', type: 'number', unit: 'cm' },
  ],
  'chambre-froide': [
    {
      key: 'cold_type', label: 'Type', type: 'select',
      options: [
        { value: 'positive', label: 'Positive (0 à +10°C)' },
        { value: 'negative', label: 'Négative (-18°C)' },
      ],
    },
    { key: 'volume', label: 'Volume', type: 'number', unit: 'm³' },
  ],
  'saladette': [
    { key: 'containers', label: 'Nombre de bacs', type: 'number' },
    { key: 'doors', label: 'Nombre de portes', type: 'number' },
  ],
  'machine-glace': [
    {
      key: 'ice_cream_type', label: 'Type', type: 'select',
      options: [
        { value: 'soft', label: 'Italienne (soft)' },
        { value: 'batch', label: 'Artisanale (batch)' },
      ],
    },
  ],
  'fontaine-eau': [
    {
      key: 'water_type', label: 'Type', type: 'select',
      options: [
        { value: 'cold', label: 'Eau froide' },
        { value: 'hot-cold', label: 'Eau froide + chaude' },
      ],
    },
    {
      key: 'connection', label: 'Alimentation', type: 'select',
      options: [
        { value: 'plumbed', label: 'Sur réseau' },
        { value: 'bottled', label: 'Sur bonbonne' },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════
  // Mobilier (9)
  // ═══════════════════════════════════════════════════════════
  'table': [
    {
      key: 'material', label: 'Matériau', type: 'select',
      options: [
        { value: 'wood', label: 'Bois' },
        { value: 'metal', label: 'Métal' },
        { value: 'marble', label: 'Marbre' },
        { value: 'other', label: 'Autre' },
      ],
    },
    {
      key: 'shape', label: 'Forme', type: 'select',
      options: [
        { value: 'round', label: 'Ronde' },
        { value: 'square', label: 'Carrée' },
        { value: 'rectangular', label: 'Rectangulaire' },
      ],
    },
    { key: 'seats', label: 'Nombre de places', type: 'number' },
  ],
  'chaise-tabouret': [
    {
      key: 'furniture_material', label: 'Matériau', type: 'select',
      options: [
        { value: 'wood', label: 'Bois' },
        { value: 'metal', label: 'Métal' },
        { value: 'plastic', label: 'Plastique' },
        { value: 'rattan', label: 'Rotin' },
      ],
    },
    {
      key: 'stackable', label: 'Empilable', type: 'select',
      options: [
        { value: 'yes', label: 'Oui' },
        { value: 'no', label: 'Non' },
      ],
    },
  ],
  'comptoir-bar': [
    {
      key: 'material', label: 'Matériau', type: 'select',
      options: [
        { value: 'inox', label: 'Inox' },
        { value: 'wood', label: 'Bois' },
        { value: 'marble', label: 'Marbre' },
        { value: 'other', label: 'Autre' },
      ],
    },
    { key: 'width', label: 'Longueur', type: 'number', unit: 'cm' },
  ],
  'etagere-rayonnage': [
    {
      key: 'material', label: 'Matériau', type: 'select',
      options: [
        { value: 'inox', label: 'Inox' },
        { value: 'other', label: 'Autre' },
      ],
    },
    { key: 'shelves', label: 'Nombre d\'étagères', type: 'number' },
  ],
  'vitrine-exposition': [
    { key: 'shelves', label: 'Nombre d\'étagères', type: 'number' },
    {
      key: 'illuminated', label: 'Éclairage', type: 'select',
      options: [
        { value: 'yes', label: 'Éclairée' },
        { value: 'no', label: 'Non éclairée' },
      ],
    },
  ],
  'banquette': [
    {
      key: 'upholstery', label: 'Revêtement', type: 'select',
      options: [
        { value: 'fabric', label: 'Tissu' },
        { value: 'faux-leather', label: 'Similicuir' },
        { value: 'leather', label: 'Cuir' },
      ],
    },
    { key: 'seats', label: 'Nombre de places', type: 'number' },
  ],
  'chariot-service': [
    { key: 'shelves', label: 'Nombre de plateaux', type: 'number' },
  ],
  'armoire-inox': [
    { key: 'doors', label: 'Nombre de portes', type: 'number' },
    { key: 'shelves', label: 'Nombre d\'étagères', type: 'number' },
  ],
  'parasol-terrasse': [
    {
      key: 'parasol_type', label: 'Type', type: 'select',
      options: [
        { value: 'parasol', label: 'Parasol' },
        { value: 'tonnelle', label: 'Tonnelle' },
        { value: 'pergola', label: 'Pergola' },
      ],
    },
    { key: 'diameter', label: 'Diamètre / Largeur', type: 'number', unit: 'm' },
  ],

  // ═══════════════════════════════════════════════════════════
  // Équipements divers (10)
  // ═══════════════════════════════════════════════════════════
  'lave-vaisselle': [
    {
      key: 'dishwasher_type', label: 'Type', type: 'select',
      options: [
        { value: 'hood', label: 'À capot' },
        { value: 'under-counter', label: 'Sous comptoir' },
        { value: 'conveyor', label: 'À convoyeur' },
      ],
    },
    { key: 'cycle_time', label: 'Durée de cycle', type: 'number', unit: 'min' },
  ],
  'hotte-extracteur': [
    {
      key: 'hood_type', label: 'Type', type: 'select',
      options: [
        { value: 'wall', label: 'Murale' },
        { value: 'island', label: 'Centrale (îlot)' },
        { value: 'compensation', label: 'Compensation' },
      ],
    },
    { key: 'width', label: 'Longueur', type: 'number', unit: 'cm' },
  ],
  'balance': [
    { key: 'max_weight', label: 'Portée max', type: 'number', unit: 'kg' },
  ],
  'trancheur': [
    { key: 'blade', label: 'Diamètre lame', type: 'number', unit: 'cm' },
    {
      key: 'automation', label: 'Type', type: 'select',
      options: [
        { value: 'manual', label: 'Manuelle' },
        { value: 'auto', label: 'Automatique' },
      ],
    },
  ],
  'caisse-enregistreuse': [
    {
      key: 'pos_type', label: 'Type', type: 'select',
      options: [
        { value: 'classic', label: 'Classique' },
        { value: 'touch', label: 'Tactile' },
        { value: 'pos', label: 'Système POS' },
      ],
    },
  ],
  'robot-coupe': [
    { key: 'capacity', label: 'Capacité', type: 'number', unit: 'L' },
  ],
  'machine-sous-vide': [
    {
      key: 'vacuum_type', label: 'Type', type: 'select',
      options: [
        { value: 'chamber', label: 'À cloche' },
        { value: 'external', label: 'Externe (barre)' },
      ],
    },
  ],
  'evier-pro': [
    {
      key: 'tanks', label: 'Nombre de bacs', type: 'select',
      options: [
        { value: '1', label: '1 bac' },
        { value: '2', label: '2 bacs' },
        { value: '3', label: '3 bacs' },
      ],
    },
  ],
  'adoucisseur-eau': [
    {
      key: 'filter_type', label: 'Type', type: 'select',
      options: [
        { value: 'salt', label: 'À sel' },
        { value: 'filter', label: 'À filtre' },
        { value: 'osmosis', label: 'Osmose inverse' },
      ],
    },
  ],
  'bac-gastro': [
    {
      key: 'gastro_size', label: 'Taille', type: 'select',
      options: [
        { value: 'GN1/1', label: 'GN 1/1' },
        { value: 'GN1/2', label: 'GN 1/2' },
        { value: 'GN1/3', label: 'GN 1/3' },
        { value: 'GN2/1', label: 'GN 2/1' },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════
  // Pâtisserie & Boulangerie (9)
  // ═══════════════════════════════════════════════════════════
  'four-patissier': [
    {
      key: 'pastry_oven_type', label: 'Type de four', type: 'select',
      options: [
        { value: 'ventilated', label: 'Ventilé' },
        { value: 'deck', label: 'À sole' },
        { value: 'rotating', label: 'Rotatif' },
      ],
    },
    { key: 'trays', label: 'Nombre de plaques', type: 'number' },
  ],
  'petrin': [
    {
      key: 'petrin_type', label: 'Type de pétrin', type: 'select',
      options: [
        { value: 'spiral', label: 'Spirale' },
        { value: 'fork', label: 'À fourche' },
        { value: 'oblique', label: 'Oblique' },
      ],
    },
    { key: 'capacity', label: 'Capacité', type: 'number', unit: 'kg' },
  ],
  'batteur': [
    { key: 'capacity', label: 'Capacité', type: 'number', unit: 'L' },
  ],
  'laminoir': [
    {
      key: 'laminoir_type', label: 'Type', type: 'select',
      options: [
        { value: 'floor', label: 'Sur pied' },
        { value: 'tabletop', label: 'De table' },
      ],
    },
    { key: 'band_width', label: 'Largeur de bande', type: 'number', unit: 'cm' },
  ],
  'chambre-de-pousse': [
    { key: 'trays', label: 'Nombre de plaques', type: 'number' },
  ],
  'diviseuse': [
    {
      key: 'diviseuse_type', label: 'Type', type: 'select',
      options: [
        { value: 'manual', label: 'Manuelle' },
        { value: 'semi-auto', label: 'Semi-automatique' },
        { value: 'hydraulic', label: 'Hydraulique' },
      ],
    },
    { key: 'portions', label: 'Nombre de portions', type: 'number' },
  ],
  'faconneuse': [
    {
      key: 'faconneuse_type', label: 'Type', type: 'select',
      options: [
        { value: 'conical', label: 'Conique' },
        { value: 'baguette', label: 'Baguetteuse' },
      ],
    },
  ],
  'cellule-refroidissement': [
    {
      key: 'cell_type', label: 'Type', type: 'select',
      options: [
        { value: 'blast-chiller', label: 'Refroidissement rapide' },
        { value: 'shock-freezer', label: 'Surgélation' },
      ],
    },
    { key: 'trays', label: 'Nombre de niveaux', type: 'number' },
  ],
  'vitrine-patisserie': [
    {
      key: 'temperature', label: 'Température', type: 'select',
      options: [
        { value: 'ambient', label: 'Ambiante' },
        { value: 'refrigerated', label: 'Réfrigérée' },
      ],
    },
    { key: 'shelves', label: 'Nombre d\'étagères', type: 'number' },
  ],
};

export function getSpecsForSubcategory(slug?: string): SpecFieldDefinition[] {
  if (!slug) return [];
  return SUBCATEGORY_SPECS[slug] || [];
}

export function getSpecDisplayValue(field: SpecFieldDefinition, value: string | number): string {
  if (field.type === 'select' && field.options) {
    const option = field.options.find((o) => o.value === String(value));
    if (option) return option.label;
  }
  if (field.type === 'number' && field.unit) {
    return `${value} ${field.unit}`;
  }
  return String(value);
}
