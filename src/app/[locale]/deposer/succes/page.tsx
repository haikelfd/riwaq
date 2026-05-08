'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import SuccessIllustration from '@/components/forms/SuccessIllustration';

function SuccessContent() {
  const t = useTranslations('success');
  const tc = useTranslations('common');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const id = searchParams.get('id');
  const profileToken = searchParams.get('profileToken');

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const manageUrl = token ? `${origin}/gerer/${token}` : null;
  const profileUrl = profileToken ? `${origin}/profil/${profileToken}` : null;

  return (
    <div className="min-h-[80vh] flex flex-col">
      {/* Hero section with illustration */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500/10 via-transparent to-accent-500/5" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative max-w-2xl mx-auto px-4 pt-12 pb-6 text-center">
          {/* Badge */}
          <div className="success-content-enter success-content-enter-1 inline-flex items-center gap-2 bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {t('badge')}
          </div>

          {/* Title */}
          <h1 className="success-content-enter success-content-enter-1 font-heading text-3xl sm:text-4xl font-bold text-white mb-3">
            {t('title')}
          </h1>
          <p className="success-content-enter success-content-enter-2 text-slate-400 mb-8 max-w-md mx-auto">
            {t('subtitle')}
          </p>

          {/* Illustration */}
          <div className="max-w-sm mx-auto">
            <SuccessIllustration />
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="flex-1 bg-background">
        <div className="max-w-xl mx-auto px-4 -mt-4 relative z-10 pb-16">
          {/* Cards */}
          <div className="space-y-4">
            {manageUrl && (
              <div className="success-content-enter success-content-enter-3 bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 p-6 text-start">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900 text-sm">{t('manageLinkTitle')}</h2>
                    <p className="text-xs text-slate-500">{t('manageLinkSubtitle')}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  {t('manageLinkDesc')}
                </p>
                <div className="bg-slate-50 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 break-all font-mono">
                  {manageUrl}
                </div>
              </div>
            )}

            {profileUrl && (
              <div className="success-content-enter success-content-enter-3 bg-white rounded-2xl border border-accent-200 shadow-lg shadow-accent-100/50 p-6 text-start">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-accent-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 text-accent-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900 text-sm">{t('profileCreated')}</h2>
                    <p className="text-xs text-slate-500">{t('profileManage')}</p>
                  </div>
                </div>
                <div className="bg-accent-50 rounded-lg border border-accent-200 px-3 py-2.5 text-sm text-slate-900 break-all font-mono">
                  {profileUrl}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="success-content-enter success-content-enter-4 flex flex-col sm:flex-row gap-3 justify-center mt-8">
            {id && (
              <Link href={`/annonce/${id}`}>
                <Button variant="primary">{t('viewListing')}</Button>
              </Link>
            )}
            <Link href="/deposer">
              <Button variant="outline">{t('postAnother')}</Button>
            </Link>
            <Link href="/annonces">
              <Button variant="ghost">{t('browseListings')}</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  const tc = useTranslations('common');
  return (
    <Suspense fallback={<div className="text-center py-16 text-slate-500">{tc('loading')}</div>}>
      <SuccessContent />
    </Suspense>
  );
}
