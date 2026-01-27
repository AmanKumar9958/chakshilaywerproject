import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  // User Reference (One subscription per user)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true,
    index: true
  },
  
  // Plan Details
  planName: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true
  },
  
  // User Role/Type
  userRole: {
    type: String,
    enum: {
      values: ['student', 'advocate', 'clerk'],
      message: '{VALUE} is not a valid user role'
    },
    required: [true, 'User role is required']
  },
  
  // Billing Cycle
  billingCycle: {
    type: String,
    enum: {
      values: ['monthly', 'yearly'],
      message: '{VALUE} is not a valid billing cycle'
    },
    required: [true, 'Billing cycle is required']
  },
  
  // Subscription Status
  status: {
    type: String,
    enum: {
      values: ['active', 'expired', 'cancelled', 'trial'],
      message: '{VALUE} is not a valid subscription status'
    },
    default: 'active'
  },
  
  // Start Date
  startDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  
  // End Date
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  
  // Subscription Amount (in paise)
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive']
  },
  
  // Last Payment ID (reference to Payment model)
  lastPaymentId: {
    type: String,
    trim: true
  },
  
  // Auto-renewal setting
  autoRenew: {
    type: Boolean,
    default: false
  },
  
  // Trial Information
  trial: {
    isActive: {
      type: Boolean,
      default: false
    },
    startDate: Date,
    endDate: Date,
    daysRemaining: Number
  },
  
  // Cancellation Information
  cancellation: {
    isCancelled: {
      type: Boolean,
      default: false
    },
    cancelledAt: Date,
    cancelReason: String,
    refundAmount: Number
  },
  
  // Payment History (array of payment IDs)
  paymentHistory: [{
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    },
    paidAt: Date,
    amount: Number
  }],
  
  // Additional Notes
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ status: 1, endDate: 1 });
subscriptionSchema.index({ endDate: 1 });

// Virtual for days remaining
subscriptionSchema.virtual('daysRemaining').get(function() {
  if (this.status !== 'active') return 0;
  const now = new Date();
  const diffTime = this.endDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Virtual for subscription duration in days
subscriptionSchema.virtual('durationInDays').get(function() {
  const diffTime = this.endDate - this.startDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for amount in rupees
subscriptionSchema.virtual('amountInRupees').get(function() {
  return this.amount / 100;
});

// Pre-save middleware to calculate end date
subscriptionSchema.pre('save', function(next) {
  // Only calculate if this is a new subscription or endDate is not set
  if (this.isNew && !this.endDate) {
    const start = this.startDate || new Date();
    if (this.billingCycle === 'monthly') {
      this.endDate = new Date(start.getTime());
      this.endDate.setMonth(this.endDate.getMonth() + 1);
    } else if (this.billingCycle === 'yearly') {
      this.endDate = new Date(start.getTime());
      this.endDate.setFullYear(this.endDate.getFullYear() + 1);
    }
  }
  
  console.log(`💾 Saving subscription for user: ${this.userId}`);
  next();
});

// Post-save middleware
subscriptionSchema.post('save', function(doc) {
  console.log(`✅ Subscription saved successfully for user: ${doc.userId}`);
});

// Instance method to check if subscription is active
subscriptionSchema.methods.isActive = function() {
  return this.status === 'active' && new Date() < this.endDate;
};

// Instance method to check if subscription is expiring soon (within 7 days)
subscriptionSchema.methods.isExpiringSoon = function() {
  if (this.status !== 'active') return false;
  const daysLeft = this.daysRemaining;
  return daysLeft > 0 && daysLeft <= 7;
};

// Instance method to cancel subscription
subscriptionSchema.methods.cancel = function(reason, refundAmount = 0) {
  this.status = 'cancelled';
  this.cancellation = {
    isCancelled: true,
    cancelledAt: new Date(),
    cancelReason: reason,
    refundAmount: refundAmount
  };
  console.log(`❌ Subscription cancelled for user: ${this.userId}`);
  return this.save();
};

// Instance method to renew subscription
subscriptionSchema.methods.renew = function(paymentId, amount) {
  const now = new Date();
  this.startDate = now;
  
  if (this.billingCycle === 'monthly') {
    this.endDate = new Date(now.getTime());
    this.endDate.setMonth(this.endDate.getMonth() + 1);
  } else if (this.billingCycle === 'yearly') {
    this.endDate = new Date(now.getTime());
    this.endDate.setFullYear(this.endDate.getFullYear() + 1);
  }
  
  this.status = 'active';
  this.lastPaymentId = paymentId;
  this.amount = amount;
  
  // Add to payment history
  this.paymentHistory.push({
    paymentId: paymentId,
    paidAt: now,
    amount: amount
  });
  
  console.log(`🔄 Subscription renewed for user: ${this.userId}`);
  return this.save();
};

// Static method to get active subscriptions count
subscriptionSchema.statics.getActiveCount = async function() {
  return this.countDocuments({ status: 'active' });
};

// Static method to get expiring subscriptions
subscriptionSchema.statics.getExpiringSoon = async function(days = 7) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    status: 'active',
    endDate: {
      $gte: new Date(),
      $lte: futureDate
    }
  }).populate('userId', 'email name');
};

// Static method to expire old subscriptions (run this daily via cron job)
subscriptionSchema.statics.expireOldSubscriptions = async function() {
  const result = await this.updateMany(
    {
      status: 'active',
      endDate: { $lt: new Date() }
    },
    {
      $set: { status: 'expired' }
    }
  );
  
  console.log(`⏰ Expired ${result.modifiedCount} subscriptions`);
  return result;
};

// Static method to get subscription by user ID
subscriptionSchema.statics.getByUserId = async function(userId) {
  return this.findOne({ userId }).populate('userId', 'email name');
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
