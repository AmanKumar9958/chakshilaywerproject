import mongoose from 'mongoose';

console.log('🔧 Loading Case Details Models...');

// ═══════════════════════════════════════════════════════════════
// TIMELINE MODEL
// ═══════════════════════════════════════════════════════════════

const timelineSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
      index: true
    },
    caseNumber: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    stage: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['completed', 'active', 'ongoing', 'pending'],
      default: 'ongoing',
      lowercase: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    remarks: {
      type: String,
      trim: true,
      default: ''
    },
    createdBy: {
      type: String,
      default: 'System'
    }
  },
  {
    timestamps: true,
    collection: 'timelines'
  }
);

// Timeline indexes
timelineSchema.index({ caseId: 1, createdAt: -1 });
timelineSchema.index({ caseNumber: 1, createdAt: -1 });
timelineSchema.index({ status: 1 });

// Timeline static methods
timelineSchema.statics.findByCaseId = function(caseId) {
  return this.find({ caseId }).sort({ createdAt: 1 });
};

timelineSchema.statics.findByCaseNumber = function(caseNumber) {
  return this.find({ caseNumber }).sort({ createdAt: 1 });
};

console.log('✅ Timeline Schema Created');

// ═══════════════════════════════════════════════════════════════
// PAYMENT MODEL
// ═══════════════════════════════════════════════════════════════

const paymentSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
      index: true
    },
    caseNumber: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    date: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['paid', 'pending', 'due'],
      default: 'pending',
      lowercase: true
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'cheque', 'online', 'upi', 'card', 'other'],
      default: 'cash'
    },
    transactionId: {
      type: String,
      trim: true,
      default: ''
    },
    remarks: {
      type: String,
      trim: true,
      default: ''
    },
    createdBy: {
      type: String,
      default: 'System'
    }
  },
  {
    timestamps: true,
    collection: 'payments'
  }
);

// Payment indexes
paymentSchema.index({ caseId: 1, createdAt: -1 });
paymentSchema.index({ caseNumber: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ date: -1 });

// Payment virtuals
paymentSchema.virtual('formattedAmount').get(function() {
  return `₹${this.amount.toLocaleString('en-IN')}`;
});

// Payment static methods
paymentSchema.statics.findByCaseId = function(caseId) {
  return this.find({ caseId }).sort({ createdAt: -1 });
};

paymentSchema.statics.findByCaseNumber = function(caseNumber) {
  return this.find({ caseNumber }).sort({ createdAt: -1 });
};

paymentSchema.statics.getStatsByCaseId = async function(caseId) {
  const payments = await this.find({ caseId });
  
  const total = payments.reduce((sum, p) => sum + p.amount, 0);
  const paid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const pending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const due = payments.filter(p => p.status === 'due').reduce((sum, p) => sum + p.amount, 0);
  
  return {
    total,
    paid,
    pending,
    due,
    outstanding: total - paid,
    count: payments.length
  };
};

console.log('✅ Payment Schema Created');

// ═══════════════════════════════════════════════════════════════
// NOTE MODEL
// ═══════════════════════════════════════════════════════════════

const noteSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
      index: true
    },
    caseNumber: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      default: 'System',
      trim: true
    },
    category: {
      type: String,
      enum: ['general', 'important', 'reminder', 'research', 'client', 'court', 'other'],
      default: 'general'
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    tags: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true,
    collection: 'notes'
  }
);

// Note indexes
noteSchema.index({ caseId: 1, createdAt: -1 });
noteSchema.index({ caseNumber: 1, createdAt: -1 });
noteSchema.index({ author: 1 });
noteSchema.index({ category: 1 });
noteSchema.index({ isPinned: -1, createdAt: -1 });

// Note static methods
noteSchema.statics.findByCaseId = function(caseId) {
  return this.find({ caseId }).sort({ isPinned: -1, createdAt: -1 });
};

noteSchema.statics.findByCaseNumber = function(caseNumber) {
  return this.find({ caseNumber }).sort({ isPinned: -1, createdAt: -1 });
};

// Note instance methods
noteSchema.methods.togglePin = async function() {
  this.isPinned = !this.isPinned;
  return await this.save();
};

console.log('✅ Note Schema Created');

// ═══════════════════════════════════════════════════════════════
// CREATE AND EXPORT MODELS
// ═══════════════════════════════════════════════════════════════

const Timeline = mongoose.model('Timeline', timelineSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const Note = mongoose.model('Note', noteSchema);

console.log('✅ All Case Detail Models Loaded Successfully');
console.log('   📅 Timeline Model');
console.log('   💰 Payment Model');
console.log('   📝 Note Model');

export {
  Timeline,
  Payment,
  Note
};
