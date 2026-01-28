import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import NewAssignment from '../models/newAssignmentModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/assignments');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'assignment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|txt|jpg|jpeg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, TXT, and image files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

// ============= ASSIGNMENT ROUTES =============

// GET all assignments for student
router.get('/assignments', async (req, res) => {
  try {
    // In production, get studentId from authenticated user session
    // For now, using a placeholder
    const studentId = req.user?._id || '507f1f77bcf86cd799439011';

    const assignments = await NewAssignment.find({ studentId })
      .sort({ dueAt: 1 }) // Sort by due date ascending
      .lean();

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignments',
      error: error.message
    });
  }
});

// POST create new assignment
router.post('/assignments', upload.single('file'), async (req, res) => {
  try {
    const { title, subject, dueAt, priority, notes } = req.body;

    // Validation
    if (!title || !subject || !dueAt) {
      return res.status(400).json({
        success: false,
        message: 'Title, subject, and due date are required'
      });
    }

    // In production, get studentId from authenticated user session
    const studentId = req.user?._id || '507f1f77bcf86cd799439011';

    const assignmentData = {
      title,
      subject,
      dueAt: new Date(dueAt),
      priority: priority || 'medium',
      notes: notes || '',
      studentId
    };

    // Add file information if file was uploaded
    if (req.file) {
      assignmentData.filePath = `uploads/assignments/${req.file.filename}`;
      assignmentData.filename = req.file.originalname;
      assignmentData.fileSize = req.file.size;
    }

    const assignment = await NewAssignment.create(assignmentData);

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      data: assignment
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    
    // Delete uploaded file if assignment creation failed
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create assignment',
      error: error.message
    });
  }
});

// PUT update assignment
router.put('/assignments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, progress, notes } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    if (notes !== undefined) updateData.notes = notes;

    const assignment = await NewAssignment.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assignment updated successfully',
      data: assignment
    });
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update assignment',
      error: error.message
    });
  }
});

// DELETE assignment
router.delete('/assignments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await NewAssignment.findById(id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Delete associated file if exists
    if (assignment.filePath) {
      const filePath = path.join(__dirname, '..', assignment.filePath);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    await NewAssignment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete assignment',
      error: error.message
    });
  }
});

// GET calendar events (basic implementation)
router.get('/calendar/events', async (req, res) => {
  try {
    const studentId = req.user?._id || '507f1f77bcf86cd799439011';

    // Get assignments as calendar events
    const assignments = await NewAssignment.find({ studentId })
      .select('title dueAt priority status')
      .lean();

    const events = assignments.map(a => ({
      id: a._id,
      title: a.title,
      start_at: a.dueAt,
      end_at: new Date(new Date(a.dueAt).getTime() + 60 * 60 * 1000), // +1 hour
      category: 'assignment',
      color: a.priority === 'high' ? '#ef4444' : a.priority === 'medium' ? '#f59e0b' : '#3b82f6',
      source: 'internal'
    }));

    res.status(200).json({
      success: true,
      events
    });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch calendar events',
      error: error.message
    });
  }
});

export default router;
