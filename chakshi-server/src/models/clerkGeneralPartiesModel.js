import mongoose from 'mongoose';

console.log('📦 Loading ClerkGeneralParties Model...');

const clerkGeneralPartiesSchema = new mongoose.Schema({
  // Basic Party Information
  name: {
    type: String,
    required: [true, 'Party name is required'],
    trim: true,
    index: true
  },
  
  type: {
    type: String,
    enum: ['Individual', 'Company', 'Government'],
    default: 'Individual',
    required: true,
    index: true
  },

  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'],
    default: 'Active',
    index: true
  },

  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },

  // Contact Information
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    index: true
  },

  phone: {
    type: String,
    trim: true
  },

  address: {
    type: String,
    trim: true
  },

  // Professional Details
  occupation: {
    type: String,
    trim: true
  },

  company: {
    type: String,
    trim: true
  },

  // ID Proofs
  idProofs: [{
    type: {
      type: String,
      enum: ['PAN Card', 'Aadhaar', 'GST Number', 'CIN', 'Passport', 'Driving License', 'Other']
    },
    number: {
      type: String,
      trim: true
    },
    verified: {
      type: Boolean,
      default: false
    },
    fileUrl: {
      type: String
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Document Storage
  panCard: {
    fileUrl: String,
    number: String,
    uploadedAt: Date
  },

  aadhaarCard: {
    fileUrl: String,
    number: String,
    uploadedAt: Date
  },

  // Case Statistics
  linkedCases: {
    type: Number,
    default: 0
  },

  totalCases: {
    type: Number,
    default: 0
  },

  activeCases: {
    type: Number,
    default: 0
  },

  closedCases: {
    type: Number,
    default: 0
  },

  // Financial Information
  outstandingDues: {
    type: Number,
    default: 0,
    min: 0
  },

  totalRevenue: {
    type: Number,
    default: 0,
    min: 0
  },

  // Case References (will be populated from NewCaseModel)
  caseIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NewCase'
  }],

  // Document References (will be populated from newDocumentModel)
  documentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],

  // Payment History
  paymentHistory: [{
    amount: Number,
    method: String,
    invoice: String,
    date: Date,
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Overdue'],
      default: 'Pending'
    }
  }],

  // Communication History
  communications: [{
    type: {
      type: String,
      enum: ['Meeting', 'Call', 'Email', 'Video Call', 'Message']
    },
    subject: String,
    date: Date,
    duration: String,
    status: {
      type: String,
      enum: ['Completed', 'Scheduled', 'Cancelled', 'Sent']
    },
    notes: String
  }],

  // Insights/Analytics
  insights: {
    successRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    referralsGiven: {
      type: Number,
      default: 0
    },
    avgCaseDuration: {
      type: Number,
      default: 0
    },
    satisfactionScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },

  // Notes and Additional Information
  notes: {
    type: String,
    trim: true
  },

  // Metadata
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  addedDate: {
    type: Date,
    default: Date.now,
    index: true
  },

  lastModified: {
    type: Date,
    default: Date.now
  },

  isArchived: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
clerkGeneralPartiesSchema.index({ name: 'text', email: 'text', company: 'text' });
clerkGeneralPartiesSchema.index({ type: 1, status: 1 });
clerkGeneralPartiesSchema.index({ addedDate: -1 });

// Virtual for formatted name
clerkGeneralPartiesSchema.virtual('displayName').get(function() {
  if (this.type === 'Company' && this.company) {
    return this.company;
  }
  return this.name;
});

// Pre-save middleware
clerkGeneralPartiesSchema.pre('save', function(next) {
  this.lastModified = Date.now();
  next();
});

// Static method to find parties with linked cases
clerkGeneralPartiesSchema.statics.findPartiesWithCases = function() {
  return this.find({ linkedCases: { $gt: 0 } })
    .populate('caseIds', 'caseNumber caseTitle status')
    .sort({ linkedCases: -1 });
};

// Instance method to update case statistics
clerkGeneralPartiesSchema.methods.updateCaseStats = async function() {
  const NewCase = mongoose.model('NewCase');
  const cases = await NewCase.find({ _id: { $in: this.caseIds } });
  
  this.totalCases = cases.length;
  this.activeCases = cases.filter(c => c.status === 'Active').length;
  this.closedCases = cases.filter(c => c.status === 'Closed').length;
  this.linkedCases = cases.length;
  
  await this.save();
};

// Prevent overwrite error
const ClerkGeneralParties = mongoose.models.ClerkGeneralParties || 
  mongoose.model('ClerkGeneralParties', clerkGeneralPartiesSchema);

console.log('✅ ClerkGeneralParties Model loaded successfully');
console.log('   Model Name:', ClerkGeneralParties.modelName);
console.log('   Collection:', ClerkGeneralParties.collection.name);

export default ClerkGeneralParties;
