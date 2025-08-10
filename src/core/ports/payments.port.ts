export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  type: 'listing_fee' | 'refund';
  entityId: string; // listing id, requirement id, etc.
  entityType: 'listing' | 'requirement';
  userId: string;
  paymentMethod?: 'card' | 'upi' | 'netbanking' | 'wallet';
  transactionId?: string;
  gatewayTransactionId?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  failureReason?: string;
}

export interface PaymentFilters {
  userId?: string;
  status?: Payment['status'];
  type?: Payment['type'];
  entityId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface CreatePaymentData {
  amount: number;
  type: Payment['type'];
  entityId: string;
  entityType: Payment['entityType'];
  paymentMethod?: Payment['paymentMethod'];
}

export interface PaymentsPort {
  getPayments(filters?: PaymentFilters, page?: number, limit?: number): Promise<{
    payments: Payment[];
    total: number;
    hasMore: boolean;
  }>;
  getPayment(id: string): Promise<Payment | null>;
  createPayment(data: CreatePaymentData): Promise<Payment>;
  processPayment(id: string, paymentMethod: string): Promise<Payment>;
  refundPayment(id: string, reason?: string): Promise<Payment>;
  getPaymentMethods(): Promise<string[]>;
}