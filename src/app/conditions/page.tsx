import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: "Conditions d'utilisation et mentions légales de Riwaq.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-8">
        Conditions d&apos;utilisation
      </h1>

      <div className="space-y-8 text-slate-900/80 leading-relaxed">
        <section>
          <h2 className="font-heading text-xl font-semibold text-slate-900 mb-3">
            1. Présentation du service
          </h2>
          <p>
            Riwaq est une plateforme d&apos;annonces en ligne dédiée au matériel professionnel de
            restaurant et café en Tunisie. Le service permet aux utilisateurs de publier et de
            consulter des annonces gratuitement.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-slate-900 mb-3">
            2. Rôle de la plateforme
          </h2>
          <p>
            Riwaq agit uniquement en tant que plateforme de mise en relation. Riwaq ne participe
            pas aux transactions entre acheteurs et vendeurs, et ne peut être tenu responsable
            de la qualité des biens, des prix, ou du comportement des utilisateurs.
          </p>
          <div className="bg-slate-50 rounded-lg p-4 mt-3">
            <p className="font-medium text-slate-900">
              Les transactions sont sous l&apos;entière responsabilité des utilisateurs.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-slate-900 mb-3">
            3. Publication d&apos;annonces
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Les annonces doivent concerner du matériel professionnel de restaurant ou café.</li>
            <li>Les informations publiées doivent être exactes et honnêtes.</li>
            <li>Les contenus illégaux, offensants ou frauduleux sont interdits.</li>
            <li>Riwaq se réserve le droit de supprimer toute annonce sans préavis.</li>
            <li>Les annonces expirent automatiquement après 30 jours.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-slate-900 mb-3">
            4. Données personnelles
          </h2>
          <p>
            Les seules informations collectées sont celles que vous fournissez dans votre annonce
            (numéro de téléphone, nom optionnel). Ces informations sont visibles publiquement
            sur votre annonce. Riwaq ne vend ni ne partage vos données avec des tiers.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-slate-900 mb-3">
            5. Responsabilité
          </h2>
          <p>
            Riwaq n&apos;offre aucune garantie sur les produits listés. Les utilisateurs sont
            responsables de vérifier la qualité et l&apos;authenticité des biens avant tout achat.
            Riwaq recommande de toujours vérifier le matériel en personne avant de conclure
            une transaction.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-slate-900 mb-3">
            6. Modification des conditions
          </h2>
          <p>
            Riwaq se réserve le droit de modifier ces conditions à tout moment. Les modifications
            prennent effet dès leur publication sur cette page.
          </p>
        </section>

        <p className="text-sm text-slate-500 pt-4 border-t border-slate-200">
          Dernière mise à jour : Février 2026
        </p>
      </div>
    </div>
  );
}
