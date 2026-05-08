import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gmprcjeynimadvewryfb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtcHJjamV5bmltYWR2ZXdyeWZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDc1ODAzMCwiZXhwIjoyMDg2MzM0MDMwfQ.oZdFR_pLMeS86sUmQ5q0FrmSXK3DBwYqEBDlmt8L7dw'
);

async function main() {
  // 1. Fetch categories and locations
  const { data: categories } = await supabase.from('categories').select('id, slug');
  const { data: locations } = await supabase.from('locations').select('id, slug');

  if (!categories || !locations) {
    console.error('Failed to fetch categories or locations');
    process.exit(1);
  }

  const cat = (slug) => categories.find((c) => c.slug === slug)?.id;
  const loc = (slug) => locations.find((l) => l.slug === slug)?.id;

  console.log('Categories:', categories.map(c => c.slug).join(', '));
  console.log('Locations:', locations.length, 'found');

  // 2. Delete all existing listings and their images
  console.log('\nDeleting existing listings...');
  const { data: existingListings } = await supabase.from('listings').select('id');
  if (existingListings && existingListings.length > 0) {
    const ids = existingListings.map(l => l.id);
    await supabase.from('listing_images').delete().in('listing_id', ids);
    await supabase.from('listings').delete().in('id', ids);
    console.log(`Deleted ${existingListings.length} existing listings`);
  } else {
    console.log('No existing listings to delete');
  }

  // 3. Prepare dummy listings across all categories
  const dummyListings = [
    // === Café & Coffee (6 listings) ===
    {
      title: 'Machine espresso La Cimbali M26 — 2 groupes',
      description: 'Machine professionnelle en excellent état, révisée en 2024. Parfaite pour café ou restaurant à fort débit. Livraison possible sur Tunis.',
      price: 8500,
      condition: 'occasion',
      category_id: cat('cafe-coffee'),
      location_id: loc('tunis'),
      phone: '71234567',
      seller_name: 'Ahmed Ben Ali',
      brand: 'La Cimbali',
      model: 'M26',
      year: 2020,
      energy_type: 'electrique',
      delivery_type: 'livraison',
    },
    {
      title: 'Moulin à café Mazzer Major — automatique',
      description: 'Moulin doser automatique, meules plates 83mm. Idéal pour un usage intensif. Très peu utilisé.',
      price: 2800,
      condition: 'occasion',
      category_id: cat('cafe-coffee'),
      location_id: loc('sfax'),
      phone: '74567890',
      seller_name: 'Karim Sfaxi',
      brand: 'Mazzer',
      model: 'Major',
      year: 2022,
      energy_type: 'electrique',
      delivery_type: 'sur_place',
    },
    {
      title: 'Blender professionnel Vitamix — neuf',
      description: 'Blender haute puissance pour smoothies, soupes, sauces. Garantie constructeur 2 ans. Jamais déballé.',
      price: 3200,
      condition: 'neuf',
      category_id: cat('cafe-coffee'),
      location_id: loc('sousse'),
      phone: '73456789',
      seller_name: 'Nadia Hammami',
      brand: 'Vitamix',
      model: 'Quiet One',
      energy_type: 'electrique',
      delivery_type: 'livraison_nationale',
    },
    {
      title: 'Machine à café filtre Bravilor — grande capacité',
      description: 'Percolateur professionnel, capacité 40 tasses. Parfait pour hôtel, salle de conférence ou grand café.',
      price: 1200,
      condition: 'occasion',
      category_id: cat('cafe-coffee'),
      location_id: loc('nabeul'),
      phone: '72345678',
      seller_name: 'Sami Nabeuli',
      brand: 'Bravilor',
      model: 'Mondo',
      year: 2019,
      energy_type: 'electrique',
      delivery_type: 'sur_place',
    },
    {
      title: 'Presse-agrumes Santos n°10 — inox',
      description: 'Presse-agrumes automatique professionnel. Jus frais en continu. Idéal pour bar à jus ou café.',
      price: 950,
      condition: 'occasion',
      category_id: cat('cafe-coffee'),
      location_id: loc('ariana'),
      phone: '71987654',
      seller_name: 'Leila Ariana',
      brand: 'Santos',
      model: 'N°10',
      year: 2021,
      energy_type: 'electrique',
      delivery_type: 'livraison',
    },
    {
      title: 'Vitrine pâtisserie réfrigérée 1m20 — LED',
      description: 'Vitrine d\'exposition pour pâtisseries et viennoiseries. Éclairage LED, thermostat digital. Vendue cause fermeture.',
      price: 4500,
      condition: 'occasion',
      category_id: cat('cafe-coffee'),
      location_id: loc('monastir'),
      phone: '73654321',
      seller_name: 'Youssef Monastiri',
      brand: 'Tecfrigo',
      model: 'Splendid 120',
      year: 2021,
      energy_type: 'electrique',
      delivery_type: 'sur_place',
    },

    // === Cuisine chaude (6 listings) ===
    {
      title: 'Four professionnel Rational SCC 10 niveaux',
      description: 'Four mixte vapeur/convection, 10 niveaux GN 1/1. Écran tactile, nettoyage automatique. État impeccable.',
      price: 25000,
      condition: 'occasion',
      category_id: cat('cuisine-chaude'),
      location_id: loc('tunis'),
      phone: '71112233',
      seller_name: 'Restaurant Le Gourmet',
      brand: 'Rational',
      model: 'SCC WE 101',
      year: 2021,
      energy_type: 'electrique',
      delivery_type: 'sur_place',
    },
    {
      title: 'Friteuse double bac gaz — 2x10L',
      description: 'Friteuse professionnelle gaz, deux bacs de 10 litres chacun. Thermostat réglable. Idéale pour restaurant ou fast-food.',
      price: 1800,
      condition: 'occasion',
      category_id: cat('cuisine-chaude'),
      location_id: loc('bizerte'),
      phone: '72998877',
      seller_name: 'Mehdi Bizerte',
      brand: 'Angelo Po',
      model: 'FG2',
      year: 2020,
      energy_type: 'gaz',
      delivery_type: 'sur_place',
    },
    {
      title: 'Grill à charbon professionnel — inox 120cm',
      description: 'Grill charbon en acier inoxydable, largeur 120cm. Grille réglable en hauteur. Parfait pour grillades et méchoui.',
      price: 3500,
      condition: 'neuf',
      category_id: cat('cuisine-chaude'),
      location_id: loc('gabes'),
      phone: '75123456',
      seller_name: 'Fournisseur du Sud',
      delivery_type: 'livraison_nationale',
    },
    {
      title: 'Plaque de cuisson induction 4 foyers',
      description: 'Plaque à induction professionnelle, 4 zones de cuisson. Économique et puissante. Garantie encore valide.',
      price: 4200,
      condition: 'neuf',
      category_id: cat('cuisine-chaude'),
      location_id: loc('sousse'),
      phone: '73789012',
      seller_name: 'Équipement Pro Sousse',
      brand: 'Bartscher',
      model: 'IK 40/4',
      energy_type: 'electrique',
      delivery_type: 'livraison',
    },
    {
      title: 'Four à pizza à bois — capacité 8 pizzas',
      description: 'Four à pizza traditionnel à bois, sole réfractaire. Capacité 8 pizzas de 30cm. Ambiance authentique garantie.',
      price: 12000,
      condition: 'occasion',
      category_id: cat('cuisine-chaude'),
      location_id: loc('ben-arous'),
      phone: '71445566',
      seller_name: 'Pizzeria Bella',
      year: 2019,
      delivery_type: 'sur_place',
    },
    {
      title: 'Rôtissoire électrique 16 poulets',
      description: 'Rôtissoire professionnelle, capacité 16 poulets. 4 broches tournantes. Éclairage intérieur. Peu utilisée.',
      price: 6500,
      condition: 'occasion',
      category_id: cat('cuisine-chaude'),
      location_id: loc('kairouan'),
      phone: '77123456',
      seller_name: 'Boucherie El Baraka',
      brand: 'Roller Grill',
      model: 'RBE 160',
      year: 2022,
      energy_type: 'electrique',
      delivery_type: 'livraison',
    },

    // === Froid & Réfrigération (5 listings) ===
    {
      title: 'Réfrigérateur vitré 2 portes — inox',
      description: 'Réfrigérateur professionnel 2 portes vitrées, capacité 1200L. Éclairage LED, dégivrage automatique.',
      price: 5500,
      condition: 'occasion',
      category_id: cat('froid-refrigeration'),
      location_id: loc('tunis'),
      phone: '71334455',
      seller_name: 'Hôtel Les Jasmins',
      brand: 'Liebherr',
      model: 'FKvsl 4113',
      year: 2020,
      energy_type: 'electrique',
      delivery_type: 'sur_place',
    },
    {
      title: 'Machine à glaçons 80kg/jour — Brema',
      description: 'Machine à glaçons professionnelle, production 80kg/24h. Glaçons creux. Raccordement eau directe.',
      price: 3800,
      condition: 'occasion',
      category_id: cat('froid-refrigeration'),
      location_id: loc('sfax'),
      phone: '74112233',
      seller_name: 'Café Central Sfax',
      brand: 'Brema',
      model: 'CB 840',
      year: 2021,
      energy_type: 'electrique',
      delivery_type: 'livraison',
    },
    {
      title: 'Table réfrigérée 3 portes — plan de travail inox',
      description: 'Table réfrigérée professionnelle, 3 portes, dessus inox. Température 0°C à +8°C. Idéale pour cuisine de restaurant.',
      price: 4200,
      condition: 'occasion',
      category_id: cat('froid-refrigeration'),
      location_id: loc('monastir'),
      phone: '73445566',
      seller_name: 'Restaurant La Médina',
      brand: 'Coldline',
      model: 'TS17/1MJ',
      year: 2022,
      energy_type: 'electrique',
      delivery_type: 'sur_place',
    },
    {
      title: 'Congélateur coffre 500L — neuf',
      description: 'Congélateur coffre professionnel grande capacité. Température -18°C à -24°C. Idéal pour stockage viandes et poissons.',
      price: 2800,
      condition: 'neuf',
      category_id: cat('froid-refrigeration'),
      location_id: loc('manouba'),
      phone: '71556677',
      seller_name: 'ElectroPro Tunisie',
      brand: 'Liebherr',
      model: 'GTP 4656',
      energy_type: 'electrique',
      delivery_type: 'livraison_nationale',
    },
    {
      title: 'Vitrine réfrigérée à sushi 1m50',
      description: 'Vitrine réfrigérée spéciale sushi et poissons, 1m50 de long. Éclairage LED. Parfait état.',
      price: 6000,
      condition: 'occasion',
      category_id: cat('froid-refrigeration'),
      location_id: loc('ariana'),
      phone: '71778899',
      seller_name: 'Sushi Zen Tunis',
      brand: 'Hoshizaki',
      model: 'HNC-150',
      year: 2023,
      energy_type: 'electrique',
      delivery_type: 'sur_place',
    },

    // === Mobilier (5 listings) ===
    {
      title: 'Lot 10 tables restaurant — bois massif',
      description: 'Lot de 10 tables en bois massif, plateau 80x80cm. Pieds métal noir. Style moderne et élégant. Prix pour le lot.',
      price: 3500,
      condition: 'occasion',
      category_id: cat('mobilier'),
      location_id: loc('tunis'),
      phone: '71223344',
      seller_name: 'Restaurant Le Baroque',
      delivery_type: 'sur_place',
    },
    {
      title: 'Comptoir bar en bois et zinc — 3m',
      description: 'Magnifique comptoir de bar en bois avec dessus zinc, longueur 3 mètres. Style traditionnel. Démontable.',
      price: 7000,
      condition: 'occasion',
      category_id: cat('mobilier'),
      location_id: loc('sousse'),
      phone: '73112233',
      seller_name: 'Bar Le Capitole',
      year: 2018,
      delivery_type: 'sur_place',
    },
    {
      title: 'Lot 30 chaises empilables — terrasse',
      description: 'Lot de 30 chaises empilables en polypropylène, coloris blanc. Résistantes aux UV. Parfaites pour terrasse.',
      price: 2400,
      condition: 'neuf',
      category_id: cat('mobilier'),
      location_id: loc('nabeul'),
      phone: '72667788',
      seller_name: 'Équipement Terrasse',
      delivery_type: 'livraison_nationale',
    },
    {
      title: 'Étagère inox 4 niveaux — cuisine pro',
      description: 'Étagère en acier inoxydable, 4 niveaux réglables. Dimensions 180x50x180cm. Charge max 200kg par niveau.',
      price: 450,
      condition: 'neuf',
      category_id: cat('mobilier'),
      location_id: loc('ben-arous'),
      phone: '71889900',
      seller_name: 'Inox Tunisie',
      delivery_type: 'livraison',
    },
    {
      title: 'Banquettes restaurant cuir synthétique — lot de 6',
      description: 'Lot de 6 banquettes en cuir synthétique marron, longueur 1m20 chacune. Confortables et en bon état.',
      price: 1800,
      condition: 'occasion',
      category_id: cat('mobilier'),
      location_id: loc('sfax'),
      phone: '74334455',
      seller_name: 'Restaurant El Firma',
      year: 2020,
      delivery_type: 'sur_place',
    },

    // === Équipements divers (4 listings) ===
    {
      title: 'Lave-vaisselle professionnel à capot — Winterhalter',
      description: 'Lave-vaisselle à capot, cycle 60 secondes. Pompe de vidange intégrée. Révisé récemment.',
      price: 8000,
      condition: 'occasion',
      category_id: cat('equipements-divers'),
      location_id: loc('tunis'),
      phone: '71445577',
      seller_name: 'Grand Hôtel Tunis',
      brand: 'Winterhalter',
      model: 'PT-L',
      year: 2021,
      energy_type: 'electrique',
      delivery_type: 'sur_place',
    },
    {
      title: 'Trancheuse professionnelle 300mm — jambon & charcuterie',
      description: 'Trancheuse électrique lame 300mm, affûteur intégré. Coupe fine et précise. Idéale charcuterie ou traiteur.',
      price: 1500,
      condition: 'occasion',
      category_id: cat('equipements-divers'),
      location_id: loc('bizerte'),
      phone: '72556677',
      seller_name: 'Charcuterie du Port',
      brand: 'Berkel',
      model: 'Red Line 300',
      year: 2022,
      energy_type: 'electrique',
      delivery_type: 'livraison',
    },
    {
      title: 'Caisse enregistreuse tactile — système complet',
      description: 'Caisse enregistreuse avec écran tactile 15 pouces, tiroir-caisse, imprimante ticket. Logiciel restaurant inclus.',
      price: 2500,
      condition: 'occasion',
      category_id: cat('equipements-divers'),
      location_id: loc('sousse'),
      phone: '73998877',
      seller_name: 'Tech Resto Sousse',
      year: 2023,
      energy_type: 'electrique',
      delivery_type: 'livraison_nationale',
    },
    {
      title: 'Hotte professionnelle inox 2m — avec moteur',
      description: 'Hotte murale en inox, longueur 2m. Moteur extracteur inclus. Filtres à graisse inox lavables.',
      price: 3200,
      condition: 'neuf',
      category_id: cat('equipements-divers'),
      location_id: loc('kairouan'),
      phone: '77445566',
      seller_name: 'Ventilation Pro',
      energy_type: 'electrique',
      delivery_type: 'livraison',
    },

    // === Pâtisserie & Boulangerie (5 listings) ===
    {
      title: 'Pétrin spirale 60L — boulangerie',
      description: 'Pétrin à spirale professionnel, cuve 60 litres inox. 2 vitesses. Capacité 25kg de farine. Idéal boulangerie artisanale.',
      price: 5500,
      condition: 'occasion',
      category_id: cat('patisserie-boulangerie'),
      location_id: loc('sfax'),
      phone: '74778899',
      seller_name: 'Boulangerie El Medina',
      brand: 'Diosna',
      model: 'SP 60',
      year: 2020,
      energy_type: 'electrique',
      delivery_type: 'sur_place',
    },
    {
      title: 'Four pâtissier ventilé 10 niveaux — neuf',
      description: 'Four à convection pâtissier, 10 niveaux 600x400mm. Humidificateur intégré. Parfait pour viennoiseries et gâteaux.',
      price: 9500,
      condition: 'neuf',
      category_id: cat('patisserie-boulangerie'),
      location_id: loc('tunis'),
      phone: '71667788',
      seller_name: 'Pâtisserie Moderne',
      brand: 'UNOX',
      model: 'XEFT-10EU',
      energy_type: 'electrique',
      delivery_type: 'livraison',
    },
    {
      title: 'Laminoir à pâte 500mm — de table',
      description: 'Laminoir professionnel de table, rouleaux 500mm. Réglage épaisseur précis. Pour pâte feuilletée, croissants, pizza.',
      price: 3800,
      condition: 'occasion',
      category_id: cat('patisserie-boulangerie'),
      location_id: loc('monastir'),
      phone: '73556677',
      seller_name: 'Pâtisserie Royale',
      brand: 'Rondo',
      model: 'STM 500',
      year: 2021,
      energy_type: 'electrique',
      delivery_type: 'sur_place',
    },
    {
      title: 'Batteur mélangeur 20L — Kitchen Aid Pro',
      description: 'Batteur professionnel 20 litres, 3 accessoires (fouet, crochet, feuille). Puissant et silencieux.',
      price: 2200,
      condition: 'occasion',
      category_id: cat('patisserie-boulangerie'),
      location_id: loc('ariana'),
      phone: '71990011',
      seller_name: 'Pâtisserie Fleur de Lys',
      brand: 'KitchenAid',
      model: 'KSM7990',
      year: 2022,
      energy_type: 'electrique',
      delivery_type: 'livraison',
    },
    {
      title: 'Chambre de pousse contrôlée — 2 chariots',
      description: 'Chambre de fermentation contrôlée pour 2 chariots. Température et humidité programmables. Indispensable pour boulangerie.',
      price: 11000,
      condition: 'occasion',
      category_id: cat('patisserie-boulangerie'),
      location_id: loc('manouba'),
      phone: '71223355',
      seller_name: 'Boulangerie Traditionnelle',
      brand: 'Pavailler',
      model: 'CF 682',
      year: 2019,
      energy_type: 'electrique',
      delivery_type: 'sur_place',
    },
  ];

  // 4. Insert listings with staggered created_at dates
  console.log(`\nInserting ${dummyListings.length} dummy listings...`);

  const now = Date.now();
  let successCount = 0;

  for (let i = 0; i < dummyListings.length; i++) {
    const listing = dummyListings[i];
    // Stagger creation dates: most recent first, spread over last 14 days
    const hoursAgo = i * 10 + Math.floor(Math.random() * 8);
    const createdAt = new Date(now - hoursAgo * 3600000).toISOString();

    const { error } = await supabase.from('listings').insert({
      ...listing,
      status: 'active',
      created_at: createdAt,
    });

    if (error) {
      console.error(`  ✗ Failed: ${listing.title}`, error.message);
    } else {
      successCount++;
      console.log(`  ✓ ${listing.title}`);
    }
  }

  console.log(`\nDone! Inserted ${successCount}/${dummyListings.length} listings.`);
}

main().catch(console.error);
