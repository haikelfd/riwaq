export type ListingCondition = 'neuf' | 'occasion';
export type ListingStatus = 'active' | 'pending' | 'expired' | 'deleted' | 'sold';
export type EnergyType = 'electrique' | 'gaz' | 'manuel' | 'mixte';
export type DeliveryType = 'sur_place' | 'livraison' | 'livraison_nationale';
export type CuisineType = 'tunisienne' | 'française' | 'italienne' | 'libanaise' | 'turque' | 'chinoise' | 'japonaise' | 'thaïlandaise' | 'mexicaine' | 'indienne' | 'coréenne' | 'américaine' | 'autre';

export interface SpecFieldDefinition {
  key: string;
  label: string;
  type: 'select' | 'number';
  options?: { value: string; label: string }[];
  unit?: string;
  placeholder?: string;
}

export interface Category {
  id: string;
  name: string;
  name_ar: string;
  slug: string;
  icon: string;
  sort_order: number;
}

export interface Subcategory {
  id: string;
  category_id: string;
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
  management_token?: string;
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
  delivery_type: DeliveryType | null;
  cuisine_type: CuisineType | null;
  subcategory_id: string | null;
  specs: Record<string, string | number> | null;
  user_id: string | null;
  view_count: number;
  management_token?: string;
  status: ListingStatus;
  created_at: string;
  expires_at: string;
  updated_at: string;
  // Joined fields
  category?: Category;
  location?: Location;
  subcategory?: Subcategory;
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
  cuisine_type?: CuisineType;
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
  delivery_type?: DeliveryType;
  cuisine_type?: CuisineType;
  subcategory_id?: string;
  specs?: Record<string, string | number>;
  seller_id?: string;
  profile_token?: string;
  user_id?: string;
}

export interface Profile {
  id: string;
  phone: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  has_seen_tour: boolean;
  tier: 'compte' | 'premium' | 'store';
  created_at: string;
  updated_at: string;
}

// Report system
export type ReportReason =
  | 'photos_misleading'
  | 'seller_unresponsive'
  | 'already_sold'
  | 'scam'
  | 'inappropriate'
  | 'other';

export type ReportStatus = 'pending' | 'reviewed' | 'dismissed';

export interface ListingReport {
  id: string;
  listing_id: string;
  reason: ReportReason;
  description: string | null;
  reporter_phone: string | null;
  status: ReportStatus;
  created_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  listing?: Pick<Listing, 'id' | 'title' | 'status'>;
}
