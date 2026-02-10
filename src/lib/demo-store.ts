import { Listing } from '@/lib/types';

// In-memory store for demo-created listings (server-side, resets on server restart)
const demoCreatedListings = new Map<string, Listing>();

export function addDemoListing(listing: Listing) {
  demoCreatedListings.set(listing.id, listing);
}

export function getDemoListing(id: string): Listing | null {
  return demoCreatedListings.get(id) || null;
}

export function getAllDemoCreatedListings(): Listing[] {
  return Array.from(demoCreatedListings.values());
}

export function updateDemoListing(id: string, updates: Partial<Listing>) {
  const existing = demoCreatedListings.get(id);
  if (existing) {
    demoCreatedListings.set(id, { ...existing, ...updates });
  }
}

export function getDemoListingByToken(token: string): Listing | null {
  for (const listing of demoCreatedListings.values()) {
    if (listing.management_token === token) return listing;
  }
  return null;
}
