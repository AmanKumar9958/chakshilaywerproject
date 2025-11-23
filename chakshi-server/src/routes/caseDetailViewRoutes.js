const express = require('express');
const router = express.Router();
const controller = require('../controllers/caseDetailViewController');

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║         🛣️  CASE DETAIL VIEW ROUTES LOADING              ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// ═══════════════════════════════════════════════════════════════
// LOGGING MIDDLEWARE (⭐ FIXED)
// ═══════════════════════════════════════════════════════════════
router.use((req, res, next) => {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  console.log(`\n🔵 [${timestamp}] ${req.method} ${req.originalUrl}`);
  
  // Log params if present
  if (req.params && Object.keys(req.params).length > 0) {
    console.log('   📋 Params:', JSON.stringify(req.params));
  }
  
  // ⭐ CRITICAL FIX: Only log body if it exists (prevents GET request crashes)
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    console.log('   📦 Body keys:', Object.keys(req.body).join(', '));
  }
  
  next();
});

// ═══════════════════════════════════════════════════════════════
// TIMELINE ROUTES
// ═══════════════════════════════════════════════════════════════
console.log('📅 Registering Timeline Routes...');

router.get('/:caseId/timeline', (req, res, next) => {
  console.log('   📅 GET Timeline for case:', req.params.caseId);
  next();
}, controller.getTimeline);

router.post('/:caseId/timeline', (req, res, next) => {
  console.log('   📅 POST Timeline for case:', req.params.caseId);
  if (req.body?.stage) console.log('      Stage:', req.body.stage);
  if (req.body?.date) console.log('      Date:', req.body.date);
  next();
}, controller.addTimelineEntry);

router.put('/:caseId/timeline/:timelineId', (req, res, next) => {
  console.log('   📅 PUT Timeline:', req.params.timelineId);
  if (req.body?.status) console.log('      New status:', req.body.status);
  next();
}, controller.updateTimelineStatus);

router.delete('/:caseId/timeline/:timelineId', (req, res, next) => {
  console.log('   📅 DELETE Timeline:', req.params.timelineId);
  next();
}, controller.deleteTimelineEntry);

console.log('   ✅ GET    /:caseId/timeline');
console.log('   ✅ POST   /:caseId/timeline');
console.log('   ✅ PUT    /:caseId/timeline/:timelineId');
console.log('   ✅ DELETE /:caseId/timeline/:timelineId\n');

// ═══════════════════════════════════════════════════════════════
// PAYMENT ROUTES (⭐ Stats route MUST be before :paymentId)
// ═══════════════════════════════════════════════════════════════
console.log('💰 Registering Payment Routes...');

// ⭐ IMPORTANT: /stats route FIRST (more specific)
router.get('/:caseId/payments/stats', (req, res, next) => {
  console.log('   💰 GET Payment Stats for case:', req.params.caseId);
  next();
}, controller.getPaymentStats);

// Then general /payments route
router.get('/:caseId/payments', (req, res, next) => {
  console.log('   💰 GET Payments for case:', req.params.caseId);
  next();
}, controller.getPayments);

router.post('/:caseId/payments', (req, res, next) => {
  console.log('   💰 POST Payment for case:', req.params.caseId);
  if (req.body?.amount) console.log('      Amount: ₹', req.body.amount);
  if (req.body?.description) console.log('      Description:', req.body.description);
  if (req.body?.status) console.log('      Status:', req.body.status);
  next();
}, controller.addPayment);

router.put('/:caseId/payments/:paymentId', (req, res, next) => {
  console.log('   💰 PUT Payment:', req.params.paymentId);
  if (req.body?.status) console.log('      New status:', req.body.status);
  next();
}, controller.updatePaymentStatus);

router.delete('/:caseId/payments/:paymentId', (req, res, next) => {
  console.log('   💰 DELETE Payment:', req.params.paymentId);
  next();
}, controller.deletePayment);

console.log('   ✅ GET    /:caseId/payments/stats  (⚠️  MUST BE FIRST)');
console.log('   ✅ GET    /:caseId/payments');
console.log('   ✅ POST   /:caseId/payments');
console.log('   ✅ PUT    /:caseId/payments/:paymentId');
console.log('   ✅ DELETE /:caseId/payments/:paymentId\n');

