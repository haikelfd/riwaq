/**
 * Maps brand names, product nicknames, and common search terms
 * to broader category/subcategory keywords for fallback search.
 * Keys are lowercased. Values are arrays of expansion terms.
 */
const SEARCH_SYNONYMS: Record<string, string[]> = {
  // Brand → product type
  'nespresso': ['machine cafe', 'cafe', 'capsule'],
  'delonghi': ['machine cafe', 'machine espresso', 'cafe'],
  'la cimbali': ['machine espresso', 'cafe', 'moulin'],
  'bezzera': ['machine espresso', 'cafe'],
  'mazzer': ['moulin cafe', 'moulin', 'cafe'],
  'rancilio': ['machine espresso', 'cafe'],
  'faema': ['machine espresso', 'cafe'],
  'la marzocco': ['machine espresso', 'cafe'],
  'nuova simonelli': ['machine espresso', 'cafe'],
  'rational': ['four', 'four professionnel', 'combi'],
  'unox': ['four', 'four patissier', 'four convection'],
  'robot coupe': ['robot coupe', 'cutter', 'blender'],
  'santos': ['presse agrumes', 'blender', 'cafe'],
  'diamond': ['four', 'friteuse', 'grill'],
  'winterhalter': ['lave vaisselle', 'lavage'],
  'hoshizaki': ['machine glacons', 'glace', 'froid'],
  'irinox': ['cellule refroidissement', 'froid'],
  'vitamix': ['blender', 'mixeur'],
  'kitchen aid': ['batteur', 'mixeur', 'patisserie'],
  'brema': ['machine glacons', 'glace'],

  // Colloquial / product nicknames
  'pizza': ['four pizza', 'four'],
  'glace': ['machine glace', 'machine glacons', 'congelateur', 'froid'],
  'glacons': ['machine glacons', 'froid'],
  'expresso': ['machine espresso', 'machine cafe', 'cafe'],
  'cappuccino': ['machine espresso', 'machine cafe', 'cafe'],
  'pain': ['four patissier', 'petrin', 'boulangerie'],
  'croissant': ['four patissier', 'laminoir', 'patisserie'],
  'shawarma': ['rotissoire', 'grill', 'cuisine chaude'],
  'tacos': ['grill', 'plancha', 'cuisine chaude'],
  'crepe': ['crepiere', 'cuisine chaude'],
  'jus': ['presse agrumes', 'blender', 'mixeur'],
  'vaisselle': ['lave vaisselle', 'evier'],
  'congelation': ['congelateur', 'chambre froide', 'froid'],
  'vitrine': ['vitrine refrigeree', 'vitrine patisserie', 'vitrine exposition'],
  'mixeur': ['blender', 'mixeur', 'robot coupe'],
  'batteur': ['batteur', 'petrin', 'patisserie'],
  'inox': ['table', 'etagere', 'armoire inox', 'bac gastro'],
};

/**
 * Look up synonym expansions for a search term.
 * Checks for exact match first, then checks if any synonym key
 * is contained within the search term or vice versa.
 */
export function getSearchExpansions(term: string): string[] | null {
  const normalized = term.toLowerCase().trim();

  // Exact match
  if (SEARCH_SYNONYMS[normalized]) {
    return SEARCH_SYNONYMS[normalized];
  }

  // Check if the search term contains a known key or vice versa
  for (const [key, expansions] of Object.entries(SEARCH_SYNONYMS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return expansions;
    }
  }

  return null;
}
