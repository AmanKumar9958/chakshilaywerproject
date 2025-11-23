import Razorpay from 'razorpay';
import { createHmac } from 'crypto';
import { config } from '@/config';

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

export interface CreateOrderOptions {
  amount: number; // Amount in smallest currency unit (paise for INR)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

/**
 * Create a new Razorpay order
 */
export const createOrder = async (options: CreateOrderOptions): Promise<RazorpayOrder> => {
  try {
    if (!config.razorpay.keyId || !config.razorpay.keySecret) {
      console.warn('Razorpay credentials not configured, creating mock order');
      
      // Return mock order for development/testing
      return {
        id: `order_mock_${Date.now()}`,
        entity: 'order',
        amount: options.amount,
        amount_paid: 0,
        amount_due: options.amount,
        currency: options.currency || 'INR',
        receipt: options.receipt || `receipt_${Date.now()}`,
        status: 'created',
        attempts: 0,
        notes: options.notes || {},
        created_at: Math.floor(Date.now() / 1000),
      };
    }

    const order = await razorpayInstance.orders.create({
      amount: options.amount,
      currency: options.currency || 'INR',
      receipt: options.receipt || `receipt_${Date.now()}`,
      notes: options.notes,
    });

    return order as RazorpayOrder;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
};

/**
 * Verify Razorpay webhook signature
 */
export const verifyWebhookSignature = (
  payload: string,
  signature: string,
  secret: string = config.razorpay.keySecret
): boolean => {
  try {
    if (!secret) {
      console.warn('Razorpay webhook secret not configured');
      return false;
    }

    const expectedSignature = createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
};

/**
 * Verify payment signature for frontend payments
 */
export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  try {
    if (!config.razorpay.keySecret) {
      console.warn('Razorpay secret not configured');
      return false;
    }

    const body = `${orderId}|${paymentId}`;
    const expectedSignature = createHmac('sha256', config.razorpay.keySecret)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return false;
  }
};

/**
 * Fetch order details from Razorpay
 */
export const fetchOrder = async (orderId: string): Promise<RazorpayOrder | null> => {
  try {
    if (!config.razorpay.keyId || !config.razorpay.keySecret) {
      console.warn('Razorpay credentials not configured');
      return null;
    }

    const order = await razorpayInstance.orders.fetch(orderId);
    return order as RazorpayOrder;
  } catch (error) {
    console.error('Error fetching Razorpay order:', error);
    return null;
  }
};

/**
 * Fetch payment details from Razorpay
 */
export const fetchPayment = async (paymentId: string) => {
  try {
    if (!config.razorpay.keyId || !config.razorpay.keySecret) {
      console.warn('Razorpay credentials not configured');
      return null;
    }

    const payment = await razorpayInstance.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Error fetching Razorpay payment:', error);
    return null;
  }
};