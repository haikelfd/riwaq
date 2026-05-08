import { ReportReason } from '@/lib/types';

export const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: 'photos_misleading', label: 'Photos trompeuses — ne correspond pas au produit' },
  { value: 'seller_unresponsive', label: 'Vendeur injoignable' },
  { value: 'already_sold', label: 'Produit vendu mais encore affiché' },
  { value: 'scam', label: 'Arnaque ou fraude suspectée' },
  { value: 'inappropriate', label: 'Contenu inapproprié' },
  { value: 'other', label: 'Autre raison' },
];

export const REPORT_REASON_LABELS: Record<ReportReason, string> = Object.fromEntries(
  REPORT_REASONS.map((r) => [r.value, r.label])
) as Record<ReportReason, string>;
