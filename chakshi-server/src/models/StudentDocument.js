const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  filename: {
    type: String,
    required: [true, 'Filename is required']
  },
  originalName: {
    type: String,
    required: [true, 'Original filename is required']
  },
  documentType: {
    type: String,
    required: [true, 'Document type is required'],
    enum: {
      values: ['Notes', 'Assignment', 'Research', 'Certificate', 'Other'],
      message: '{VALUE} is not a valid document type'
    },
    default: 'Other'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  size: {
    type: Number,
    required: [true, 'File size is required'],
    min: [0, 'File size cannot be negative']
  },
  mimetype: {
    type: String,
    required: [true, 'MIME type is required'],
    enum: {
      values: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png'
      ],
      message: '{VALUE} is not a supported file type'
    }
  },
  path: {
    type: String,
    required: [true, 'File path is required']
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
}, {
  timestamps: true
});

// Index for faster queries
documentSchema.index({ uploadedAt: -1 });
documentSchema.index({ documentType: 1 });

module.exports = mongoose.model('StudentDocument', documentSchema);
