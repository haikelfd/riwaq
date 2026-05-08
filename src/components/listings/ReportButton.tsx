'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ReportModal from './ReportModal';

interface ReportButtonProps {
  listingId: string;
}

export default function ReportButton({ listingId }: ReportButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const t = useTranslations('listing');

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors cursor-pointer py-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
          />
        </svg>
        {t('report')}
      </button>

      {showModal && (
        <ReportModal
          listingId={listingId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
