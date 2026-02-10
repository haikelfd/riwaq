'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

function SuccessContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const id = searchParams.get('id');
  const profileToken = searchParams.get('profileToken');

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const manageUrl = token ? `${origin}/gerer/${token}` : null;
  const profileUrl = profileToken ? `${origin}/profil/${profileToken}` : null;

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="font-heading text-3xl font-bold text-slate-900 mb-3">
        Annonce publiée !
      </h1>
      <p className="text-slate-500 mb-8">
        Votre annonce est maintenant visible sur Riwaq.
      </p>

      {manageUrl && (
        <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
          <h2 className="font-medium text-slate-900 mb-2 text-sm">
            Lien de gestion (conservez-le !)
          </h2>
          <p className="text-xs text-slate-500 mb-3">
            Ce lien vous permet de modifier ou supprimer votre annonce. Gardez-le précieusement.
          </p>
          <div className="bg-white rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 break-all font-mono">
            {manageUrl}
          </div>
        </div>
      )}

      {profileUrl && (
        <div className="bg-brand-50 rounded-xl p-6 mb-8 text-left">
          <h2 className="font-medium text-slate-900 mb-2 text-sm">
            Profil vendeur créé !
          </h2>
          <p className="text-xs text-slate-500 mb-3">
            Votre profil vendeur a été créé. Ce lien vous permet de le gérer et de retrouver toutes vos annonces.
          </p>
          <div className="bg-white rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 break-all font-mono">
            {profileUrl}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {id && (
          <Link href={`/annonce/${id}`}>
            <Button variant="primary">Voir mon annonce</Button>
          </Link>
        )}
        <Link href="/annonces">
          <Button variant="outline">Parcourir les annonces</Button>
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-slate-500">Chargement...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
