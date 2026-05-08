'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { reportListing } from '@/lib/actions/reports';
import { REPORT_REASONS } from '@/lib/constants/report-reasons';
import { ReportReason } from '@/lib/types';
import Button from '@/components/ui/Button';

interface ReportModalProps {
  listingId: string;
  onClose: () => void;
}

export default function ReportModal({ listingId, onClose }: ReportModalProps) {
  const t = useTranslations('report');
  const tc = useTranslations('constants');
  const tCommon = useTranslations('common');

  const [reason, setReason] = useState<ReportReason | ''>('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError(t('errorNoReason'));
      return;
    }

    setSubmitting(true);
    setError('');

    const result = await reportListing({
      listing_id: listingId,
      reason: reason as ReportReason,
      description: description.trim() || undefined,
      reporter_phone: phone.trim() || undefined,
    });

    setSubmitting(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || t('errorGeneric'));
    }
  };

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8">
        {success ? (
          <div className="text-center">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-heading text-xl font-bold text-slate-900 mb-2">
              {t('successTitle')}
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              {t('successMessage')}
            </p>
            <Button onClick={onClose} fullWidth>
              {tCommon('close')}
            </Button>
          </div>
        ) : (
          <>
            <h2 className="font-heading text-xl font-bold text-slate-900 mb-1">
              {t('title')}
            </h2>
            <p className="text-sm text-slate-500 mb-5">
              {t('subtitle')}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Reason select */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t('reasonLabel')}
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as ReportReason)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                >
                  <option value="">{t('reasonPlaceholder')}</option>
                  {REPORT_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {tc(`reportReasons.${r.value}`)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t('descriptionLabel')} <span className="text-slate-400 font-normal">({tCommon('optional')})</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('descriptionPlaceholder')}
                  rows={3}
                  maxLength={1000}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors resize-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t('phoneLabel')} <span className="text-slate-400 font-normal">({tCommon('optional')})</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('phonePlaceholder')}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="flex gap-3 pt-1">
                <Button variant="ghost" fullWidth type="button" onClick={onClose}>
                  {t('cancel')}
                </Button>
                <Button variant="danger" fullWidth type="submit" disabled={submitting}>
                  {submitting ? t('submitting') : t('submit')}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
