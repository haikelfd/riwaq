export type UserTier = 'compte' | 'premium' | 'store';

export interface TierLimits {
  maxListings: number;
  expiryDays: number | null;
  canEdit: boolean;
}

export const TIER_LIMITS: Record<UserTier, TierLimits> = {
  compte:  { maxListings: 5,        expiryDays: 30,   canEdit: true },
  premium: { maxListings: 20,       expiryDays: null,  canEdit: true },
  store:   { maxListings: Infinity, expiryDays: null,  canEdit: true },
};

export const ANONYMOUS_LIMITS: TierLimits = {
  maxListings: 5,
  expiryDays: 4,
  canEdit: false,
};

export const TIER_LABELS: Record<UserTier, string> = {
  compte: 'Compte',
  premium: 'Premium',
  store: 'Boutique',
};
