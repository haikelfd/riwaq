import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Découvrez Riwaq, la plateforme tunisienne dédiée au matériel professionnel de restaurant et café.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-8">
        À propos de Riwaq
      </h1>

      <div className="prose prose-slate max-w-none space-y-6 text-slate-900/80 leading-relaxed">
        <p>
          <strong className="text-slate-900">Riwaq</strong> — le mot signifie un passage couvert, un corridor
          où les gens se croisent, s&apos;arrêtent, échangent. C&apos;est exactement ce que nous avons voulu créer :
          un espace simple et calme où les professionnels de la restauration en Tunisie peuvent trouver
          et vendre du matériel.
        </p>

        <p>
          Si vous êtes propriétaire d&apos;un café, d&apos;un restaurant, d&apos;un fast-food ou d&apos;une pâtisserie,
          vous savez à quel point il est difficile de trouver du matériel professionnel d&apos;occasion.
          Les groupes Facebook sont chaotiques, les plateformes généralistes sont bruyantes,
          et Google ne vous aide pas toujours.
        </p>

        <p>
          Riwaq résout ce problème en offrant une plateforme dédiée, où chaque annonce concerne
          du matériel professionnel de restaurant et café. Pas de bruit, pas de distraction —
          juste ce que vous cherchez.
        </p>

        <h2 className="font-heading text-xl font-semibold text-slate-900 mt-8">Notre philosophie</h2>

        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Simplicité avant tout.</strong> Pas de compte obligatoire, pas de vérification
            complexe. Publiez votre annonce en quelques minutes.
          </li>
          <li>
            <strong>Contact direct.</strong> Appelez ou envoyez un message WhatsApp directement
            au vendeur. Pas d&apos;intermédiaire.
          </li>
          <li>
            <strong>Zéro frais.</strong> Riwaq est gratuit pour les utilisateurs. Pas de commission,
            pas de frais cachés.
          </li>
          <li>
            <strong>Fait pour la Tunisie.</strong> Conçu pour les professionnels tunisiens,
            avec les villes et les habitudes locales en tête.
          </li>
        </ul>

        <h2 className="font-heading text-xl font-semibold text-slate-900 mt-8">Un espace qui manquait</h2>

        <p>
          Riwaq n&apos;est pas une marketplace généraliste. C&apos;est un espace dédié, pensé pour
          une communauté précise. Comme un riwaq dans la médina : un endroit où l&apos;on passe,
          on regarde, on trouve ce qu&apos;on cherche.
        </p>

        <p className="text-slate-500 italic">
          &quot;Un endroit qui manquait, mais qui existe maintenant.&quot;
        </p>
      </div>
    </div>
  );
}
