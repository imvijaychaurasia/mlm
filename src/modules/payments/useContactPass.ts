import { useState } from 'react';
import { useAuthStore } from '../../core/state/auth.store';
import { isContactPassActive, Entitlements, getSubscriptionPricing } from '../../core/config/pricing';

export const useContactPass = () => {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const pricing = getSubscriptionPricing();

  const hasActivePass = isContactPassActive(user?.entitlements);

  const purchaseContactPass = async (): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    try {
      // Mock payment flow
      await new Promise(resolve => setTimeout(resolve, 1500));

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + pricing.contactPassDuration);

      const updatedUser = {
        ...user,
        entitlements: {
          ...user.entitlements,
          contactPassUntil: expiryDate.toISOString(),
        } as Entitlements,
      };

      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Contact pass purchase failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getPassExpiryDate = (): Date | null => {
    if (!user?.entitlements?.contactPassUntil) return null;
    return new Date(user.entitlements.contactPassUntil);
  };

  const getDaysRemaining = (): number => {
    const expiry = getPassExpiryDate();
    if (!expiry) return 0;
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  return {
    hasActivePass,
    loading,
    purchaseContactPass,
    getPassExpiryDate,
    getDaysRemaining,
    price: pricing.contactPassPrice,
    duration: pricing.contactPassDuration,
  };
};