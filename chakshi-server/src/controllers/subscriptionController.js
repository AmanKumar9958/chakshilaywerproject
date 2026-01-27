import User from '../models/User.js';

// ============================================
// GET TRIAL/SUBSCRIPTION STATUS
// ============================================
export const getTrialStatus = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('📊 Fetching subscription status for:', user.email);

    res.json({
      success: true,
      subscription: {
        status: user.subscription?.status || 'none',
        planName: user.subscription?.planName || 'Free',
        billingCycle: user.subscription?.billingCycle || 'none',
        startDate: user.subscription?.startDate,
        endDate: user.subscription?.endDate,
        daysRemaining: user.subscriptionDaysRemaining,
        isTrial: user.subscription?.status === 'trial',
        isActive: user.hasActiveSubscription,
        hasAccess: user.hasFeatureAccess(),
        isExpiringSoon: user.isSubscriptionExpiringSoon,
        autoRenew: user.subscription?.autoRenew || false
      },
      trial: {
        isActive: user.subscription?.trial?.isActive || false,
        startDate: user.subscription?.trial?.startDate,
        endDate: user.subscription?.trial?.endDate
      },
      lastPayment: user.subscription?.lastPayment || null
    });

  } catch (error) {
    console.error('❌ Error fetching trial status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trial status'
    });
  }
};

// ============================================
// GET SUBSCRIPTION HISTORY
// ============================================
export const getSubscriptionHistory = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId).populate('paymentHistory');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('📜 Fetching subscription history for:', user.email);

    res.json({
      success: true,
      history: user.paymentHistory || [],
      currentSubscription: {
        status: user.subscription?.status || 'none',
        planName: user.subscription?.planName || 'Free',
        startDate: user.subscription?.startDate,
        endDate: user.subscription?.endDate
      }
    });

  } catch (error) {
    console.error('❌ Error fetching subscription history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription history'
    });
  }
};

// ============================================
// CANCEL SUBSCRIPTION
// ============================================
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { reason } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.subscription || user.subscription.status === 'none') {
      return res.status(400).json({
        success: false,
        message: 'No active subscription to cancel'
      });
    }

    console.log('❌ Cancelling subscription for:', user.email);
    console.log('   Reason:', reason || 'Not provided');

    // Cancel subscription
    await user.cancelSubscription(reason);

    res.json({
      success: true,
      message: 'Subscription cancelled successfully. Access will continue until the end of your billing period.',
      subscription: {
        status: user.subscription.status,
        endDate: user.subscription.endDate,
        daysRemaining: user.subscriptionDaysRemaining
      }
    });

  } catch (error) {
    console.error('❌ Error cancelling subscription:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error cancelling subscription'
    });
  }
};
