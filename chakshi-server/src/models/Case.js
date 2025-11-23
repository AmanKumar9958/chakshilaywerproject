import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema(
  {
    caseNumber: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true 
    },
    court: { 
      type: String,
      trim: true 
    },
    caseTitle: { 
      type: String,
      trim: true 
    },
    clientName: { 
      type: String,
      trim: true 
    },
    oppositeParty: { 
      type: String,
      trim: true 
    },
    status: {
      type: String,
      enum: ['active', 'won', 'lost', 'settled', 'archived'],
      
      lowercase: true
    },
    stage: { 
      type: String, 
      default: 'Initial Filing',
      trim: true 
    },
    nextHearing: { 
      type: String 
    },
    createdDate: { 
      type: Date, 
      default: Date.now 
    },
    lastUpdated: { 
      type: Date, 
      default: Date.now 
    },
    documents: [
      {
        name: { type: String },
        url: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    timeline: [
      {
        stage: { type: String },
        date: { type: String },
        status: { type: String },
        description: { type: String },
      },
    ],
  },
  { 
    timestamps: true, 
    collection: 'cases' 
  }
);

// Index for faster queries
caseSchema.index({ caseNumber: 1 });
caseSchema.index({ status: 1 });
caseSchema.index({ clientName: 1 });

// Update lastUpdated timestamp before save
caseSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

export default mongoose.model('Case', caseSchema);
