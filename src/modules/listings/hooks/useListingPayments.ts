import { useState } from 'react';
import { useAuthStore } from '../../../core/state/auth.store';
import { LISTING_PRICE_INR, LISTING_DURATION_DAYS, VIEW_INTEREST_CONTACTS_ADDON_INR, canViewInterestedContacts, Entitlements } from '../../../core/config/pricing';

export const useListingPayments = () => {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const payListingFee = async (listingId: string): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    try {
      // Mock payment flow
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In real implementation, this would update the listing status via API
      console.log(`Listing ${listingId} payment successful`);
      return true;
    } catch (error) {
      console.error('Listing payment failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const purchaseViewContactsAddon = async (listingId: string): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    try {
      // Mock payment flow
      await new Promise(resolve => setTimeout(resolve, 1500));

      const updatedUser = {
        ...user,
        entitlements: {
          ...user.entitlements,
          addons: {
            ...user.entitlements?.addons,
            [listingId]: { canViewInterestedContacts: true },
          },
        } as Entitlements,
      };

      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('View contacts addon purchase failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const canViewContacts = (listingId: string): boolean => {
    return canViewInterestedContacts(user?.entitlements, listingId);
  };

  return {
    loading,
    payListingFee,
    purchaseViewContactsAddon,
    canViewContacts,
    listingPrice: LISTING_PRICE_INR,
    listingDuration: LISTING_DURATION_DAYS,
    addonPrice: VIEW_INTEREST_CONTACTS_ADDON_INR,
  };
};