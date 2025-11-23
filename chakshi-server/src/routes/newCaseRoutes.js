import express from 'express';
import { 
  createNewCase, 
  getAllNewCases, 
  getNewCaseById, 
  updateNewCase, 
  deleteNewCase,
  getNewCaseStats 
} from '../controllers/newCaseController.js'; // ✅ Changed to import + added .js

const router = express.Router();

console.log('✅ New Case Routes Module Loaded Successfully');

// Middleware to log all incoming requests
router.use((req, res, next) => {
  console.log('\n🔵═══════════════════════════════════════════════════════════');
  console.log('🚀 NEW CASE ROUTE HIT');
  console.log('🔵═══════════════════════════════════════════════════════════');
  console.log('📍 Method:', req.method);
  console.log('📍 Original URL:', req.originalUrl);
  console.log('📍 Path:', req.path);
  console.log('⏰ Timestamp:', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
  console.log('📦 Request Body:', req.body && Object.keys(req.body).length > 0 ? JSON.stringify(req.body, null, 2) : 'Empty');
  console.log('🔍 Query Params:', req.query && Object.keys(req.query).length > 0 ? JSON.stringify(req.query, null, 2) : 'None');
  console.log('🔵═══════════════════════════════════════════════════════════\n');
  next();
});

// Stats route (must come before /:id route)
router.get('/stats/overview', getNewCaseStats);

// POST - Create new case
router.post('/', createNewCase);

// GET - Get all cases
router.get('/', getAllNewCases);

// GET - Get single case by ID
router.get('/:id', getNewCaseById);

// PUT - Update case
router.put('/:id', updateNewCase);

// DELETE - Archive case
router.delete('/:id', deleteNewCase);

console.log('\n⚠️ WARNING: Routes running WITHOUT AUTHENTICATION');
console.log('✅ New Case Routes Registered:');
console.log('═══════════════════════════════════════════════════════════');
console.log('   📊 GET    /api/new-case/stats/overview');
console.log('   ➕ POST   /api/new-case/');
console.log('   📋 GET    /api/new-case/');
console.log('   🔍 GET    /api/new-case/:id');
console.log('   ✏️ PUT    /api/new-case/:id');
console.log('   🗑️ DELETE /api/new-case/:id');
console.log('═══════════════════════════════════════════════════════════\n');

export default router;
