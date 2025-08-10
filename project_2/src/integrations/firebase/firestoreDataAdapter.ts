import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { ListingsPort, Listing, ListingFilters, CreateListingData } from '../../core/ports/listings.port';
import { getFirebaseFirestore } from './firebaseClient';

export class FirestoreListingsAdapter implements ListingsPort {
  private db = getFirebaseFirestore();

  private mapDocToListing(doc: QueryDocumentSnapshot): Listing {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      expiresAt: data.expiresAt?.toDate(),
    } as Listing;
  }

  async getListings(filters?: ListingFilters, page = 1, pageLimit = 10): Promise<{
    listings: Listing[];
    total: number;
    hasMore: boolean;
  }> {
    if (!this.db) throw new Error('Firestore not initialized');

    const listingsRef = collection(this.db, 'listings');
    let q = query(listingsRef, where('status', '==', 'active'), orderBy('createdAt', 'desc'));

    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }

    if (filters?.minPrice) {
      q = query(q, where('price', '>=', filters.minPrice));
    }

    if (filters?.maxPrice) {
      q = query(q, where('price', '<=', filters.maxPrice));
    }

    // Apply pagination
    q = query(q, limit(pageLimit));

    const snapshot = await getDocs(q);
    const listings = snapshot.docs.map(doc => this.mapDocToListing(doc));

    // For simplicity, we'll estimate total and hasMore
    const hasMore = listings.length === pageLimit;
    const total = listings.length; // This would need a separate count query in production

    return {
      listings,
      total,
      hasMore,
    };
  }

  async getListing(id: string): Promise<Listing | null> {
    if (!this.db) throw new Error('Firestore not initialized');

    const docRef = doc(this.db, 'listings', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    // Increment view count
    await updateDoc(docRef, {
      views: (docSnap.data().views || 0) + 1,
    });

    return this.mapDocToListing(docSnap as QueryDocumentSnapshot);
  }

  async createListing(data: CreateListingData): Promise<Listing> {
    if (!this.db) throw new Error('Firestore not initialized');

    const listingData = {
      ...data,
      status: 'draft',
      views: 0,
      favorites: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(this.db, 'listings'), listingData);
    const docSnap = await getDoc(docRef);

    return this.mapDocToListing(docSnap as QueryDocumentSnapshot);
  }

  async updateListing(id: string, data: Partial<CreateListingData>): Promise<Listing> {
    if (!this.db) throw new Error('Firestore not initialized');

    const docRef = doc(this.db, 'listings', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    const docSnap = await getDoc(docRef);
    return this.mapDocToListing(docSnap as QueryDocumentSnapshot);
  }

  async deleteListing(id: string): Promise<void> {
    if (!this.db) throw new Error('Firestore not initialized');

    const docRef = doc(this.db, 'listings', id);
    await deleteDoc(docRef);
  }

  async publishListing(id: string): Promise<Listing> {
    if (!this.db) throw new Error('Firestore not initialized');

    const docRef = doc(this.db, 'listings', id);
    await updateDoc(docRef, {
      status: 'pending_payment',
      updatedAt: serverTimestamp(),
    });

    const docSnap = await getDoc(docRef);
    return this.mapDocToListing(docSnap as QueryDocumentSnapshot);
  }

  async getCategories(): Promise<{ id: string; name: string; subcategories: { id: string; name: string }[] }[]> {
    // This could be stored in Firestore as well, but for now we'll return static data
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