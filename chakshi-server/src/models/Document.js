const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  filePath: { 
    type: String, 
    required: true 
  },
  fileType: { 
    type: String 
  },
  size: { 
    type: String 
  },
  category: { 
    type: String,
    required: true,
    enum: ['Plaint', 'Evidence', 'Court Order', 'Correspondence', 'Contract', 'Affidavit', 'Other'],
    trim: true
  },
  
  // ⭐ MongoDB ObjectId reference (for proper relations)
  linkedCase: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Case', 
    default: null 
  },
  
  // ⭐ Case Number string (for easy querying by case number)
  linkedCaseNumber: { 
    type: String, 
    default: null,
    trim: true,
    index: true // Add index for faster queries
  },
  
  linkedClient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    default: null 
  },
  
  // Additional useful fields
  status: {
    type: String,
    enum: ['new', 'verified', 'draft'],
    default: 'new'
  },
  
  description: {
    type: String,
    trim: true
  },
  
  uploadedBy: {
    type: String,
    default: 'System'
  },
  
  uploadDate: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for faster queries
documentSchema.index({ linkedCaseNumber: 1, uploadDate: -1 });
documentSchema.index({ category: 1 });

// Virtual for file URL (useful for serving files)
documentSchema.virtual('fileUrl').get(function() {
  return `/uploads/docs/${this.filePath.split('/').pop()}`;
});

// Method to get file extension
documentSchema.methods.getFileExtension = function() {
  return this.filePath.split('.').pop().toLowerCase();
};

// Static method to find by case number
documentSchema.statics.findByCaseNumber = function(caseNumber) {
  return this.find({ linkedCaseNumber: caseNumber }).sort({ uploadDate: -1 });
};

// Pre-save hook to ensure at least one case reference exists
documentSchema.pre('save', function(next) {
  if (!this.linkedCase && !this.linkedCaseNumber) {
    next(new Error('Either linkedCase or linkedCaseNumber must be provided'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Document', documentSchema);
