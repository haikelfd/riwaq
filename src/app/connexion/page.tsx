'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';

function isDemoMode() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !url || url === 'your_supabase_url_here';
}

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
  const { user, loading: authLoading, demoSignIn } = useAuth();
  const demo = isDemoMode();

  const [phase, setPhase] = useState<'phone' | 'otp' | 'name'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
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

    if (demo) {
      // Simulate OTP sending delay
      await new Promise((r) => setTimeout(r, 800));
      setPhase('otp');
      setCooldown(30);
      setLoading(false);
      return;
    }

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

    if (demo) {
      // Simulate verification delay
      await new Promise((r) => setTimeout(r, 600));
      setLoading(false);
      // Ask for name before completing demo sign-in
      setPhase('name');
      return;
    }

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

  const handleDemoComplete = () => {
    demoSignIn(phone, name.trim());
    router.push(redirect);
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setCooldown(30);
    setError('');

    if (demo) return; // In demo mode, just reset cooldown

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

      {demo && (
        <div className="bg-brand-50 rounded-xl p-4 mb-6">
          <p className="text-xs text-brand-600 font-medium text-center">
            Mode démonstration — le flux est simulé, aucun SMS ne sera envoyé.
          </p>
        </div>
      )}

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
        ) : phase === 'otp' ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-slate-600">
                Code envoyé au{' '}
                <span className="font-medium text-slate-900">
                  +216 {formatPhoneDisplay(phone)}
                </span>
              </p>
              {demo && (
                <p className="text-xs text-brand-500 mt-1">
                  Entrez n&apos;importe quel code à 6 chiffres.
                </p>
              )}
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
        ) : (
          /* Name step — demo only */
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-accent-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-900 mb-1">
                Numéro vérifié !
              </p>
              <p className="text-xs text-slate-500">
                Ajoutez votre nom pour finaliser votre compte.
              </p>
            </div>

            <Input
              label="Votre nom (optionnel)"
              placeholder="Ex: Mohamed"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Button fullWidth onClick={handleDemoComplete}>
              {name.trim() ? 'Terminer' : 'Passer et continuer'}
            </Button>
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
