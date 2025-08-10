import { MockAuthAdapter } from './mock/auth.adapter';
import { MockListingsAdapter } from './mock/listings.adapter';

// Singleton instances
let authAdapter: MockAuthAdapter | null = null;
let listingsAdapter: MockListingsAdapter | null = null;

export const getAuthAdapter = () => {
  if (!authAdapter) {
    authAdapter = new MockAuthAdapter();
  }
  return authAdapter;
};

export const getListingsAdapter = () => {
  if (!listingsAdapter) {
    listingsAdapter = new MockListingsAdapter();
  }
  return listingsAdapter;
};

// Registry for switching adapters based on integrations
export const adapterRegistry = {
  auth: {
    mock: () => getAuthAdapter(),
    firebase: () => getAuthAdapter(), // Placeholder - would be FirebaseAuthAdapter
  },
  listings: {
    mock: () => getListingsAdapter(),
  },
  payments: {
    mock: () => null, // Would implement MockPaymentsAdapter
    razorpay: () => null, // Placeholder - would be RazorpayAdapter
  }
};

export type AdapterType = keyof typeof adapterRegistry;
export type ProviderType<T extends AdapterType> = keyof typeof adapterRegistry[T];

// Provider selection utilities
export const getSelectedProvider = (type: AdapterType): string => {
  return localStorage.getItem(`provider_${type}`) || 'mock';
};

export const setSelectedProvider = (type: AdapterType, provider: string): void => {
  localStorage.setItem(`provider_${type}`, provider);
  
  // Auto-fallback to mock if environment is incomplete
  const envValidation = require('../core/config/env').validateEnvironment();
  const missingKeys = getMissingKeysForProvider(type, envValidation);
  
  if (provider !== 'mock' && missingKeys.length > 0) {
    localStorage.setItem(`provider_${type}`, 'mock');
    console.warn(`Provider ${provider} for ${type} has missing environment variables, falling back to mock`);
  }
};

const getMissingKeysForProvider = (category: AdapterType, envValidation: any): string[] => {
  const validation = envValidation.providers.find((p: any) => 
    p.name === (
      category === 'auth' ? 'Firebase' : 
      category === 'payments' ? 'Razorpay' : 
      category === 'data' ? 'Firebase' : 
      category === 'storage' ? 'Firebase' : ''
    )
  );
  
  return validation?.keys.filter((k: any) => !k.present).map((k: any) => k.key) || [];
};