// ═══════════════════════════════════════════════════════════════
// NOTES ROUTES
// ═══════════════════════════════════════════════════════════════
console.log('📝 Registering Note Routes...');

router.get('/:caseId/notes', (req, res, next) => {
  console.log('   📝 GET Notes for case:', req.params.caseId);
  next();
}, controller.getNotes);

router.post('/:caseId/notes', (req, res, next) => {
  console.log('   📝 POST Note for case:', req.params.caseId);
  if (req.body?.content) {
    console.log('      Content length:', req.body.content.length, 'characters');
  }
  if (req.body?.category) console.log('      Category:', req.body.category);
  next();
}, controller.addNote);

router.put('/:caseId/notes/:noteId', (req, res, next) => {
  console.log('   📝 PUT Note:', req.params.noteId);
  if (req.body?.content) console.log('      Updated content length:', req.body.content.length);
  next();
}, controller.updateNote);

router.delete('/:caseId/notes/:noteId', (req, res, next) => {
  console.log('   📝 DELETE Note:', req.params.noteId);
  next();
}, controller.deleteNote);

console.log('   ✅ GET    /:caseId/notes');
console.log('   ✅ POST   /:caseId/notes');
console.log('   ✅ PUT    /:caseId/notes/:noteId');
console.log('   ✅ DELETE /:caseId/notes/:noteId\n');

// ═══════════════════════════════════════════════════════════════
// UTILITY ROUTES
// ═══════════════════════════════════════════════════════════════
console.log('🧪 Registering Utility Routes...');

// Health check / Test endpoint
router.get('/test', (req, res) => {
  console.log('   🧪 Test endpoint accessed');
  res.json({
    success: true,
    message: '✅ Case Detail View Routes are working!',
    timestamp: new Date().toISOString(),
    routes: {
      timeline: {
        get: '/api/casedetails/:caseId/timeline',
        post: '/api/casedetails/:caseId/timeline',
        put: '/api/casedetails/:caseId/timeline/:timelineId',
        delete: '/api/casedetails/:caseId/timeline/:timelineId'
      },
      payments: {
        get: '/api/casedetails/:caseId/payments',
        post: '/api/casedetails/:caseId/payments',
        put: '/api/casedetails/:caseId/payments/:paymentId',
        delete: '/api/casedetails/:caseId/payments/:paymentId',
        stats: '/api/casedetails/:caseId/payments/stats'
      },
      notes: {
        get: '/api/casedetails/:caseId/notes',
        post: '/api/casedetails/:caseId/notes',
        put: '/api/casedetails/:caseId/notes/:noteId',
        delete: '/api/casedetails/:caseId/notes/:noteId'
      }
    },
    totalRoutes: 14,
    examples: {
      getPayments: 'GET /api/casedetails/69222274209f289a22c7cdbe/payments',
      addPayment: 'POST /api/casedetails/69222274209f289a22c7cdbe/payments',
      getStats: 'GET /api/casedetails/69222274209f289a22c7cdbe/payments/stats',
      addTimeline: 'POST /api/casedetails/69222274209f289a22c7cdbe/timeline',
      addNote: 'POST /api/casedetails/69222274209f289a22c7cdbe/notes'
    }
  });
});

console.log('   ✅ GET    /test - Health check endpoint\n');

// ═══════════════════════════════════════════════════════════════
// ERROR HANDLER (Should be last)
// ═══════════════════════════════════════════════════════════════
router.use((err, req, res, next) => {
  console.error('\n❌ Case Detail Routes Error Handler:');
  console.error('   URL:', req.method, req.originalUrl);
  console.error('   Error:', err.message);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    path: req.originalUrl
  });
});

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║     ✅ CASE DETAIL VIEW ROUTES LOADED SUCCESSFULLY       ║');
console.log('╚═══════════════════════════════════════════════════════════╝');
console.log('📊 Statistics:');
console.log('   • Total Routes: 14 (13 CRUD + 1 Utility)');
console.log('   • Timeline Routes: 4');
console.log('   • Payment Routes: 5');
console.log('   • Note Routes: 4');
console.log('   • Utility Routes: 1');
console.log('🧪 Test Route: GET /api/casedetails/test');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

module.exports = router;
