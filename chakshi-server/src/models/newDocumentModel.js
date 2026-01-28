import mongoose from 'mongoose';

const newDocumentSchema = new mongoose.Schema(
  {
    // Document Information
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true,
      index: true
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },

    // File Details
    filename: {
      type: String,
      required: [true, 'Filename is required'],
      trim: true
    },

    originalFilename: {
      type: String,
      required: true,
      trim: true
    },

    filepath: {
      type: String,
      required: [true, 'File path is required']
    },

    mimetype: {
      type: String,
      required: true
    },

    size: {
      type: Number,
      required: true,
      min: 0
    },

    fileExtension: {
      type: String,
      trim: true
    },

    // Document Classification
    documentType: {
      type: String,
      required: [true, 'Document type is required'],
      enum: ['Case Law', 'Petition', 'Evidence', 'Other'],
      default: 'Other',
      index: true
    },

    // Related Case Reference
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NewCase',
      required: [true, 'Related case is required'],
      index: true
    },

    caseNumber: {
      type: String,
      index: true
    },

    caseTitle: {
      type: String
    },

    // Status & Metadata
    status: {
      type: String,
      enum: ['Uploaded', 'Verified', 'Archived', 'Deleted'],
      default: 'Uploaded',
      index: true
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
      index: true
    },

    verifiedAt: {
      type: Date
    },

    archivedAt: {
      type: Date
    },

    // User Management
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    // Additional Metadata
    tags: [{
      type: String,
      trim: true
    }],

    version: {
      type: Number,
      default: 1
    },

    downloads: {
      type: Number,
      default: 0,
      min: 0
    },

    views: {
      type: Number,
      default: 0,
      min: 0
    },

    // Soft Delete
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },

    deletedAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    collection: 'documents',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
newDocumentSchema.index({ title: 'text', description: 'text' });
newDocumentSchema.index({ caseId: 1, documentType: 1 });
newDocumentSchema.index({ uploadedAt: -1 });
newDocumentSchema.index({ status: 1, isDeleted: 1 });

// Pre-save middleware
newDocumentSchema.pre('save', function(next) {
  // Extract file extension
  if (this.originalFilename && !this.fileExtension) {
    const ext = this.originalFilename.split('.').pop();
    this.fileExtension = ext ? `.${ext.toLowerCase()}` : '';
  }
  next();
});

// Virtual for formatted file size
newDocumentSchema.virtual('formattedSize').get(function() {
  const bytes = this.size;
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
});

// Instance method to check if document is accessible
newDocumentSchema.methods.isAccessible = function() {
  return !this.isDeleted && this.status !== 'Deleted';
};

// Static method to find documents by case
newDocumentSchema.statics.findByCaseId = function(caseId) {
  return this.find({ 
    caseId, 
    isDeleted: false 
  }).sort({ uploadedAt: -1 });
};

export default mongoose.model('NewDocument', newDocumentSchema);
