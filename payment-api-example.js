// Backend API Example for Razorpay Integration
// This file shows how to implement the backend endpoints for payment processing

const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const app = express();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.use(express.json());

// Create Order Endpoint
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency, planName, billingCycle } = req.body;

    const options = {
      amount: amount, // amount in paise
      currency: currency || 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        planName,
        billingCycle,
        timestamp: new Date().toISOString()
      }
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      receipt: order.receipt
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      message: error.message 
    });
  }
});

// Verify Payment Endpoint
app.post('/api/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      plan,
      cycle
    } = req.body;

    // Create signature for verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment is verified
      // Here you would:
      // 1. Save payment details to database
      // 2. Activate user subscription
      // 3. Send confirmation email
      // 4. Update user's plan in your system

      console.log('Payment verified successfully:', {
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        plan,
        cycle
      });

      // Example: Save to database
      // await savePaymentToDatabase({
      //   paymentId: razorpay_payment_id,
      //   orderId: razorpay_order_id,
      //   plan,
      //   cycle,
      //   status: 'completed',
      //   timestamp: new Date()
      // });

      // Example: Update user subscription
      // await updateUserSubscription(userId, plan, cycle);

      res.json({
        success: true,
        message: 'Payment verified successfully',
        payment_id: razorpay_payment_id
      });

    } else {
      // Invalid signature
      res.status(400).json({
        success: false,
        error: 'Payment verification failed',
        message: 'Invalid signature'
      });
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      error: 'Payment verification failed',
      message: error.message
    });
  }
});

// Get Payment Status Endpoint (Optional)
app.get('/api/payment-status/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await razorpay.payments.fetch(paymentId);
    
    res.json({
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
      created_at: payment.created_at
    });

  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      error: 'Failed to fetch payment status',
      message: error.message
    });
  }
});

// Webhook Endpoint for Razorpay Events
app.post('/api/razorpay-webhook', (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (webhookSignature === expectedSignature) {
      const event = req.body.event;
      const payload = req.body.payload;

      switch (event) {
        case 'payment.captured':
          console.log('Payment captured:', payload.payment.entity);
          // Handle successful payment
          break;
          
        case 'payment.failed':
          console.log('Payment failed:', payload.payment.entity);
          // Handle failed payment
          break;
          
        default:
          console.log('Unhandled event:', event);
      }

      res.status(200).json({ status: 'ok' });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Payment API server running on port ${PORT}`);
});

module.exports = app;

/*
ENVIRONMENT VARIABLES NEEDED:
- RAZORPAY_KEY_ID: Your Razorpay Key ID
- RAZORPAY_KEY_SECRET: Your Razorpay Key Secret
- RAZORPAY_WEBHOOK_SECRET: Webhook secret for verification

FRONTEND ENVIRONMENT VARIABLES:
- REACT_APP_RAZORPAY_KEY_ID: Your Razorpay Key ID (for frontend)

INSTALLATION:
npm install razorpay express crypto

USAGE:
1. Set up environment variables
2. Run this server alongside your React app
3. Update the fetch URLs in the React component to match your server URL
4. Test with Razorpay test credentials first
*/