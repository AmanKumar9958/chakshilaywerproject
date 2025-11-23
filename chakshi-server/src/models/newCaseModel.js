import mongoose from 'mongoose';

console.log('📦 Loading NewCaseModel...');

const newCaseSchema = new mongoose.Schema(
  {
    // Basic Case Information
    caseNumber: { 
      type: String, 
      required: [true, 'Case number is required'], 
      unique: true,
      trim: true,
      index: true
    },
    
    caseTitle: { 
      type: String,
      trim: true,
      index: true
    },
    
    status: {
      type: String,
      enum: ['Active', 'Pending', 'Closed', 'active', 'closed', 'archived'],
      default: 'Active',
      index: true
    },
    
    stage: { 
      type: String, 
      default: 'Initial Filing',
      trim: true
    },

    // Parties Involved
    clientName: { 
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
      index: true
    },
    
    oppositeParty: { 
      type: String,
      required: [true, 'Opposing party is required'],
      trim: true,
      index: true
    },

    parties: [{
      type: String,
      trim: true
    }],

    // Court Details
    court: { 
      type: String,
      required: [true, 'Court name is required'],
      trim: true,
      index: true
    },
    
    judge: { 
      type: String,
      trim: true
    },

    // Case Classification
    caseType: {
      type: String,
      required: true,
      enum: ['Civil', 'Criminal', 'Family', 'Corporate', 'Other'],
      default: 'Civil',
      index: true
    },

    priority: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      default: 'Medium',
      index: true
    },

    // Important Dates
    filingDate: {
      type: Date,
      required: [true, 'Filing date is required'],
      index: true
    },

    nextHearing: {
      type: Date,
      index: true
    },

    hearingTime: {
      type: String,
      trim: true
    },

    createdDate: { 
      type: Date, 
      default: Date.now,
      index: true
    },
    
    lastUpdated: { 
      type: Date, 
      default: Date.now,
      index: true
    },

    // Case Details
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },

    // Acts & Sections
    actsSections: [{
      type: String,
      enum: [
        'IPC - Indian Penal Code',
        'CrPC - Criminal Procedure Code',
        'CPC - Civil Procedure Code',
        'Evidence Act',
        'IT Act - Information Technology Act',
        'Negotiable Instruments Act',
        'Companies Act',
        'Contract Act',
        'Property Law',
        'Family Law',
        'Labour Law',
        'Consumer Protection Act'
      ]
    }],

    // Additional Information
    advocate: {
      type: String,
      trim: true
    },

    // Documents Management
    documents: [
      {
        name: { 
          type: String,
          trim: true
        },
        url: { 
          type: String,
          trim: true
        },
        uploadedAt: { 
          type: Date, 
          default: Date.now 
        }
      }
    ],

    documentCount: {
      type: Number,
      default: 0,
      min: 0
    },

    // Timeline Management
    timeline: [
      {
        stage: { 
          type: String,
          trim: true
        },
        date: { 
          type: Date
        },
        status: { 
          type: String,
          trim: true
        },
        description: { 
          type: String,
          trim: true,
          maxlength: 500
        }
      }
    ],

    // User Management
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    // Favorites Feature
    favoritedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],

    // Soft Delete / Archive
    isArchived: {
      type: Boolean,
      default: false,
      index: true
    },

    archivedAt: {
      type: Date
    }
  },
  { 
    timestamps: true,
    collection: 'cases',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound Indexes
newCaseSchema.index({ caseNumber: 1, status: 1 });
newCaseSchema.index({ clientName: 'text', oppositeParty: 'text', caseTitle: 'text' });
newCaseSchema.index({ nextHearing: 1, status: 1 });
newCaseSchema.index({ filingDate: -1 });
newCaseSchema.index({ court: 1, status: 1 });
newCaseSchema.index({ caseType: 1, priority: 1 });

// Virtual for formatted case title
newCaseSchema.virtual('formattedTitle').get(function() {
  if (this.clientName && this.oppositeParty) {
    return `${this.clientName} vs ${this.oppositeParty}`;
  }
  return this.caseTitle || 'Untitled Case';
});

// Pre-save middleware
newCaseSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  
  // Auto-generate case title
  if (!this.caseTitle && this.clientName && this.oppositeParty) {
    this.caseTitle = `${this.clientName} vs ${this.oppositeParty}`;
  }
  
  // Auto-populate parties array
  if (this.clientName && this.oppositeParty) {
    this.parties = [this.clientName, this.oppositeParty];
  }

  // Update document count
  if (this.documents) {
    this.documentCount = this.documents.length;
  }
  
  next();
});

// Instance method to check if case is overdue
newCaseSchema.methods.isOverdue = function() {
  if (!this.nextHearing) return false;
  return new Date() > this.nextHearing && this.status !== 'Closed';
};

// Static method to find active cases
newCaseSchema.statics.findActiveCases = function() {
  return this.find({ 
    status: { $in: ['Active', 'active'] }, 
    isArchived: false 
  }).sort({ nextHearing: 1 });
};

// ✅ FIX: Prevent OverwriteModelError
const NewCaseModel = mongoose.models.NewCase || mongoose.model('NewCase', newCaseSchema);

console.log('✅ NewCaseModel loaded successfully');
console.log('   Model Name:', NewCaseModel.modelName);
console.log('   Collection:', NewCaseModel.collection.name);

export default NewCaseModel;
