import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Button from '@/components/ui/Button';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <h1 className="font-heading text-6xl font-bold text-slate-900 mb-4">{t('title')}</h1>
      <p className="text-lg text-slate-500 mb-8">
        {t('message')}
      </p>
      <Link href="/">
        <Button>{t('backHome')}</Button>
      </Link>
    </div>
  );
}
