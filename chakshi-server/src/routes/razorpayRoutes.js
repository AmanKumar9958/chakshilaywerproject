import express from 'express';
import {
  createOrder,
  verifyPayment,
  getPaymentDetails,
  handleWebhook
} from '../controllers/razorpayController.js';

const router = express.Router();

// Create Razorpay order
router.post('/create-order', createOrder);

// Verify payment signature
router.post('/verify-payment', verifyPayment);

// Get payment details by payment ID
router.get('/payment/:paymentId', getPaymentDetails);

// Webhook endpoint for Razorpay events (optional but recommended)
router.post('/webhook', handleWebhook);

export default router;
