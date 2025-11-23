import express from 'express';
import {
  createParty,
  getAllParties,
  getPartyById,
  updateParty,
  deleteParty,
  getPartiesStats,
  addCommunication,
  addPayment,
  uploadIdProof
} from '../controllers/clerkGeneralPartiesController.js';

const router = express.Router();

console.log('🛣️ ═══════════════════════════════════════');
console.log('📋 Clerk General Parties Routes Loading...');
console.log('🛣️ ═══════════════════════════════════════\n');

// Middleware to log all requests
router.use((req, res, next) => {
  console.log('\n🔵═══════════════════════════════════════════════════════════');
  console.log('🚀 CLERK PARTIES ROUTE HIT');
  console.log('🔵═══════════════════════════════════════════════════════════');
  console.log('📍 Method:', req.method);
  console.log('📍 Original URL:', req.originalUrl);
  console.log('📍 Path:', req.path);
  console.log('⏰ Timestamp:', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
  console.log('🔵═══════════════════════════════════════════════════════════\n');
  next();
});

// Stats route (must come before /:id)
router.get('/stats/overview', getPartiesStats);

// CRUD Routes
router.post('/', createParty);                    // Create party
router.get('/', getAllParties);                   // Get all parties
router.get('/:id', getPartyById);                 // Get party by ID
router.put('/:id', updateParty);                  // Update party
router.delete('/:id', deleteParty);               // Delete/Archive party

// Additional Features
router.post('/:id/communication', addCommunication);  // Add communication log
router.post('/:id/payment', addPayment);              // Add payment record
router.post('/:id/upload-id', uploadIdProof);         // Upload ID proof

console.log('✅ Clerk General Parties Routes Registered:');
console.log('═══════════════════════════════════════════════════════════');
console.log('   📊 GET    /api/clerk-parties/stats/overview');
console.log('   ➕ POST   /api/clerk-parties/');
console.log('   📋 GET    /api/clerk-parties/');
console.log('   🔍 GET    /api/clerk-parties/:id');
console.log('   ✏️ PUT    /api/clerk-parties/:id');
console.log('   🗑️ DELETE /api/clerk-parties/:id');
console.log('   💬 POST   /api/clerk-parties/:id/communication');
console.log('   💰 POST   /api/clerk-parties/:id/payment');
console.log('   📤 POST   /api/clerk-parties/:id/upload-id');
console.log('═══════════════════════════════════════════════════════════\n');

export default router;
