import { PaymentsPort, Payment, PaymentFilters, CreatePaymentData } from '../../core/ports/payments.port';
import { getEnvConfig } from '../../core/config/env';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export class RazorpayPaymentsAdapter implements PaymentsPort {
  private config = getEnvConfig();

  private loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async getPayments(filters?: PaymentFilters, page = 1, limit = 10): Promise<{
    payments: Payment[];
    total: number;
    hasMore: boolean;
  }> {
    // In a real implementation, this would fetch from your backend
    // For now, return mock data
    return {
      payments: [],
      total: 0,
      hasMore: false,
    };
  }

  async getPayment(id: string): Promise<Payment | null> {
    // Fetch payment details from your backend
    return null;
  }

  async createPayment(data: CreatePaymentData): Promise<Payment> {
    // Create payment record in your backend
    const payment: Payment = {
      id: `payment_${Date.now()}`,
      amount: data.amount,
      currency: 'INR',
      status: 'pending',
      type: data.type,
      entityId: data.entityId,
      entityType: data.entityType,
      userId: 'current-user', // Get from auth context
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return payment;
  }

  async processPayment(id: string, paymentMethod: string): Promise<Payment> {
    if (!this.config.razorpay.keyId) {
      throw new Error('Razorpay key not configured');
    }

    const scriptLoaded = await this.loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay script');
    }

    return new Promise((resolve, reject) => {
      // In a real implementation, you'd call your backend to create an order
      const mockOrder = {
        id: `order_${Date.now()}`,
        amount: 9900, // ₹99 in paise
        currency: 'INR',
      };

      const options = {
        key: this.config.razorpay.keyId,
        amount: mockOrder.amount,
        currency: mockOrder.currency,
        name: 'Mera Local Market',
        description: 'Listing Fee',
        order_id: mockOrder.id,
        handler: (response: any) => {
          // Payment successful
          const payment: Payment = {
            id,
            amount: mockOrder.amount / 100,
            currency: mockOrder.currency,
            status: 'completed',
            type: 'listing_fee',
            entityId: 'listing-id',
            entityType: 'listing',
            userId: 'current-user',
            transactionId: response.razorpay_payment_id,
            gatewayTransactionId: response.razorpay_order_id,
            createdAt: new Date(),
            updatedAt: new Date(),
            completedAt: new Date(),
          };
          resolve(payment);
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'));
          },
        },
        theme: {
          color: '#3f51b5',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    });
  }

  async refundPayment(id: string, reason?: string): Promise<Payment> {
    // Process refund through your backend
    throw new Error('Refund functionality not implemented');
  }

  async getPaymentMethods(): Promise<string[]> {
    return ['card', 'upi', 'netbanking', 'wallet'];
  }
}