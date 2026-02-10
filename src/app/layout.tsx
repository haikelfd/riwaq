import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { SavedListingsProvider } from '@/lib/contexts/SavedListingsContext';
import { TourProvider } from '@/lib/contexts/TourContext';
import TourOverlay from '@/components/tour/TourOverlay';
import WelcomeModal from '@/components/tour/WelcomeModal';
import './globals.css';

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

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
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
      </body>
    </html>
  );
}
