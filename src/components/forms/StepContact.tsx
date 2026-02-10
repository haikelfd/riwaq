'use client';

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
  userName?: string;
}

export default function StepContact({ data, onChange, errors, isLoggedIn }: StepContactProps) {
  return (
    <div className="space-y-4">
      <div>
        <Input
          label="Numéro de téléphone"
          placeholder="Ex: 98 123 456"
          type="tel"
          value={data.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          error={errors.phone}
          required
          readOnly={isLoggedIn}
        />
        {isLoggedIn && (
          <p className="text-xs text-slate-400 mt-1">Numéro lié à votre compte.</p>
        )}
      </div>

      <Input
        label="Votre nom (optionnel)"
        placeholder="Ex: Mohamed"
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
          Votre numéro de téléphone sera visible sur l&apos;annonce et permettra aux acheteurs
          de vous contacter par appel ou WhatsApp.
        </p>
      </div>
    </div>
  );
}
