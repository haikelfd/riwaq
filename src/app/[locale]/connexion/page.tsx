'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const t = useTranslations('login');
  const tc = useTranslations('common');
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-16 text-center text-slate-500">{tc('loading')}</div>}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('login');
  const tc = useTranslations('common');
  // Validate redirect to prevent open redirect attacks — only allow relative paths
  const rawRedirect = searchParams.get('redirect') || '/mon-compte';
  const redirect = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/mon-compte';
  const { user, loading: authLoading } = useAuth();

  const [phase, setPhase] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push(redirect);
    }
  }, [user, authLoading, router, redirect]);

  // Handle OAuth callback errors
  useEffect(() => {
    if (searchParams.get('error') === 'auth') {
      setError(t('errorAuthFailed'));
    }
  }, [searchParams, t]);

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

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
        },
      });

      if (oauthError) {
        setError(oauthError.message || t('errorGoogleFailed'));
        setGoogleLoading(false);
      }
    } catch {
      setError(t('errorGeneric'));
      setGoogleLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (phone.length < 8) {
      setError(t('errorPhoneLength'));
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
        setError(otpError.message || t('errorOtpSend'));
        setLoading(false);
        return;
      }

      setPhase('otp');
      setCooldown(30);
    } catch {
      setError(t('errorGeneric'));
    }

    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 6) {
      setError(t('errorOtpLength'));
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
        setError(t('errorOtpInvalid'));
        setLoading(false);
        return;
      }

      // Auth state change will trigger redirect via useEffect
      router.push(redirect);
    } catch {
      setError(t('errorGeneric'));
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
      setError(t('errorResend'));
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 sm:py-16 text-center text-slate-500">
        {tc('loading')}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-16">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          {t('title')}
        </h1>
        <p className="text-slate-500 text-sm">
          {t('subtitle')}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {/* Google OAuth button */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {googleLoading ? t('googleLoading') : t('googleButton')}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium">{tc('or')}</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Phone OTP flow */}
        {phase === 'phone' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1.5">
                {t('phoneLabel')}
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
              disabled={loading || googleLoading || phone.length < 8}
            >
              {loading ? t('sending') : t('sendCode')}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-slate-600">
                {t('codeSentTo')}{' '}
                <span className="font-medium text-slate-900">
                  +216 {formatPhoneDisplay(phone)}
                </span>
              </p>
            </div>

            <Input
              label={t('verificationCode')}
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
              {loading ? t('verifying') : t('verify')}
            </Button>

            <div className="text-center">
              {cooldown > 0 ? (
                <p className="text-xs text-slate-400">
                  {t('resendIn', { seconds: cooldown })}
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-xs text-brand-600 hover:text-brand-500 font-medium cursor-pointer"
                >
                  {t('resendCode')}
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
              {t('changeNumber')}
            </button>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-slate-400 mt-6">
        {t('optional')}
      </p>

      {!user && (
        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-brand-600 hover:text-brand-500">
            {t('backToHome')}
          </Link>
        </div>
      )}
    </div>
  );
}
