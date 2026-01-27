import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const { amount, currency, planName, billingCycle, userRole, userId } = req.body;

    // Validate required fields
    if (!amount || !currency) {
      return res.status(400).json({
        success: false,
        message: 'Amount and currency are required'
      });
    }

    // Validate amount is positive
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    const options = {
      amount: amount, // Amount in paise (already converted from frontend)
      currency: currency,
      receipt: `receipt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      notes: {
        planName: planName || 'N/A',
        billingCycle: billingCycle || 'N/A',
        userRole: userRole || 'N/A',
        userId: userId || 'N/A',
        createdAt: new Date().toISOString()
      }
    };

    console.log('📦 Creating Razorpay order with options:', {
      amount: options.amount,
      currency: options.currency,
      receipt: options.receipt
    });

    const order = await razorpayInstance.orders.create(options);

    console.log('✅ Order created successfully:', order.id);

    res.status(200).json({
      success: true,
      message: 'Order created successfully',
      orderId: order.id,
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      receipt: order.receipt
    });

  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// @desc    Verify Payment Signature
// @route   POST /api/payment/verify-payment
// @access  Public
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification fields'
      });
    }

    console.log('🔐 Verifying payment signature for:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id
    });

    // Create expected signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    // Verify signature
    if (razorpay_signature === expectedSignature) {
      console.log('✅ Payment signature verified successfully');

      // TODO: Update your database here
      // Example: Update user subscription, save payment record, etc.
      // await savePaymentToDatabase({
      //   orderId: razorpay_order_id,
      //   paymentId: razorpay_payment_id,
      //   status: 'success'
      // });

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id
      });
    } else {
      console.error('❌ Invalid payment signature');
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

// @desc    Get Payment Details
// @route   GET /api/payment/payment/:paymentId
// @access  Public/Protected
export const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required'
      });
    }

    console.log('📋 Fetching payment details for:', paymentId);

    const payment = await razorpayInstance.payments.fetch(paymentId);

    console.log('✅ Payment details retrieved successfully');

    res.status(200).json({
      success: true,
      payment: payment
    });

  } catch (error) {
    console.error('❌ Error fetching payment details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
      error: error.message
    });
  }
};

// @desc    Handle Razorpay Webhooks
// @route   POST /api/payment/webhook
// @access  Public (but signature verified)
export const handleWebhook = async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.warn('⚠️  Webhook secret not configured');
      return res.status(500).json({
        success: false,
        message: 'Webhook secret not configured'
      });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      console.error('❌ Invalid webhook signature');
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    console.log('📬 Webhook received:', event);

    // Handle different webhook events
    switch (event) {
      case 'payment.authorized':
        console.log('💰 Payment authorized:', payload.payment.entity.id);
        // TODO: Update database - payment authorized
        break;

      case 'payment.captured':
        console.log('✅ Payment captured:', payload.payment.entity.id);
        // TODO: Update database - payment successful
        break;

      case 'payment.failed':
        console.log('❌ Payment failed:', payload.payment.entity.id);
        // TODO: Update database - payment failed
        break;

      case 'order.paid':
        console.log('📦 Order paid:', payload.order.entity.id);
        // TODO: Update database - order completed
        break;

      default:
        console.log('ℹ️  Unhandled webhook event:', event);
    }

    res.status(200).json({ success: true, received: true });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message
    });
  }
};
