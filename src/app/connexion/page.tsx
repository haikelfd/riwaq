'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-16 text-center text-slate-500">Chargement...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/mon-compte';
  const { user, loading: authLoading } = useAuth();

  const [phase, setPhase] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push(redirect);
    }
  }, [user, authLoading, router, redirect]);

  // Cooldown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const formatPhoneDisplay = (digits: string) => {
    const clean = digits.replace(/\D/g, '').slice(0, 8);
    if (clean.length <= 2) return clean;
    if (clean.length <= 5) return `${clean.slice(0, 2)} ${clean.slice(2)}`;
    return `${clean.slice(0, 2)} ${clean.slice(2, 5)} ${clean.slice(5)}`;
  };

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    setPhone(digits);
    setError('');
  };

  const handleSendOTP = async () => {
    if (phone.length < 8) {
      setError('Le numéro doit contenir 8 chiffres.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: `+216${phone}`,
      });

      if (otpError) {
        setError(otpError.message || 'Erreur lors de l\'envoi du code.');
        setLoading(false);
        return;
      }

      setPhase('otp');
      setCooldown(30);
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    }

    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 6) {
      setError('Le code doit contenir 6 chiffres.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: `+216${phone}`,
        token: otp,
        type: 'sms',
      });

      if (verifyError) {
        setError('Code incorrect. Veuillez réessayer.');
        setLoading(false);
        return;
      }

      // Auth state change will trigger redirect via useEffect
      router.push(redirect);
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setCooldown(30);
    setError('');

    try {
      const supabase = createClient();
      await supabase.auth.signInWithOtp({
        phone: `+216${phone}`,
      });
    } catch {
      setError('Erreur lors du renvoi du code.');
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 sm:py-16 text-center text-slate-500">
        Chargement...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-16">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Se connecter
        </h1>
        <p className="text-slate-500 text-sm">
          Retrouvez vos annonces et pré-remplissez vos informations.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {phase === 'phone' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1.5">
                Numéro de téléphone
              </label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 font-medium shrink-0">
                  +216
                </div>
                <Input
                  type="tel"
                  placeholder="98 123 456"
                  value={formatPhoneDisplay(phone)}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  error={error || undefined}
                />
              </div>
            </div>

            <Button
              fullWidth
              onClick={handleSendOTP}
              disabled={loading || phone.length < 8}
            >
              {loading ? 'Envoi...' : 'Recevoir le code'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-slate-600">
                Code envoyé au{' '}
                <span className="font-medium text-slate-900">
                  +216 {formatPhoneDisplay(phone)}
                </span>
              </p>
            </div>

            <Input
              label="Code de vérification"
              type="text"
              inputMode="numeric"
              placeholder="000000"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                setError('');
              }}
              error={error || undefined}
            />

            <Button
              fullWidth
              onClick={handleVerifyOTP}
              disabled={loading || otp.length < 6}
            >
              {loading ? 'Vérification...' : 'Vérifier'}
            </Button>

            <div className="text-center">
              {cooldown > 0 ? (
                <p className="text-xs text-slate-400">
                  Renvoyer le code dans {cooldown}s
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-xs text-brand-600 hover:text-brand-500 font-medium cursor-pointer"
                >
                  Renvoyer le code
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setPhase('phone');
                setOtp('');
                setError('');
              }}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Changer de numéro
            </button>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-slate-400 mt-6">
        Pas obligatoire — vous pouvez utiliser Riwaq sans compte.
      </p>

      {!user && (
        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-brand-600 hover:text-brand-500">
            Retour à l&apos;accueil
          </Link>
        </div>
      )}
    </div>
  );
}
