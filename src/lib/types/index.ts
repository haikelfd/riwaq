export type ListingCondition = 'neuf' | 'occasion';
export type ListingStatus = 'active' | 'pending' | 'expired' | 'deleted' | 'sold';
export type EnergyType = 'electrique' | 'gaz' | 'manuel' | 'mixte';

export interface Category {
  id: string;
  name: string;
  name_ar: string;
  slug: string;
  icon: string;
  sort_order: number;
}

export interface Location {
  id: string;
  name: string;
  name_ar: string;
  slug: string;
}

export interface Seller {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  management_token: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSellerData {
  full_name: string;
  phone: string;
  email?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number | null;
  condition: ListingCondition;
  category_id: string;
  location_id: string;
  phone: string;
  seller_name: string | null;
  seller_id: string | null;
  brand: string | null;
  model: string | null;
  year: number | null;
  energy_type: EnergyType | null;
  user_id: string | null;
  management_token: string;
  status: ListingStatus;
  created_at: string;
  expires_at: string;
  updated_at: string;
  // Joined fields
  category?: Category;
  location?: Location;
  images?: ListingImage[];
  seller?: Pick<Seller, 'id' | 'full_name' | 'created_at'>;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  storage_path: string;
  sort_order: number;
}

export interface ListingFilters {
  search?: string;
  category?: string;
  location?: string;
  condition?: ListingCondition;
  energy_type?: EnergyType;
  price_min?: number;
  price_max?: number;
  page?: number;
}

export interface CreateListingData {
  title: string;
  description: string;
  price: number | null;
  condition: ListingCondition;
  category_id: string;
  location_id: string;
  phone: string;
  seller_name?: string;
  brand?: string;
  model?: string;
  year?: number;
  energy_type?: EnergyType;
  seller_id?: string;
  profile_token?: string;
  user_id?: string;
}

export interface Profile {
  id: string;
  phone: string;
  full_name: string | null;
  avatar_url: string | null;
  has_seen_tour: boolean;
  created_at: string;
  updated_at: string;
}
