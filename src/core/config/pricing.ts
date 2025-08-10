export const CONTACT_PASS_PRICE_INR = 20;        // 15 days, unlimited contacts
export const CONTACT_PASS_DURATION_DAYS = 15;

export const LISTING_PRICE_INR = 50;             // 60 days listing
export const LISTING_DURATION_DAYS = 60;

export const VIEW_INTEREST_CONTACTS_ADDON_INR = 20; // lister sees interested users/requirements contacts

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