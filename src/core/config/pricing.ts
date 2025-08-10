export const CONTACT_PASS_PRICE_INR = 20;        // 15 days, unlimited contacts
export const CONTACT_PASS_DURATION_DAYS = 15;

export const LISTING_PRICE_INR = 50;             // 60 days listing
export const LISTING_DURATION_DAYS = 60;

export const VIEW_INTEREST_CONTACTS_ADDON_INR = 20; // lister sees interested users/requirements contacts

// Subscription pricing configuration
export interface SubscriptionPricing {
  contactPassPrice: number;
  contactPassDuration: number;
  listingPrice: number;
  listingDuration: number;
  viewContactsAddonPrice: number;
}

export const DEFAULT_SUBSCRIPTION_PRICING: SubscriptionPricing = {
  contactPassPrice: CONTACT_PASS_PRICE_INR,
  contactPassDuration: CONTACT_PASS_DURATION_DAYS,
  listingPrice: LISTING_PRICE_INR,
  listingDuration: LISTING_DURATION_DAYS,
  viewContactsAddonPrice: VIEW_INTEREST_CONTACTS_ADDON_INR,
};

// Subscription pricing management
export const getSubscriptionPricing = (): SubscriptionPricing => {
  const stored = localStorage.getItem('subscription_pricing');
  if (stored) {
    try {
      return { ...DEFAULT_SUBSCRIPTION_PRICING, ...JSON.parse(stored) };
    } catch (error) {
      console.error('Error parsing subscription pricing:', error);
    }
  }
  return DEFAULT_SUBSCRIPTION_PRICING;
};

export const updateSubscriptionPricing = (pricing: Partial<SubscriptionPricing>): SubscriptionPricing => {
  const current = getSubscriptionPricing();
  const updated = { ...current, ...pricing };
  localStorage.setItem('subscription_pricing', JSON.stringify(updated));
  
  // Log the change for audit purposes
  const auditLog = {
    timestamp: new Date().toISOString(),
    changes: pricing,
    previousValues: Object.keys(pricing).reduce((prev, key) => {
      prev[key] = current[key as keyof SubscriptionPricing];
      return prev;
    }, {} as any),
    updatedBy: 'admin', // In real app, get from auth context
  };
  
  const existingLogs = JSON.parse(localStorage.getItem('pricing_audit_log') || '[]');
  existingLogs.push(auditLog);
  localStorage.setItem('pricing_audit_log', JSON.stringify(existingLogs.slice(-50))); // Keep last 50 changes
  
  return updated;
};

export const getPricingAuditLog = () => {
  return JSON.parse(localStorage.getItem('pricing_audit_log') || '[]');
};
export type Entitlements = {
  contactPassUntil?: string; // ISO date
  addons?: { [listingId: string]: { canViewInterestedContacts: boolean } };
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const isContactPassActive = (entitlements?: Entitlements): boolean => {
  if (!entitlements?.contactPassUntil) return false;
  return new Date() < new Date(entitlements.contactPassUntil);
};

export const canViewInterestedContacts = (entitlements: Entitlements | undefined, listingId: string): boolean => {
  return entitlements?.addons?.[listingId]?.canViewInterestedContacts || false;
};