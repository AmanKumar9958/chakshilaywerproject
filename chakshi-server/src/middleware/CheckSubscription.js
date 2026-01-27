import User from '../models/User.js';

// ============================================
// 🎫 SUBSCRIPTION ACCESS MIDDLEWARE
// ============================================
// Purpose: Check if user has active trial or subscription
// Use: Protect premium features

export const checkSubscriptionAccess = async (req, res, next) => {
  try {
    console.log('\n🎫 Subscription check started');
    
    if (!req.user) {
      console.log('❌ No user found in request');
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userId = req.user._id || req.user.id;
    console.log('👤 Checking subscription for user:', req.user.email);

    // Get fresh user data with subscription info
    const user = await User.findById(userId);

    if (!user) {
      console.log('❌ User not found in database');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Display current subscription status
    console.log('📊 Subscription Status:');
    console.log('   Status:', user.subscription?.status || 'none');
    console.log('   Plan:', user.subscription?.planName || 'none');
    console.log('   Start Date:', user.subscription?.startDate || 'N/A');
    console.log('   End Date:', user.subscription?.endDate || 'N/A');
    console.log('   Days Remaining:', user.subscriptionDaysRemaining);
    console.log('   Has Access:', user.hasFeatureAccess());

    // ⭐ Check if user has feature access (trial or active subscription)
    if (user.hasFeatureAccess()) {
      console.log('✅ Access granted - User has valid subscription/trial');
      
      // Add subscription info to request for use in controllers
      req.userSubscription = {
        status: user.subscription.status,
        planName: user.subscription.planName,
        billingCycle: user.subscription.billingCycle,
        daysRemaining: user.subscriptionDaysRemaining,
        isTrial: user.subscription.status === 'trial',
        isExpiringSoon: user.isSubscriptionExpiringSoon,
        startDate: user.subscription.startDate,
        endDate: user.subscription.endDate
      };
      
      return next();
    }

    // ❌ No access - trial expired or no subscription
    console.log('❌ Access denied - No valid subscription/trial');
    
    const subscriptionStatus = user.subscription?.status || 'none';
    let message = '';
    let actionText = '';

    if (subscriptionStatus === 'trial') {
      message = '⏰ Your 7-day free trial has expired. Please upgrade to a paid plan to continue using premium features.';
      actionText = 'Upgrade Now';
    } else if (subscriptionStatus === 'expired') {
      message = '⏰ Your subscription has expired. Please renew to continue using premium features.';
      actionText = 'Renew Subscription';
    } else if (subscriptionStatus === 'cancelled') {
      message = '❌ Your subscription has been cancelled. Please reactivate to continue.';
      actionText = 'Reactivate';
    } else {
      message = '🔒 Premium feature requires an active subscription. Start your 7-day free trial today!';
      actionText = 'Start Free Trial';
    }

    return res.status(403).json({
      success: false,
      message: message,
      subscription: {
        status: subscriptionStatus,
        planName: user.subscription?.planName || 'Free',
        endDate: user.subscription?.endDate,
        daysRemaining: user.subscriptionDaysRemaining,
        isTrial: subscriptionStatus === 'trial'
      },
      action: {
        type: 'upgrade',
        url: '/pricing',
        buttonText: actionText
      }
    });

  } catch (error) {
    console.error('❌ Subscription check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking subscription status. Please try again.'
    });
  }
};

// ============================================
// ⚠️ TRIAL EXPIRY WARNING MIDDLEWARE
// ============================================
// Purpose: Warn user if trial is expiring soon (doesn't block access)
// Use: Show warning banners/notifications

export const checkTrialExpiry = async (req, res, next) => {
  try {
    console.log('⚠️ Checking trial expiry warning');
    
    if (!req.user) {
      return next();
    }

    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return next();
    }

    if (user.isSubscriptionExpiringSoon) {
      const daysLeft = user.subscriptionDaysRemaining;
      const statusType = user.subscription.status;
      
      console.log(`⚠️ ${statusType} expiring soon for ${user.email} - ${daysLeft} days left`);
      
      // Add warning to response headers (frontend can read this)
      res.setHeader('X-Subscription-Expiring', 'true');
      res.setHeader('X-Days-Remaining', daysLeft.toString());
      res.setHeader('X-Subscription-Status', statusType);
      res.setHeader('X-Warning-Message', 
        `Your ${statusType} expires in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}. Upgrade now to avoid interruption.`
      );
      
      console.log('📨 Expiry warning headers added to response');
    } else {
      console.log('✅ No expiry warning needed');
    }

    next();
  } catch (error) {
    console.error('❌ Trial expiry check error:', error);
    next(); // Continue anyway, this is just a warning
  }
};

// ============================================
// 🎯 SPECIFIC PLAN REQUIREMENT MIDDLEWARE
// ============================================
// Purpose: Require specific subscription plans for certain features
// Use: Premium features only for higher-tier plans

export const requirePlan = (...allowedPlans) => {
  return async (req, res, next) => {
    try {
      console.log('🎯 Checking plan requirement');
      console.log('   Required plans:', allowedPlans);
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userId = req.user._id || req.user.id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // First check if user has any access
      if (!user.hasFeatureAccess()) {
        return res.status(403).json({
          success: false,
          message: 'Active subscription required to access this feature'
        });
      }

      const userPlan = user.subscription.planName;
      console.log('   User plan:', userPlan);

      // Check if user's plan is in allowed list
      if (!allowedPlans.includes(userPlan)) {
        console.log('❌ Plan requirement not met');
        return res.status(403).json({
          success: false,
          message: `This feature requires ${allowedPlans.join(' or ')} plan. You currently have ${userPlan} plan.`,
          requiredPlans: allowedPlans,
          currentPlan: userPlan,
          action: {
            type: 'upgrade',
            url: '/pricing',
            buttonText: 'Upgrade Plan'
          }
        });
      }

      console.log('✅ Plan requirement met');
      next();
    } catch (error) {
      console.error('❌ Plan check error:', error);
      res.status(500).json({
        success: false,
        message: 'Error checking plan requirements'
      });
    }
  };
};

// ============================================
// 🆓 OPTIONAL: ALLOW FREE TRIAL ONLY
// ============================================
// Purpose: Allow access only during trial period
// Use: Features you want to showcase during trial

export const requireTrial = async (req, res, next) => {
  try {
    console.log('🆓 Checking trial-only access');
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.subscription?.status === 'trial' && user.hasFeatureAccess()) {
      console.log('✅ Trial access granted');
      return next();
    }

    console.log('❌ Trial access denied');
    res.status(403).json({
      success: false,
      message: 'This feature is only available during free trial period'
    });

  } catch (error) {
    console.error('❌ Trial check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking trial status'
    });
  }
};
