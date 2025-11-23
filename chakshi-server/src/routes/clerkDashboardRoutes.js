import express from 'express';
import {
  getClerkDashboard,
  getClerkDashboardStats,
  getRecentCases,
  getUpcomingHearings,
  updateClerkDashboard,
  addNotification,
  markNotificationRead,
  getNotifications,
  refreshDashboard
} from '../controllers/clerkDashboardController.js';

const router = express.Router();

console.log('🛣️ ═══════════════════════════════════════');
console.log('📋 Clerk Dashboard Routes Module Loaded');
console.log('🛣️ ═══════════════════════════════════════\n');

// Middleware to log all incoming requests to this router
router.use((req, res, next) => {
  console.log('\n🔷 ═══════════════════════════════════════');
  console.log('📨 Incoming Request to Clerk Dashboard Routes');
  console.log('🔷 ═══════════════════════════════════════');
  console.log('⏰ Time:', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
  console.log('🌐 Method:', req.method);
  console.log('🔗 Path:', req.path);
  console.log('📍 Full URL:', req.originalUrl);
  console.log('🔑 Params:', JSON.stringify(req.params));
  console.log('❓ Query:', JSON.stringify(req.query));
  console.log('📦 Body:', JSON.stringify(req.body));
  console.log('🔷 ═══════════════════════════════════════\n');
  next();
});

// Dashboard routes
router.get('/:clerkId', (req, res, next) => {
  console.log('✅ Route matched: GET /:clerkId (Dashboard Overview)');
  console.log('👤 Clerk ID:', req.params.clerkId);
  next();
}, getClerkDashboard);

router.get('/:clerkId/stats', (req, res, next) => {
  console.log('✅ Route matched: GET /:clerkId/stats (Dashboard Stats)');
  console.log('👤 Clerk ID:', req.params.clerkId);
  next();
}, getClerkDashboardStats);

router.get('/:clerkId/recent-cases', (req, res, next) => {
  console.log('✅ Route matched: GET /:clerkId/recent-cases (Recent Cases)');
  console.log('👤 Clerk ID:', req.params.clerkId);
  console.log('📊 Limit:', req.query.limit || 'default');
  next();
}, getRecentCases);

router.get('/:clerkId/upcoming-hearings', (req, res, next) => {
  console.log('✅ Route matched: GET /:clerkId/upcoming-hearings (Upcoming Hearings)');
  console.log('👤 Clerk ID:', req.params.clerkId);
  console.log('📊 Limit:', req.query.limit || 'default');
  next();
}, getUpcomingHearings);

router.put('/:clerkId', (req, res, next) => {
  console.log('✅ Route matched: PUT /:clerkId (Update Dashboard)');
  console.log('👤 Clerk ID:', req.params.clerkId);
  console.log('📝 Update Data Keys:', Object.keys(req.body));
  next();
}, updateClerkDashboard);

router.post('/:clerkId/refresh', (req, res, next) => {
  console.log('✅ Route matched: POST /:clerkId/refresh (Refresh Dashboard)');
  console.log('👤 Clerk ID:', req.params.clerkId);
  next();
}, refreshDashboard);

// Notifications routes
router.get('/:clerkId/notifications', (req, res, next) => {
  console.log('✅ Route matched: GET /:clerkId/notifications (Get Notifications)');
  console.log('👤 Clerk ID:', req.params.clerkId);
  console.log('📊 Query:', JSON.stringify(req.query));
  next();
}, getNotifications);

router.post('/:clerkId/notifications', (req, res, next) => {
  console.log('✅ Route matched: POST /:clerkId/notifications (Add Notification)');
  console.log('👤 Clerk ID:', req.params.clerkId);
  console.log('📝 Notification Data:', JSON.stringify(req.body));
  next();
}, addNotification);

router.put('/:clerkId/notifications/:notificationId/read', (req, res, next) => {
  console.log('✅ Route matched: PUT /:clerkId/notifications/:notificationId/read (Mark Read)');
  console.log('👤 Clerk ID:', req.params.clerkId);
  console.log('🔔 Notification ID:', req.params.notificationId);
  next();
}, markNotificationRead);

// 404 handler for unmatched routes within this router
router.use((req, res) => {
  console.log('❌ ═══════════════════════════════════════');
  console.log('⚠️ No Matching Route Found');
  console.log('❌ ═══════════════════════════════════════');
  console.log('🌐 Method:', req.method);
  console.log('🔗 Path:', req.path);
  console.log('📍 Full URL:', req.originalUrl);
  console.log('🔑 Params:', JSON.stringify(req.params));
  console.log('❓ Query:', JSON.stringify(req.query));
  console.log('❌ ═══════════════════════════════════════\n');
  
  res.status(404).json({
    success: false,
    message: 'Clerk dashboard route not found',
    requestedPath: req.path,
    requestedUrl: req.originalUrl,
    method: req.method,
    availableRoutes: [
      'GET /:clerkId',
      'GET /:clerkId/stats',
      'GET /:clerkId/recent-cases',
      'GET /:clerkId/upcoming-hearings',
      'PUT /:clerkId',
      'POST /:clerkId/refresh',
      'GET /:clerkId/notifications',
      'POST /:clerkId/notifications',
      'PUT /:clerkId/notifications/:notificationId/read'
    ]
  });
});

// Error handler for this router
router.use((error, req, res, next) => {
  console.log('💥 ═══════════════════════════════════════');
  console.log('❌ Error in Clerk Dashboard Routes');
  console.log('💥 ═══════════════════════════════════════');
  console.log('🔴 Error Name:', error.name);
  console.log('🔴 Error Message:', error.message);
  console.log('🔴 Stack Trace:', error.stack);
  console.log('🌐 Request Method:', req.method);
  console.log('🔗 Request Path:', req.path);
  console.log('💥 ═══════════════════════════════════════\n');
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error in clerk dashboard routes',
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
});

console.log('✅ Clerk Dashboard Routes Registered Successfully\n');
console.log('📋 Available Routes:');
console.log('   • GET    /:clerkId                                    - Get dashboard overview');
console.log('   • GET    /:clerkId/stats                              - Get dashboard stats');
console.log('   • GET    /:clerkId/recent-cases                       - Get recent cases');
console.log('   • GET    /:clerkId/upcoming-hearings                  - Get upcoming hearings');
console.log('   • PUT    /:clerkId                                    - Update dashboard');
console.log('   • POST   /:clerkId/refresh                            - Refresh dashboard');
console.log('   • GET    /:clerkId/notifications                      - Get notifications');
console.log('   • POST   /:clerkId/notifications                      - Add notification');
console.log('   • PUT    /:clerkId/notifications/:notificationId/read - Mark notification read');
console.log('\n');

export default router;
