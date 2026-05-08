import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Playfair_Display, Inter, Noto_Sans_Arabic, Amiri } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { SavedListingsProvider } from '@/lib/contexts/SavedListingsContext';
import { TourProvider } from '@/lib/contexts/TourContext';
import TourOverlay from '@/components/tour/TourOverlay';
import WelcomeModal from '@/components/tour/WelcomeModal';

const playfair = Playfair_Display({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: '--font-body-ar',
  subsets: ['arabic'],
  display: 'swap',
});

const amiri = Amiri({
  variable: '--font-heading-ar',
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://riwaq.tn'),
  title: {
    default: 'Riwaq — Matériel professionnel de restaurant et café en Tunisie',
    template: '%s | Riwaq',
  },
  description:
    'Achetez et vendez du matériel professionnel de restaurant et café en Tunisie. Machines à café, fours, réfrigérateurs, mobilier et plus.',
  keywords: [
    'matériel restaurant tunisie',
    'équipement café tunisie',
    'matériel professionnel occasion',
    'machine café occasion tunisie',
    'four professionnel tunisie',
    'réfrigérateur professionnel tunisie',
    'mobilier restaurant tunisie',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_TN',
    siteName: 'Riwaq',
    title: 'Riwaq — Matériel professionnel de restaurant et café en Tunisie',
    description:
      'Achetez et vendez du matériel professionnel de restaurant et café en Tunisie.',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const isRTL = locale === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  const fontVars = isRTL
    ? `${amiri.variable} ${notoSansArabic.variable}`
    : `${playfair.variable} ${inter.variable}`;

  return (
    <html lang={locale} dir={dir}>
      <body className={`${fontVars} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <SavedListingsProvider>
              <TourProvider>
                <Header />
                <main className="min-h-screen">{children}</main>
                <Footer />
                <TourOverlay />
                <WelcomeModal />
              </TourProvider>
            </SavedListingsProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
