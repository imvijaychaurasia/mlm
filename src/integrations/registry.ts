import { MockAuthAdapter } from './mock/auth.adapter';
import { MockListingsAdapter } from './mock/listings.adapter';
import { FirebaseAuthAdapter } from './firebase/firebaseAuthAdapter';
import { FirestoreListingsAdapter } from './firebase/firestoreDataAdapter';
import { RazorpayPaymentsAdapter } from './razorpay/razorpayPaymentsAdapter';
import { isMockMode } from '../core/config/env';

// Singleton instances
let authAdapter: MockAuthAdapter | null = null;
let listingsAdapter: MockListingsAdapter | null = null;
let firebaseAuthAdapter: FirebaseAuthAdapter | null = null;
let firestoreListingsAdapter: FirestoreListingsAdapter | null = null;
let razorpayPaymentsAdapter: RazorpayPaymentsAdapter | null = null;

export const getAuthAdapter = () => {
  const selectedProvider = localStorage.getItem('auth_provider') || 'mock';
  
  if (selectedProvider === 'firebase' && !isMockMode()) {
    if (!firebaseAuthAdapter) {
      firebaseAuthAdapter = new FirebaseAuthAdapter();
    }
    return firebaseAuthAdapter;
  }
  
  if (!authAdapter) {
    authAdapter = new MockAuthAdapter();
  }
  return authAdapter;
};

export const getListingsAdapter = () => {
  const selectedProvider = localStorage.getItem('data_provider') || 'mock';
  
  if (selectedProvider === 'firestore' && !isMockMode()) {
    if (!firestoreListingsAdapter) {
      firestoreListingsAdapter = new FirestoreListingsAdapter();
    }
    return firestoreListingsAdapter;
  }
  
  if (!listingsAdapter) {
    listingsAdapter = new MockListingsAdapter();
  }
  return listingsAdapter;
};

export const getPaymentsAdapter = () => {
  const selectedProvider = localStorage.getItem('payments_provider') || 'mock';
  
  if (selectedProvider === 'razorpay' && !isMockMode()) {
    if (!razorpayPaymentsAdapter) {
      razorpayPaymentsAdapter = new RazorpayPaymentsAdapter();
    }
    return razorpayPaymentsAdapter;
  }
  
  // Return mock payments adapter
  return null; // Would implement MockPaymentsAdapter
};

// Registry for switching adapters based on integrations
export const adapterRegistry = {
  auth: {
    mock: () => getAuthAdapter(),
    firebase: () => {
      localStorage.setItem('auth_provider', 'firebase');
      firebaseAuthAdapter = null; // Reset to force recreation
      return getAuthAdapter();
    },
  },
  data: {
    mock: () => getListingsAdapter(),
    firestore: () => {
      localStorage.setItem('data_provider', 'firestore');
      firestoreListingsAdapter = null; // Reset to force recreation
      return getListingsAdapter();
    },
  },
  payments: {
    mock: () => getPaymentsAdapter(),
    razorpay: () => {
      localStorage.setItem('payments_provider', 'razorpay');
      razorpayPaymentsAdapter = null; // Reset to force recreation
      return getPaymentsAdapter();
    },
  },
  storage: {
    mock: () => null,
    firebase: () => null,
  },
  geo: {
    mock: () => null,
    geofire: () => null,
  },
};

export type AdapterType = keyof typeof adapterRegistry;
export type ProviderType<T extends AdapterType> = keyof typeof adapterRegistry[T];

export const getSelectedProvider = (category: AdapterType): string => {
  switch (category) {
    case 'auth':
      return localStorage.getItem('auth_provider') || 'mock';
    case 'data':
      return localStorage.getItem('data_provider') || 'mock';
    case 'payments':
      return localStorage.getItem('payments_provider') || 'mock';
    case 'storage':
      return localStorage.getItem('storage_provider') || 'mock';
    case 'geo':
      return localStorage.getItem('geo_provider') || 'mock';
    default:
      return 'mock';
  }
};

export const setSelectedProvider = (category: AdapterType, provider: string) => {
  localStorage.setItem(`${category}_provider`, provider);
  
  // Reset adapters to force recreation with new provider
  switch (category) {
    case 'auth':
      authAdapter = null;
      firebaseAuthAdapter = null;
      break;
    case 'data':
      listingsAdapter = null;
      firestoreListingsAdapter = null;
      break;
    case 'payments':
      razorpayPaymentsAdapter = null;
      break;
  }
};