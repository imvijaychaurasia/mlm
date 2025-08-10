export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  images: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  status: 'draft' | 'pending_payment' | 'active' | 'sold' | 'expired' | 'rejected';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  views: number;
  favorites: number;
}

export interface ListingFilters {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: {
    lat: number;
    lng: number;
    radius: number; // km
  };
  query?: string;
  sellerId?: string;
  status?: Listing['status'];
}

export interface CreateListingData {
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  images: string[];
  location: Listing['location'];
  sellerPhone: string;
}

export interface ListingsPort {
  getListings(filters?: ListingFilters, page?: number, limit?: number): Promise<{
    listings: Listing[];
    total: number;
    hasMore: boolean;
  }>;
  getListing(id: string): Promise<Listing | null>;
  createListing(data: CreateListingData): Promise<Listing>;
  updateListing(id: string, data: Partial<CreateListingData>): Promise<Listing>;
  deleteListing(id: string): Promise<void>;
  publishListing(id: string): Promise<Listing>;
  getCategories(): Promise<{ id: string; name: string; subcategories: { id: string; name: string }[] }[]>;
}