import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'terms' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('terms');

  const section3Items: string[] = t.raw('section3Items') as string[];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-8">
        {t('title')}
      </h1>

      <div className="space-y-8 text-slate-900/80 leading-relaxed">
        <section>
          <h2 className="font-heading text-xl font-semibold text-slate-900 mb-3">
            {t('section1Title')}
          </h2>
          <p>{t('section1Content')}</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-slate-900 mb-3">
            {t('section2Title')}
          </h2>
          <p>{t('section2Content')}</p>
          <div className="bg-slate-50 rounded-lg p-4 mt-3">
            <p className="font-medium text-slate-900">
              {t('section2Highlight')}
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-slate-900 mb-3">
            {t('section3Title')}
          </h2>
          <ul className="list-disc ps-6 space-y-2">
            {section3Items.map((item: string) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-slate-900 mb-3">
            {t('section4Title')}
          </h2>
          <p>{t('section4Content')}</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-slate-900 mb-3">
            {t('section5Title')}
          </h2>
          <p>{t('section5Content')}</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-slate-900 mb-3">
            {t('section6Title')}
          </h2>
          <p>{t('section6Content')}</p>
        </section>

        <p className="text-sm text-slate-500 pt-4 border-t border-slate-200">
          {t('lastUpdated')}
        </p>
      </div>
    </div>
  );
}
