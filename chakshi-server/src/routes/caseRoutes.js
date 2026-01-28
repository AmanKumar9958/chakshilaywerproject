import express from "express";
import Case from '../models/Case.js';
import { 
  createCase, 
  getCases, 
  getCaseById,
  updateCase 
} from "../controllers/caseController.js";

const router = express.Router();

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║              📋 CASE ROUTES LOADING                       ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// LOGGING MIDDLEWARE
router.use((req, res, next) => {
  const timestamp = new Date().toLocaleString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  console.log(`\n📋 [${timestamp}] ${req.method} ${req.originalUrl}`);
  
  if (req.params && Object.keys(req.params).length > 0) {
    console.log('   📋 Params:', JSON.stringify(req.params));
  }
  
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    const bodyKeys = Object.keys(req.body);
    console.log('   📦 Body keys:', bodyKeys.join(', '));
    if (req.body.caseNumber) console.log('       Case Number:', req.body.caseNumber);
    if (req.body.clientName) console.log('       Client:', req.body.clientName);
    if (req.body.court) console.log('       Court:', req.body.court);
    if (req.body.status) console.log('       Status:', req.body.status);
  }
  
  next();
});

// POST - Create new case
router.post("/", (req, res, next) => {
  console.log('   📝 CREATE Case');
  next();
}, createCase);

console.log('   ✅ POST   /api/cases          - Create new case');

// GET - Get all cases (with optional filters)
router.get("/", (req, res, next) => {
  console.log('   📚 GET All Cases with filters:', req.query);
  next();
}, getCases);

console.log('   ✅ GET    /api/cases          - Get all cases');

// GET - Fetch cases by client ID
router.get("/client/:clientId", async (req, res, next) => {
  try {
    const { clientId } = req.params;
    console.log(`   👤 GET Cases for client ID: ${clientId}`);

    const cases = await Case.find({ clientId })
      .sort({ createdDate: -1 });

    res.json({ success: true, count: cases.length, data: cases });
  } catch (err) {
    next(err);
  }
});

console.log('   ✅ GET    /api/cases/client/:clientId - Get cases by client ID');

// GET - Get single case by ID (must be after "/" route)
router.get("/:id", (req, res, next) => {
  console.log('   🔍 GET Case by ID:', req.params.id);
  next();
}, getCaseById);

console.log('   ✅ GET    /api/cases/:id      - Get single case');

// PUT - Update case by ID
router.put("/:id", (req, res, next) => {
  console.log('   ✏️  UPDATE Case:', req.params.id);
  next();
}, updateCase);

console.log('   ✅ PUT    /api/cases/:id      - Update case');

// ERROR HANDLER (last middleware)
router.use((err, req, res, next) => {
  console.error('\n❌ Case Routes Error Handler:');
  console.error('   URL:', req.method, req.originalUrl);
  console.error('   Error:', err.message);
  console.error('   Stack:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error in case routes',
    path: req.originalUrl
  });
});

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║          ✅ CASE ROUTES LOADED SUCCESSFULLY                ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('📊 Statistics:');
console.log('   • Total Routes: 5 (Create, Read All, Read One, Update, Filter by Client)');
console.log('   • POST Routes: 1');
console.log('   • GET Routes: 3');
console.log('   • PUT Routes: 1');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

export default router;
