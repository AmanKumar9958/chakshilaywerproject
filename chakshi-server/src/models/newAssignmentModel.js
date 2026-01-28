import mongoose from 'mongoose';

const newAssignmentSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
      index: true
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },

    // Course Information
    course: {
      type: String,
      required: [true, 'Course is required'],
      trim: true,
      index: true
    },

    professor: {
      type: String,
      trim: true
    },

    // Assignment Details
    assignmentType: {
      type: String,
      enum: [
        'case-analysis',
        'comparative-research',
        'video-submission',
        'drafting-exercise',
        'knowledge-check',
        'other'
      ],
      default: 'case-analysis',
      index: true
    },

    submissionType: {
      type: String,
      enum: ['document', 'video', 'audio', 'quiz', 'other'],
      default: 'document'
    },

    bloomLevel: {
      type: String,
      enum: [
        'knowledge',
        'comprehension',
        'application',
        'analysis',
        'synthesis',
        'evaluation'
      ],
      default: 'knowledge',
      index: true
    },

    // Status & Progress
    status: {
      type: String,
      enum: ['draft', 'pending', 'in-progress', 'completed', 'overdue', 'archived'],
      default: 'pending',
      index: true
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
      index: true
    },

    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },

    // Dates
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
      index: true
    },

    submittedDate: {
      type: Date
    },

    completedDate: {
      type: Date
    },

    // Points & Grading
    points: {
      type: Number,
      default: 100,
      min: 0
    },

    earnedPoints: {
      type: Number,
      min: 0
    },

    grade: {
      type: String,
      trim: true
    },

    // Time Management
    estimatedTime: {
      type: String,
      trim: true
    },

    actualTime: {
      type: String,
      trim: true
    },

    // Flags
    isStarred: {
      type: Boolean,
      default: false,
      index: true
    },

    aiFeedback: {
      type: Boolean,
      default: false
    },

    isArchived: {
      type: Boolean,
      default: false,
      index: true
    },

    // User Management
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    // Additional Information
    notes: {
      type: String,
      trim: true
    },

    tags: [{
      type: String,
      trim: true
    }],

    attachments: [{
      name: String,
      url: String,
      size: Number,
      type: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],

    resources: [{
      title: String,
      url: String,
      type: String
    }],

    // Feedback
    feedback: {
      type: String,
      trim: true
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
    collection: 'assignments',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
newAssignmentSchema.index({ title: 'text', description: 'text', course: 'text' });
newAssignmentSchema.index({ course: 1, status: 1 });
newAssignmentSchema.index({ dueDate: 1, status: 1 });
newAssignmentSchema.index({ priority: 1, status: 1 });
newAssignmentSchema.index({ isStarred: 1, isArchived: 1, isDeleted: 1 });

// Virtual for days until due
newAssignmentSchema.virtual('daysUntilDue').get(function() {
  if (!this.dueDate) return null;
  const now = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for completion percentage
newAssignmentSchema.virtual('completionPercentage').get(function() {
  if (!this.points || !this.earnedPoints) return 0;
  return Math.round((this.earnedPoints / this.points) * 100);
});

// Pre-save middleware to update status based on dates
newAssignmentSchema.pre('save', function(next) {
  const now = new Date();
  
  // Auto-update to overdue if past due date and not completed
  if (this.dueDate && this.dueDate < now && this.status !== 'completed') {
    this.status = 'overdue';
  }

  // Set completed date if status changed to completed
  if (this.status === 'completed' && !this.completedDate) {
    this.completedDate = new Date();
  }

  next();
});

// Instance method to check if overdue
newAssignmentSchema.methods.isOverdue = function() {
  if (!this.dueDate || this.status === 'completed') return false;
  return new Date() > new Date(this.dueDate);
};

// Instance method to check if accessible
newAssignmentSchema.methods.isAccessible = function() {
  return !this.isDeleted && !this.isArchived;
};

// Static method to find by course
newAssignmentSchema.statics.findByCourse = function(course) {
  return this.find({ 
    course, 
    isDeleted: false,
    isArchived: false
  }).sort({ dueDate: 1 });
};

// Static method to find overdue
newAssignmentSchema.statics.findOverdue = function() {
  return this.find({
    dueDate: { $lt: new Date() },
    status: { $nin: ['completed', 'archived'] },
    isDeleted: false
  }).sort({ dueDate: 1 });
};

export default mongoose.model('NewAssignment', newAssignmentSchema);
