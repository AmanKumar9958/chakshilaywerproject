const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');

const { logger } = require('../utils/logger');
const { successResponse, errorResponse } = require('../utils/response');

const router = express.Router();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ========================================
// VALIDATION MIDDLEWARE
// ========================================

const createOrderValidation = [
  body('amount')
    .isInt({ min: 100 })
    .withMessage('Amount must be at least 100 paise (₹1)'),
  body('currency')
    .optional()
    .isIn(['INR'])
    .withMessage('Currency must be INR'),
  body('planName')
    .isLength({ min: 1, max: 100 })
    .withMessage('Plan name is required and must be less than 100 characters'),
  body('billingCycle')
    .isIn(['monthly', 'yearly'])
    .withMessage('Billing cycle must be monthly or yearly')
];

const verifyPaymentValidation = [
  body('razorpay_payment_id')
    .matches(/^pay_[a-zA-Z0-9]{14}$/)
    .withMessage('Invalid payment ID format'),
  body('razorpay_order_id')
    .matches(/^order_[a-zA-Z0-9]{14}$/)
    .withMessage('Invalid order ID format'),
  body('razorpay_signature')
    .isLength({ min: 1 })
    .withMessage('Payment signature is required'),
  body('plan')
    .isIn(['basic', 'standard', 'professional'])
    .withMessage('Invalid plan type'),
  body('cycle')
    .isIn(['monthly', 'yearly'])
    .withMessage('Invalid billing cycle')
];

// ========================================
// CREATE ORDER ENDPOINT
// ========================================

router.post('/create-order', createOrderValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array());
    }

    const { amount, currency = 'INR', planName, billingCycle } = req.body;

    logger.info('Creating order:', { amount, currency, planName, billingCycle });

    const options = {
      amount: amount, // amount in paise
      currency: currency,
      receipt: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      notes: {
        planName,
        billingCycle,
        timestamp: new Date().toISOString(),
        source: 'legal_platform_website'
      }
    };

    const order = await razorpay.orders.create(options);
    
    logger.info('Order created successfully:', { orderId: order.id, amount: order.amount });

    return successResponse(res, 'Order created successfully', {
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      receipt: order.receipt
    });

  } catch (error) {
    logger.error('Error creating order:', error);
    return errorResponse(res, 'Failed to create order', 500, error.message);
  }
});

// ========================================
// VERIFY PAYMENT ENDPOINT
// ========================================

router.post('/verify-payment', verifyPaymentValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array());
    }

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      plan,
      cycle
    } = req.body;

    logger.info('Verifying payment:', { 
      payment_id: razorpay_payment_id, 
      order_id: razorpay_order_id,
      plan,
      cycle
    });

    // Create signature for verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment is verified
      logger.info('Payment verified successfully:', {
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        plan,
        cycle
      });

      // Here you would typically:
      // 1. Save payment details to database
      // 2. Activate user subscription
      // 3. Send confirmation email
      // 4. Update user's plan in your system

      // Example database save (implement based on your database)
      /*
      await savePaymentToDatabase({
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        plan,
        cycle,
        status: 'completed',
        timestamp: new Date(),
        signature: razorpay_signature
      });
      */

      // Example user subscription update
      /*
      await updateUserSubscription(req.user?.id, {
        plan,
        cycle,
        paymentId: razorpay_payment_id,
        startDate: new Date(),
        endDate: calculateEndDate(cycle)
      });
      */

      return successResponse(res, 'Payment verified successfully', {
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        plan,
        cycle,
        status: 'verified'
      });

    } else {
      logger.error('Payment verification failed - Invalid signature:', {
        payment_id: razorpay_payment_id,
        expected: expectedSignature.substr(0, 10) + '...',
        received: razorpay_signature.substr(0, 10) + '...'
      });

      return errorResponse(res, 'Payment verification failed', 400, 'Invalid signature');
    }

  } catch (error) {
    logger.error('Error verifying payment:', error);
    return errorResponse(res, 'Payment verification failed', 500, error.message);
  }
});

// ========================================
// GET PAYMENT STATUS ENDPOINT
// ========================================

router.get('/payment-status/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;

    // Validate payment ID format
    if (!paymentId.match(/^pay_[a-zA-Z0-9]{14}$/)) {
      return errorResponse(res, 'Invalid payment ID format', 400);
    }

    logger.info('Fetching payment status:', { paymentId });

    const payment = await razorpay.payments.fetch(paymentId);
    
    return successResponse(res, 'Payment status retrieved successfully', {
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
      created_at: payment.created_at,
      captured: payment.captured
    });

  } catch (error) {
    logger.error('Error fetching payment status:', error);
    return errorResponse(res, 'Failed to fetch payment status', 500, error.message);
  }
});

// ========================================
// WEBHOOK ENDPOINT
// ========================================

router.post('/razorpay-webhook', (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      logger.warn('Webhook secret not configured');
      return res.status(400).json({ error: 'Webhook not configured' });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (webhookSignature === expectedSignature) {
      const event = req.body.event;
      const payload = req.body.payload;

      logger.info('Webhook received:', { event });

      switch (event) {
        case 'payment.captured':
          logger.info('Payment captured:', payload.payment.entity);
          // Handle successful payment
          handlePaymentCaptured(payload.payment.entity);
          break;
          
        case 'payment.failed':
          logger.info('Payment failed:', payload.payment.entity);
          // Handle failed payment
          handlePaymentFailed(payload.payment.entity);
          break;
          
        case 'order.paid':
          logger.info('Order paid:', payload.order.entity);
          // Handle order completion
          handleOrderPaid(payload.order.entity);
          break;
          
        default:
          logger.info('Unhandled webhook event:', event);
      }

      return res.status(200).json({ status: 'ok' });
    } else {
      logger.error('Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

  } catch (error) {
    logger.error('Webhook error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// ========================================
// WEBHOOK HANDLERS
// ========================================

async function handlePaymentCaptured(payment) {
  try {
    // Update payment status in database
    // Send confirmation email
    // Activate user subscription
    logger.info('Processing payment captured:', payment.id);
  } catch (error) {
    logger.error('Error handling payment captured:', error);
  }
}

async function handlePaymentFailed(payment) {
  try {
    // Update payment status in database
    // Send failure notification
    // Log failure reason
    logger.info('Processing payment failed:', payment.id);
  } catch (error) {
    logger.error('Error handling payment failed:', error);
  }
}

async function handleOrderPaid(order) {
  try {
    // Mark order as completed
    // Update subscription status
    logger.info('Processing order paid:', order.id);
  } catch (error) {
    logger.error('Error handling order paid:', error);
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function calculateEndDate(cycle) {
  const now = new Date();
  if (cycle === 'monthly') {
    return new Date(now.setMonth(now.getMonth() + 1));
  } else if (cycle === 'yearly') {
    return new Date(now.setFullYear(now.getFullYear() + 1));
  }
  return now;
}

module.exports = router;