'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Input from '@/components/ui/Input';

interface SellerProfileToggleProps {
  createProfile: boolean;
  profileToken: string;
  profileEmail: string;
  onChange: (field: string, value: string) => void;
}

export default function SellerProfileToggle({
  createProfile,
  profileToken,
  profileEmail,
  onChange,
}: SellerProfileToggleProps) {
  const t = useTranslations('stepContact');
  const [mode, setMode] = useState<'none' | 'create' | 'existing'>(
    createProfile ? 'create' : profileToken ? 'existing' : 'none'
  );

  const handleModeChange = (newMode: 'none' | 'create' | 'existing') => {
    setMode(newMode);
    if (newMode === 'create') {
      onChange('create_profile', 'true');
      onChange('profile_token', '');
    } else if (newMode === 'existing') {
      onChange('create_profile', 'false');
      onChange('profile_email', '');
    } else {
      onChange('create_profile', 'false');
      onChange('profile_token', '');
      onChange('profile_email', '');
    }
  };

  return (
    <div className="space-y-3">
      <div className="pt-2">
        <p className="text-sm font-medium text-slate-900 mb-2">{t('sellerProfile')}</p>
        <p className="text-xs text-slate-500 mb-3">
          {t('sellerProfileDesc')}
        </p>

        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="radio"
              name="profile_mode"
              checked={mode === 'none'}
              onChange={() => handleModeChange('none')}
              className="w-4 h-4 text-brand-600 accent-brand-600"
            />
            <span className="text-sm text-slate-700">{t('noProfile')}</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="radio"
              name="profile_mode"
              checked={mode === 'create'}
              onChange={() => handleModeChange('create')}
              className="w-4 h-4 text-brand-600 accent-brand-600"
            />
            <span className="text-sm text-slate-700">{t('createProfile')}</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="radio"
              name="profile_mode"
              checked={mode === 'existing'}
              onChange={() => handleModeChange('existing')}
              className="w-4 h-4 text-brand-600 accent-brand-600"
            />
            <span className="text-sm text-slate-700">{t('existingProfile')}</span>
          </label>
        </div>
      </div>

      {mode === 'create' && (
        <div className="ps-6">
          <Input
            label={t('emailLabel')}
            type="email"
            placeholder={t('emailPlaceholder')}
            value={profileEmail}
            onChange={(e) => onChange('profile_email', e.target.value)}
          />
          <p className="text-xs text-slate-400 mt-1">
            {t('emailHint')}
          </p>
        </div>
      )}

      {mode === 'existing' && (
        <div className="ps-6">
          <Input
            label={t('tokenLabel')}
            placeholder={t('tokenPlaceholder')}
            value={profileToken}
            onChange={(e) => onChange('profile_token', e.target.value)}
          />
          <p className="text-xs text-slate-400 mt-1">
            {t('tokenHint')}
          </p>
        </div>
      )}
    </div>
  );
}
