const express = require("express");
const { 
  createCase, 
  getCases, 
  getCaseById,
  updateCase 
} = require("../controllers/caseController");

const router = express.Router();

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║              📋 CASE ROUTES LOADING                       ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// ═══════════════════════════════════════════════════════════════
// LOGGING MIDDLEWARE (⭐ FIXED)
// ═══════════════════════════════════════════════════════════════
router.use((req, res, next) => {
  const timestamp = new Date().toLocaleString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  console.log(`\n📋 [${timestamp}] ${req.method} ${req.originalUrl}`);
  
  // Log params if present
  if (req.params && Object.keys(req.params).length > 0) {
    console.log('   📋 Params:', JSON.stringify(req.params));
  }
  
  // ⭐ CRITICAL FIX: Safe body check (prevents GET request crashes)
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    const bodyKeys = Object.keys(req.body);
    console.log('   📦 Body keys:', bodyKeys.join(', '));
    
    // Show key fields for better debugging
    if (req.body.caseNumber) console.log('      Case Number:', req.body.caseNumber);
    if (req.body.clientName) console.log('      Client:', req.body.clientName);
    if (req.body.court) console.log('      Court:', req.body.court);
    if (req.body.status) console.log('      Status:', req.body.status);
  }
  
  next();
});

// ═══════════════════════════════════════════════════════════════
// CASE ROUTES (Order matters!)
// ═══════════════════════════════════════════════════════════════

console.log('📝 Registering Case Routes...\n');

// POST - Create new case
router.post("/", (req, res, next) => {
  console.log('   📝 CREATE Case');
  next();
}, createCase);

console.log('   ✅ POST   /api/cases          - Create new case');

// GET - Get all cases
router.get("/", (req, res, next) => {
  console.log('   📚 GET All Cases');
  next();
}, getCases);

console.log('   ✅ GET    /api/cases          - Get all cases');

// GET - Get single case by ID (MUST be after "/" route)
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

// ═══════════════════════════════════════════════════════════════
// OPTIONAL: DELETE ROUTE
// ═══════════════════════════════════════════════════════════════
// Uncomment if you have a deleteCase controller
/*
router.delete("/:id", (req, res, next) => {
  console.log('   🗑️  DELETE Case:', req.params.id);
  next();
}, deleteCase);

console.log('   ✅ DELETE /api/cases/:id      - Delete case');
*/

// ═══════════════════════════════════════════════════════════════
// SEARCH & FILTER ROUTES (Optional but useful)
// ═══════════════════════════════════════════════════════════════
// Add these if you want search/filter functionality

/*
// Search cases by query
router.get("/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    console.log('   🔎 SEARCH Cases:', query);
    
    const Case = require('../models/Case');
    const cases = await Case.find({
      $or: [
        { caseNumber: { $regex: query, $options: 'i' } },
        { clientName: { $regex: query, $options: 'i' } },
        { oppositeParty: { $regex: query, $options: 'i' } },
        { caseTitle: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdDate: -1 });
    
    res.json({ 
      success: true, 
      count: cases.length,
      data: cases 
    });
  } catch (error) {
    console.error('❌ Search error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

console.log('   ✅ GET    /api/cases/search/:query - Search cases');

// Get cases by status
router.get("/status/:status", async (req, res) => {
  try {
    const { status } = req.params;
    console.log('   📊 GET Cases by Status:', status);
    
    const Case = require('../models/Case');
    const cases = await Case.find({ status }).sort({ createdDate: -1 });
    
    res.json({ 
      success: true, 
      count: cases.length,
      data: cases 
    });
  } catch (error) {
    console.error('❌ Status filter error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

console.log('   ✅ GET    /api/cases/status/:status - Filter by status');
*/

// ═══════════════════════════════════════════════════════════════
// ERROR HANDLER (Should be last)
// ═══════════════════════════════════════════════════════════════
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
console.log('║         ✅ CASE ROUTES LOADED SUCCESSFULLY                ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('📊 Statistics:');
console.log('   • Total Routes: 4 (Create, Read All, Read One, Update)');
console.log('   • POST Routes: 1');
console.log('   • GET Routes: 2');
console.log('   • PUT Routes: 1');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

module.exports = router;
