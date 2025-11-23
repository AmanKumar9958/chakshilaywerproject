import mongoose from 'mongoose';

const clerkDashboardSchema = new mongoose.Schema({
  clerkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stats: {
    totalCases: {
      type: Number,
      default: 0
    },
    activeCases: {
      type: Number,
      default: 0
    },
    pendingCases: {
      type: Number,
      default: 0
    },
    closedCases: {
      type: Number,
      default: 0
    },
    upcomingHearings: {
      type: Number,
      default: 0
    }
  },
  recentCases: [{
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClerkCaseDetails'
    },
    caseNumber: String,
    title: String,
    status: {
      type: String,
      enum: ['Active', 'Pending', 'Closed', 'On Hold'],
      default: 'Active'
    },
    priority: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      default: 'Medium'
    },
    lastUpdate: Date
  }],
  upcomingHearings: [{
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClerkCaseDetails'
    },
    caseNumber: String,
    title: String,
    court: String,
    judge: String,
    date: Date,
    time: String,
    status: {
      type: String,
      enum: ['Scheduled', 'In Progress', 'Completed', 'Postponed', 'Cancelled'],
      default: 'Scheduled'
    }
  }],
  notifications: [{
    title: String,
    message: String,
    type: {
      type: String,
      enum: ['info', 'warning', 'success', 'error'],
      default: 'info'
    },
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
clerkDashboardSchema.index({ clerkId: 1 });
clerkDashboardSchema.index({ lastUpdated: -1 });

export default mongoose.model('ClerkDashboard', clerkDashboardSchema);
