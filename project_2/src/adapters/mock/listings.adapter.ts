import { ListingsPort, Listing, ListingFilters, CreateListingData } from '../../core/ports/listings.port';

const LISTINGS_KEY = 'mera_market_listings';

export class MockListingsAdapter implements ListingsPort {
  private listings: Listing[] = [];

  constructor() {
    this.loadListings();
  }

  private loadListings() {
    const stored = localStorage.getItem(LISTINGS_KEY);
    if (stored) {
      this.listings = JSON.parse(stored).map((l: any) => ({
        ...l,
        createdAt: new Date(l.createdAt),
        updatedAt: new Date(l.updatedAt),
        expiresAt: l.expiresAt ? new Date(l.expiresAt) : undefined
      }));
    } else {
      // Create sample listings
      this.listings = this.generateSampleListings();
      this.saveListings();
    }
  }

  private saveListings() {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(this.listings));
  }

  private generateSampleListings(): Listing[] {
    const sampleImages = [
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
      'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg',
      'https://images.pexels.com/photos/7974/pexels-photo.jpg',
      'https://images.pexels.com/photos/248280/pexels-photo-248280.jpeg',
      'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg'
    ];

    return [
      {
        id: 'listing-1',
        title: 'iPhone 13 Pro - Excellent Condition',
        description: 'Selling my iPhone 13 Pro in excellent condition. Comes with original box and charger.',
        price: 65000,
        category: 'electronics',
        subcategory: 'mobile-phones',
        images: [sampleImages[0]],
        location: {
          lat: 28.6139,
          lng: 77.2090,
          address: 'Connaught Place',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110001'
        },
        sellerId: 'user-1',
        sellerName: 'Raj Kumar',
        sellerPhone: '+919876543210',
        status: 'active',
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000),
        expiresAt: new Date(Date.now() + 86400000 * 30),
        views: 156,
        favorites: 23
      },
      {
        id: 'listing-2',
        title: 'Royal Enfield Classic 350',
        description: 'Well maintained Royal Enfield Classic 350. Single owner, all papers clear.',
        price: 125000,
        category: 'vehicles',
        subcategory: 'motorcycles',
        images: [sampleImages[1]],
        location: {
          lat: 28.7041,
          lng: 77.1025,
          address: 'Rohini Sector 7',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110085'
        },
        sellerId: 'user-2',
        sellerName: 'Priya Sharma',
        sellerPhone: '+919876543211',
        status: 'active',
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 172800000),
        views: 89,
        favorites: 12
      }
    ];
  }

  async getListings(filters?: ListingFilters, page = 1, limit = 10): Promise<{
    listings: Listing[];
    total: number;
    hasMore: boolean;
  }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredListings = [...this.listings];

    if (filters) {
      if (filters.category) {
        filteredListings = filteredListings.filter(l => l.category === filters.category);
      }
      if (filters.subcategory) {
        filteredListings = filteredListings.filter(l => l.subcategory === filters.subcategory);
      }
      if (filters.minPrice) {
        filteredListings = filteredListings.filter(l => l.price >= filters.minPrice!);
      }
      if (filters.maxPrice) {
        filteredListings = filteredListings.filter(l => l.price <= filters.maxPrice!);
      }
      if (filters.query) {
        const query = filters.query.toLowerCase();
        filteredListings = filteredListings.filter(l => 
          l.title.toLowerCase().includes(query) || 
          l.description.toLowerCase().includes(query)
        );
      }
      if (filters.sellerId) {
        filteredListings = filteredListings.filter(l => l.sellerId === filters.sellerId);
      }
      if (filters.status) {
        filteredListings = filteredListings.filter(l => l.status === filters.status);
      }
    }

    // Sort by creation date (newest first)
    filteredListings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = filteredListings.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const listings = filteredListings.slice(start, end);

    return {
      listings,
      total,
      hasMore: end < total
    };
  }

  async getListing(id: string): Promise<Listing | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const listing = this.listings.find(l => l.id === id);
    if (listing) {
      // Increment view count
      listing.views++;
      this.saveListings();
    }
    return listing || null;
  }

  async createListing(data: CreateListingData): Promise<Listing> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newListing: Listing = {
      id: `listing-${Date.now()}`,
      ...data,
      sellerId: 'current-user', // Would come from auth context
      sellerName: 'Current User',
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      favorites: 0
    };

    this.listings.push(newListing);
    this.saveListings();

    return newListing;
  }

  async updateListing(id: string, data: Partial<CreateListingData>): Promise<Listing> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const index = this.listings.findIndex(l => l.id === id);
    if (index === -1) {
      throw new Error('Listing not found');
    }

    this.listings[index] = {
      ...this.listings[index],
      ...data,
      updatedAt: new Date()
    };

    this.saveListings();
    return this.listings[index];
  }

  async deleteListing(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const index = this.listings.findIndex(l => l.id === id);
    if (index === -1) {
      throw new Error('Listing not found');
    }

    this.listings.splice(index, 1);
    this.saveListings();
  }

  async publishListing(id: string): Promise<Listing> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const index = this.listings.findIndex(l => l.id === id);
    if (index === -1) {
      throw new Error('Listing not found');
    }

    this.listings[index].status = 'pending_payment';
    this.listings[index].updatedAt = new Date();
    
    this.saveListings();
    return this.listings[index];
  }

  async getCategories(): Promise<{ id: string; name: string; subcategories: { id: string; name: string }[] }[]> {
    await new Promise(resolve => setTimeout(resolve, 200));

    return [
      {
        id: 'electronics',
        name: 'Electronics',
        subcategories: [
          { id: 'mobile-phones', name: 'Mobile Phones' },
          { id: 'laptops', name: 'Laptops' },
          { id: 'tablets', name: 'Tablets' },
          { id: 'cameras', name: 'Cameras' },
          { id: 'accessories', name: 'Accessories' }
        ]
      },
      {
        id: 'vehicles',
        name: 'Vehicles',
        subcategories: [
          { id: 'cars', name: 'Cars' },
          { id: 'motorcycles', name: 'Motorcycles' },
          { id: 'bicycles', name: 'Bicycles' },
          { id: 'auto-parts', name: 'Auto Parts' }
        ]
      },
      {
        id: 'real-estate',
        name: 'Real Estate',
        subcategories: [
          { id: 'apartments', name: 'Apartments' },
          { id: 'houses', name: 'Houses' },
          { id: 'commercial', name: 'Commercial' },
          { id: 'land', name: 'Land' }
        ]
      },
      {
        id: 'fashion',
        name: 'Fashion',
        subcategories: [
          { id: 'mens-clothing', name: "Men's Clothing" },
          { id: 'womens-clothing', name: "Women's Clothing" },
          { id: 'shoes', name: 'Shoes' },
          { id: 'accessories', name: 'Accessories' }
        ]
      },
      {
        id: 'home-garden',
        name: 'Home & Garden',
        subcategories: [
          { id: 'furniture', name: 'Furniture' },
          { id: 'appliances', name: 'Appliances' },
          { id: 'decor', name: 'Home Decor' },
          { id: 'garden', name: 'Garden' }
        ]
      }
    ];
  }
}