import express from 'express';
import {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getAssignmentsByCourse,
  toggleStar
} from '../controllers/newAssignmentController.js';

const router = express.Router();

console.log('✅ New Assignment Routes Module Loaded Successfully');

// Middleware to log all incoming requests
router.use((req, res, next) => {
  console.log('\n🔵═══════════════════════════════════════════════════════════');
  console.log('🚀 NEW ASSIGNMENT ROUTE HIT');
  console.log('🔵═══════════════════════════════════════════════════════════');
  console.log('📍 Method:', req.method);
  console.log('📍 Original URL:', req.originalUrl);
  console.log('📍 Path:', req.path);
  console.log('⏰ Timestamp:', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
  console.log('🌐 IP Address:', req.ip || req.connection.remoteAddress);
  console.log('📦 Request Body:', req.body && Object.keys(req.body).length > 0 ? JSON.stringify(req.body, null, 2) : 'Empty');
  console.log('🔍 Query Params:', req.query && Object.keys(req.query).length > 0 ? JSON.stringify(req.query, null, 2) : 'None');
  console.log('🔵═══════════════════════════════════════════════════════════\n');
  next();
});

// POST - Create new assignment
router.post('/',
  (req, res, next) => {
    console.log('📝 Route: POST / - Create New Assignment');
    console.log('📄 Calling createAssignment controller...\n');
    next();
  },
  createAssignment
);

// GET - Get all assignments
router.get('/',
  (req, res, next) => {
    console.log('📋 Route: GET / - Get All Assignments');
    console.log('📄 Calling getAllAssignments controller...\n');
    next();
  },
  getAllAssignments
);

// GET - Get assignments by course
router.get('/course/:course',
  (req, res, next) => {
    console.log('📚 Route: GET /course/:course - Get Assignments By Course');
    console.log('📚 Course:', req.params.course);
    console.log('📄 Calling getAssignmentsByCourse controller...\n');
    next();
  },
  getAssignmentsByCourse
);

// PATCH - Toggle starred status
router.patch('/:id/star',
  (req, res, next) => {
    console.log('⭐ Route: PATCH /:id/star - Toggle Star');
    console.log('🆔 Assignment ID:', req.params.id);
    console.log('📄 Calling toggleStar controller...\n');
    next();
  },
  toggleStar
);

// GET - Get single assignment by ID
router.get('/:id',
  (req, res, next) => {
    console.log('🔍 Route: GET /:id - Get Assignment By ID');
    console.log('🆔 Assignment ID:', req.params.id);
    console.log('📄 Calling getAssignmentById controller...\n');
    next();
  },
  getAssignmentById
);

// PUT - Update assignment
router.put('/:id',
  (req, res, next) => {
    console.log('✏️ Route: PUT /:id - Update Assignment');
    console.log('🆔 Assignment ID:', req.params.id);
    console.log('📄 Calling updateAssignment controller...\n');
    next();
  },
  updateAssignment
);

// DELETE - Delete assignment (soft delete)
router.delete('/:id',
  (req, res, next) => {
    console.log('🗑️ Route: DELETE /:id - Delete Assignment');
    console.log('🆔 Assignment ID:', req.params.id);
    console.log('⚠️ This will SOFT DELETE the assignment');
    console.log('📄 Calling deleteAssignment controller...\n');
    next();
  },
  deleteAssignment
);

// Log route registration
console.log('\n✅ New Assignment Routes Registered:');
console.log('═══════════════════════════════════════════════════════════');
console.log('   📝 POST   /api/assignments                - Create Assignment');
console.log('   📋 GET    /api/assignments                - Get All Assignments');
console.log('   📚 GET    /api/assignments/course/:course - Get Assignments By Course');
console.log('   ⭐ PATCH  /api/assignments/:id/star       - Toggle Star');
console.log('   🔍 GET    /api/assignments/:id            - Get Assignment By ID');
console.log('   ✏️ PUT    /api/assignments/:id            - Update Assignment');
console.log('   🗑️ DELETE /api/assignments/:id            - Delete Assignment');
console.log('═══════════════════════════════════════════════════════════\n');

export default router;
