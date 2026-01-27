import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { 
  getTrialStatus, 
  cancelSubscription,
  getSubscriptionHistory 
} from '../controllers/subscriptionController.js';

const router = express.Router();

// ============================================
// SUBSCRIPTION ROUTES
// ============================================
// All routes require authentication

// Get current trial/subscription status
router.get('/trial-status', authenticate, getTrialStatus);

// Get subscription history
router.get('/history', authenticate, getSubscriptionHistory);

// Cancel subscription
router.post('/cancel', authenticate, cancelSubscription);

export default router;
