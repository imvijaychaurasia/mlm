export const APP_CONFIG = {
  name: 'Mera Local Market',
  version: '1.0.0',
  description: 'Your local marketplace for everything you need',
  defaultLocation: {
    lat: 28.6139,
    lng: 77.2090,
    city: 'New Delhi',
    country: 'India'
  },
  pagination: {
    defaultLimit: 10,
    maxLimit: 50
  },
  search: {
    defaultRadius: 5, // km
    maxRadius: 50
  },
  payments: {
    currency: 'INR',
    listingFee: 99
  }
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  VERIFY: '/auth/verify',
  LISTINGS: '/listings',
  LISTING_DETAIL: '/listings/:id',
  CREATE_LISTING: '/listings/create',
  REQUIREMENTS: '/requirements',
  REQUIREMENT_DETAIL: '/requirements/:id',
  CREATE_REQUIREMENT: '/requirements/create',
  PROFILE: '/profile',
  ADMIN: '/admin',
  INTEGRATIONS: '/admin/integrations'
} as const;