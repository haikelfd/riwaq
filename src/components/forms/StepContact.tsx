'use client';

import { useTranslations } from 'next-intl';
import Input from '@/components/ui/Input';
import SellerProfileToggle from './SellerProfileToggle';

interface StepContactProps {
  data: {
    phone: string;
    seller_name: string;
    create_profile: string;
    profile_token: string;
    profile_email: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
  isLoggedIn?: boolean;
  hasPhone?: boolean;
  userName?: string;
}

export default function StepContact({ data, onChange, errors, isLoggedIn, hasPhone }: StepContactProps) {
  const t = useTranslations('stepContact');

  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="font-heading text-lg font-semibold text-slate-900">{t('title')}</h2>
        <p className="text-sm text-slate-500 mt-1">{t('subtitle')}</p>
      </div>
      <div>
        <Input
          label={t('phoneLabel')}
          placeholder={t('phonePlaceholder')}
          type="tel"
          value={data.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          error={errors.phone}
          required
          readOnly={isLoggedIn && hasPhone}
        />
        {isLoggedIn && hasPhone && (
          <p className="text-xs text-slate-400 mt-1">{t('phoneLinked')}</p>
        )}
        {isLoggedIn && !hasPhone && (
          <p className="text-xs text-slate-400 mt-1">{t('phoneHint')}</p>
        )}
      </div>

      <Input
        label={t('nameLabel')}
        placeholder={t('namePlaceholder')}
        value={data.seller_name}
        onChange={(e) => onChange('seller_name', e.target.value)}
      />

      {!isLoggedIn && (
        <SellerProfileToggle
          createProfile={data.create_profile === 'true'}
          profileToken={data.profile_token}
          profileEmail={data.profile_email}
          onChange={onChange}
        />
      )}

      <div className="bg-slate-50 rounded-lg p-4">
        <p className="text-sm text-slate-900/70 leading-relaxed">
          {t('phoneDisclaimer')}
        </p>
      </div>
    </div>
  );
}
