import mongoose from 'mongoose';

const clerkCaseDetailsSchema = new mongoose.Schema({
  caseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  caseTitle: {
    type: String,
    required: true,
    trim: true
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  clientContact: {
    type: String,
    trim: true
  },
  oppositeParty: {
    type: String,
    required: true,
    trim: true
  },
  oppositeAdvocate: {
    type: String,
    trim: true
  },
  oppositeContact: {
    type: String,
    trim: true
  },
  advocate: {
    type: String,
    trim: true
  },
  court: {
    type: String,
    required: true,
    trim: true
  },
  caseType: {
    type: String,
    required: true,
    enum: ['Civil', 'Criminal', 'Family', 'Corporate', 'Property', 'Consumer', 'Labor', 'Tax', 'Other'],
    default: 'Civil'
  },
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Closed', 'On Hold', 'Disposed'],
    default: 'Active'
  },
  priority: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    default: 'Medium'
  },
  filingDate: {
    type: Date,
    required: true
  },
  nextHearing: {
    type: Date,
    default: null
  },
  hearingTime: {
    type: String,
    default: null
  },
  judge: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  actsSections: [{
    type: String,
    trim: true
  }],
  caseHistory: [{
    event: {
      type: String,
      required: true
    },
    details: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      default: '10:00'
    },
    by: {
      type: String,
      default: 'System'
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date,
      default: null
    },
    completedBy: {
      type: String,
      default: null
    },
    remarks: [{
      text: String,
      by: String,
      date: Date
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  hearings: [{
    id: Number,
    name: String,
    date: Date,
    time: String,
    court: String,
    judge: String,
    remarks: [{
      id: Number,
      text: String,
      by: String,
      date: Date
    }]
  }],
  documents: [{
    id: String,
    name: String,
    type: String,
    size: String,
    uploadedBy: String,
    uploadedAt: Date,
    url: String,
    description: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Indexes for faster queries
clerkCaseDetailsSchema.index({ caseNumber: 1 });
clerkCaseDetailsSchema.index({ status: 1 });
clerkCaseDetailsSchema.index({ priority: 1 });
clerkCaseDetailsSchema.index({ nextHearing: 1 });
clerkCaseDetailsSchema.index({ createdAt: -1 });

export default mongoose.model('ClerkCaseDetails', clerkCaseDetailsSchema);
