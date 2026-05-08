const LOCALE_MAP: Record<string, string> = {
  fr: 'fr-TN',
  en: 'en-US',
  ar: 'ar-TN',
};

function getIntlLocale(locale?: string): string {
  return LOCALE_MAP[locale || 'fr'] || 'fr-TN';
}

export function formatPrice(price: number | null, negotiableLabel?: string, locale?: string): string {
  if (price === null) return negotiableLabel || 'À discuter';
  return new Intl.NumberFormat(getIntlLocale(locale), {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' TND';
}

export function formatDate(dateString: string, locale?: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(getIntlLocale(locale), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatRelativeDate(
  dateString: string,
  labels?: { today: string; yesterday: string; daysAgo: string; weeksAgo: string },
  locale?: string,
): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const l = labels || { today: "Aujourd'hui", yesterday: 'Hier', daysAgo: 'Il y a {days} jours', weeksAgo: 'Il y a {weeks} semaines' };

  if (diffDays === 0) return l.today;
  if (diffDays === 1) return l.yesterday;
  if (diffDays < 7) return l.daysAgo.replace('{days}', String(diffDays));
  if (diffDays < 30) return l.weeksAgo.replace('{weeks}', String(Math.floor(diffDays / 7)));
  return formatDate(dateString, locale);
}

export function formatWhatsAppUrl(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const withCountryCode = cleaned.startsWith('216') ? cleaned : `216${cleaned}`;
  return `https://wa.me/${withCountryCode}`;
}

export function formatPhoneUrl(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const withCountryCode = cleaned.startsWith('216') ? cleaned : `216${cleaned}`;
  return `tel:+${withCountryCode}`;
}
