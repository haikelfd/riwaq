'use client';

import { useState } from 'react';
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
        <p className="text-sm font-medium text-slate-900 mb-2">Profil vendeur</p>
        <p className="text-xs text-slate-500 mb-3">
          Regroupez vos annonces sur une page profil publique. Totalement optionnel.
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
            <span className="text-sm text-slate-700">Pas de profil</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="radio"
              name="profile_mode"
              checked={mode === 'create'}
              onChange={() => handleModeChange('create')}
              className="w-4 h-4 text-brand-600 accent-brand-600"
            />
            <span className="text-sm text-slate-700">Créer un profil vendeur</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="radio"
              name="profile_mode"
              checked={mode === 'existing'}
              onChange={() => handleModeChange('existing')}
              className="w-4 h-4 text-brand-600 accent-brand-600"
            />
            <span className="text-sm text-slate-700">J&apos;ai déjà un profil</span>
          </label>
        </div>
      </div>

      {mode === 'create' && (
        <div className="pl-6">
          <Input
            label="Email (optionnel)"
            type="email"
            placeholder="votre@email.com"
            value={profileEmail}
            onChange={(e) => onChange('profile_email', e.target.value)}
          />
          <p className="text-xs text-slate-400 mt-1">
            Uniquement pour recevoir des notifications. Ne sera pas affiché.
          </p>
        </div>
      )}

      {mode === 'existing' && (
        <div className="pl-6">
          <Input
            label="Token de profil"
            placeholder="Collez votre token ici"
            value={profileToken}
            onChange={(e) => onChange('profile_token', e.target.value)}
          />
          <p className="text-xs text-slate-400 mt-1">
            Le token reçu lors de la création de votre profil.
          </p>
        </div>
      )}
    </div>
  );
}
