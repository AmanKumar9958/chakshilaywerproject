import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  
  // Razorpay Order Details
  orderId: {
    type: String,
    required: [true, 'Order ID is required'],
    unique: true,
    trim: true
  },
  
  // Razorpay Payment Details
  paymentId: {
    type: String,
    required: [true, 'Payment ID is required'],
    unique: true,
    trim: true
  },
  
  // Payment Signature for Verification
  signature: {
    type: String,
    required: [true, 'Payment signature is required']
  },
  
  // Payment Amount
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive']
  },
  
  // Currency
  currency: {
    type: String,
    default: 'INR',
    uppercase: true,
    trim: true
  },
  
  // Payment Status
  status: {
    type: String,
    enum: {
      values: ['pending', 'success', 'failed', 'refunded'],
      message: '{VALUE} is not a valid payment status'
    },
    default: 'success'
  },
  
  // Plan Information
  planName: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true
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
  
  // User Role
  userRole: {
    type: String,
    enum: {
      values: ['student', 'advocate', 'clerk'],
      message: '{VALUE} is not a valid user role'
    },
    required: [true, 'User role is required']
  },
  
  // Receipt Number
  receipt: {
    type: String,
    trim: true
  },
  
  // Payment Method (card, upi, netbanking, etc.)
  paymentMethod: {
    type: String,
    trim: true
  },
  
  // User Email
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  
  // User Contact
  contact: {
    type: String,
    trim: true
  },
  
  // Additional Notes
  notes: {
    type: Map,
    of: String
  },
  
  // Refund Information (if applicable)
  refund: {
    refundId: String,
    refundAmount: Number,
    refundStatus: String,
    refundDate: Date,
    refundReason: String
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// Virtual for amount in rupees (convert from paise)
paymentSchema.virtual('amountInRupees').get(function() {
  return this.amount / 100;
});

// Instance method to check if payment is successful
paymentSchema.methods.isSuccessful = function() {
  return this.status === 'success';
};

// Static method to get total revenue
paymentSchema.statics.getTotalRevenue = async function() {
  const result = await this.aggregate([
    { $match: { status: 'success' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  return result.length > 0 ? result[0].total / 100 : 0; // Convert to rupees
};

// Static method to get payments by user
paymentSchema.statics.getPaymentsByUser = async function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

// Pre-save middleware for logging
paymentSchema.pre('save', function(next) {
  console.log(`💾 Saving payment: ${this.paymentId} for user: ${this.userId}`);
  next();
});

// Post-save middleware
paymentSchema.post('save', function(doc) {
  console.log(`✅ Payment saved successfully: ${doc.paymentId}`);
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
