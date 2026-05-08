'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/contexts/AuthContext';
import { deleteUserListing } from '@/lib/actions/listings';

interface OwnerActionsProps {
  listingId: string;
  listingUserId: string | null;
}

export default function OwnerActions({ listingId, listingUserId }: OwnerActionsProps) {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations('listing');
  const [deleting, setDeleting] = useState(false);

  if (!user || !listingUserId || user.id !== listingUserId) return null;

  const handleDelete = async () => {
    if (!confirm(t('deleteConfirm'))) return;

    setDeleting(true);
    const result = await deleteUserListing(listingId, user.id);
    if (result.success) {
      router.push('/mon-compte');
    } else {
      alert(result.error || t('deleteError'));
      setDeleting(false);
    }
  };

  return (
    <div className="border-t border-slate-200 pt-4">
      <p className="text-xs text-slate-400 mb-3">{t('ownerLabel')}</p>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 hover:border-red-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
        {deleting ? t('deleting') : t('deleteListing')}
      </button>
    </div>
  );
}
