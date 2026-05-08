import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-8">
        {t('title')}
      </h1>

      <div className="prose prose-slate max-w-none space-y-6 text-slate-900/80 leading-relaxed">
        <p>{t.rich('intro1', { strong: (chunks) => <strong>{chunks}</strong> })}</p>
        <p>{t('intro2')}</p>
        <p>{t('intro3')}</p>

        <h2 className="font-heading text-xl font-semibold text-slate-900 mt-8">{t('philosophyTitle')}</h2>

        <ul className="list-disc ps-6 space-y-2">
          <li>
            <strong>{t('philo1Title')}</strong> {t('philo1Desc')}
          </li>
          <li>
            <strong>{t('philo2Title')}</strong> {t('philo2Desc')}
          </li>
          <li>
            <strong>{t('philo3Title')}</strong> {t('philo3Desc')}
          </li>
          <li>
            <strong>{t('philo4Title')}</strong> {t('philo4Desc')}
          </li>
        </ul>

        <h2 className="font-heading text-xl font-semibold text-slate-900 mt-8">{t('missingSpaceTitle')}</h2>

        <p>{t('missingSpace')}</p>

        <p className="text-slate-500 italic">
          {t('quote')}
        </p>
      </div>
    </div>
  );
}
