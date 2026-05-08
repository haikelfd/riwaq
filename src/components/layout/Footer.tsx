'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-heading font-bold text-base leading-none">R</span>
              </div>
              <span className="font-heading text-lg font-bold text-white tracking-tight">
                Riwaq
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              {t('tagline')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-medium text-white mb-4 text-sm">{t('navigation')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/annonces" className="hover:text-white transition-colors">
                  {t('browse')}
                </Link>
              </li>
              <li>
                <Link href="/deposer" className="hover:text-white transition-colors">
                  {t('postListing')}
                </Link>
              </li>
              <li>
                <Link href="/tarifs" className="hover:text-white transition-colors">
                  {t('pricing')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-medium text-white mb-4 text-sm">{t('categories')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/categorie/cafe-coffee" className="hover:text-white transition-colors">{t('cafeCoffee')}</Link></li>
              <li><Link href="/categorie/cuisine-chaude" className="hover:text-white transition-colors">{t('hotKitchen')}</Link></li>
              <li><Link href="/categorie/froid-refrigeration" className="hover:text-white transition-colors">{t('refrigeration')}</Link></li>
              <li><Link href="/categorie/mobilier" className="hover:text-white transition-colors">{t('furniture')}</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-medium text-white mb-4 text-sm">{t('info')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/a-propos" className="hover:text-white transition-colors">{t('about')}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{t('contact')}</Link></li>
              <li><Link href="/conditions" className="hover:text-white transition-colors">{t('terms')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="text-xs text-slate-600">
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
}
