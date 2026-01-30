import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './src/config/db.js';

// Import all routes as ES modules
import clientRoutes from './src/routes/clientRoutes.js';
import caseRoutes from './src/routes/caseRoutes.js';
import documentRoutes from './src/routes/documentRoutes.js';
import studentDocumentRoutes from './src/routes/studentDocRoutes.js';
import newCaseRoutes from './src/routes/newCaseRoutes.js';
import newDocumentRoutes from './src/routes/newDocumentRoutes.js';
import newAssignmentRoutes from './src/routes/newAssignmentRoutes.js';
import clerkCaseDetailsRoutes from './src/routes/clerkCaseDetailsRoutes.js';
import clerkDashboardRoutes from './src/routes/clerkDashboardRoutes.js';
import clerkGeneralPartiesRoutes from './src/routes/clerkGeneralPartiesRoutes.js';
import googleCalendarRoutes from './src/routes/googleCalendarRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import caseDetailViewRoutes from './src/routes/caseDetailViewRoutes.js';
import razorpayRoutes from './src/routes/razorpayRoutes.js';
import subscriptionRoutes from './src/routes/subscriptionRoutes.js';

// ES Module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables FIRST
dotenv.config();

const app = express();

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║           🚀 CHAKSHI SERVER v1.6.0                       ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// ═══════════════════════════════════════════════════════════════
// MIDDLEWARES (ORDER CRITICAL)
// ═══════════════════════════════════════════════════════════════
console.log('⚙️  Setting up middlewares...');

// 1. Security & CORS
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [process.env.CLIENT_URL, 'http://localhost:3000', 'https://chakshi.com'].filter(Boolean);
    if (!origin || allowed.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
console.log('   ✅ CORS configured (Dynamic Origin Support)');

// 2. Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
console.log('   ✅ Body parsers enabled (10MB limit)');

// 3. Request logger with colors
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    hour12: true 
  });
  const method = req.method.padEnd(7);
  console.log(`📨 [${timestamp}] ${method} ${req.originalUrl}`);
  next();
});
console.log('   ✅ Request logger enabled');

// 4. Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('   ✅ Static files: /uploads\n');

// ═══════════════════════════════════════════════════════════════
// DATABASE CONNECTION
// ═══════════════════════════════════════════════════════════════
console.log('📊 Initializing MongoDB connection...');
connectDB();

// ═══════════════════════════════════════════════════════════════
// ROUTES REGISTRATION
// ═══════════════════════════════════════════════════════════════
console.log('\n🛣️  Registering API routes...\n');

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: '✅ Chakshi Legal Management System',
    version: '1.6.0',
    timestamp: new Date().toISOString(),
    server: 'Running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      subscription: '/api/subscription',
      clients: '/api/clients',
      cases: '/api/cases',
      caseDetails: '/api/casedetails/:caseId/{timeline|payments|notes}',
      documents: '/api/documents',
      student: '/api/student',
      assignments: '/api/assignments',
      clerk: '/api/clerkcasedetails',
      calendar: '/api/calendar',
      payment: '/api/payment'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const uptime = process.uptime();
  const memUsage = process.memoryUsage();
  
  res.status(200).json({ 
    success: true, 
    status: 'healthy',
    server: {
      uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
      memory: {
        used: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        percentage: `${Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)}%`
      },
      cpu: `${process.cpuUsage().user / 1000}ms`,
      platform: process.platform,
      nodeVersion: process.version
    },
    database: 'Connected',
    razorpay: process.env.RAZORPAY_KEY_ID ? 'Configured ✅' : 'Not configured ⚠️',
    timestamp: new Date().toISOString(),
    version: '1.6.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Authentication (Highest priority - NO middleware needed)
app.use('/api/auth', authRoutes);
console.log('   🔐 Auth routes:          /api/auth');

// ⭐ Subscription routes (NO middleware needed - for checking status, upgrading)
app.use('/api/subscription', subscriptionRoutes);
console.log('   🎫 Subscription routes:  /api/subscription');

// Payment routes (NO middleware needed - for creating orders)
app.use('/api/payment', razorpayRoutes);
console.log('   💳 Payment routes:       /api/payment');

// ⭐ IMPORTANT: All routes below this comment should have subscription middleware applied in their route files
// Core application routes (alphabetically organized)
const routes = [
  { path: '/api/assignments', router: newAssignmentRoutes, name: 'Assignments' },
  { path: '/api/calendar', router: googleCalendarRoutes, name: 'Google Calendar' },
  { path: '/api/cases', router: caseRoutes, name: 'Cases' },
  { path: '/api/casedetails', router: caseDetailViewRoutes, name: 'Case Details (Timeline/Payments/Notes)' },
  { path: '/api/clients', router: clientRoutes, name: 'Clients' },
  { path: '/api/clerk-parties', router: clerkGeneralPartiesRoutes, name: 'Clerk Parties' },
  { path: '/api/clerkcasedetails', router: clerkCaseDetailsRoutes, name: 'Clerk Case Details' },
  { path: '/api/clerkdashboard', router: clerkDashboardRoutes, name: 'Clerk Dashboard' },
  { path: '/api/documents', router: documentRoutes, name: 'Documents' },
  { path: '/api/new-case', router: newCaseRoutes, name: 'New Cases' },
  { path: '/api/new-document', router: newDocumentRoutes, name: 'New Documents' },
  { path: '/api/student', router: studentDocumentRoutes, name: 'Student Documents' }
];

routes.forEach(({ path, router, name }) => {
  app.use(path, router);
  const displayName = name.padEnd(40);
  console.log(`   ✅ ${displayName} ${path}`);
});

console.log('\n🎯 All routes registered successfully!\n');

// ═══════════════════════════════════════════════════════════════
// ERROR HANDLING (MUST BE AFTER ROUTES)
// ═══════════════════════════════════════════════════════════════

// 404 Handler
app.use((req, res) => {
  console.log(`⚠️  404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
    suggestion: 'Check /api/health for available endpoints'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const timestamp = new Date().toLocaleString('en-IN');
  
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║               ❌ ERROR MIDDLEWARE TRIGGERED               ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.error('⏰ Time:', timestamp);
  console.error('🌐 URL:', req.method, req.originalUrl);
  console.error('❌ Error:', err.message);
  console.error('📋 Name:', err.name);
  
  if (process.env.NODE_ENV === 'development') {
    console.error('📚 Stack:', err.stack);
  }
  
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  
  // Multer file upload errors
  if (err.name === 'MulterError') {
    const errorMap = {
      'LIMIT_FILE_SIZE': 'File size exceeds 10MB limit',
      'LIMIT_FILE_COUNT': 'Too many files uploaded',
      'LIMIT_UNEXPECTED_FILE': 'Unexpected file field',
      'LIMIT_FIELD_KEY': 'Field name too long',
      'LIMIT_FIELD_VALUE': 'Field value too long',
      'LIMIT_FIELD_COUNT': 'Too many fields',
      'LIMIT_PART_COUNT': 'Too many parts'
    };
    
    return res.status(400).json({
      success: false,
      error: 'File Upload Error',
      message: errorMap[err.code] || err.message,
      code: err.code
    });
  }

  // MongoDB Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Data validation failed',
      errors: Object.values(err.errors).map(e => ({
        field: e.path,
        message: e.message,
        value: e.value
      }))
    });
  }

  // MongoDB Cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID',
      message: `Invalid ${err.path}: ${err.value}`,
      field: err.path
    });
  }

  // MongoDB Duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const value = err.keyValue[field];
    return res.status(400).json({
      success: false,
      error: 'Duplicate Entry',
      message: `${field} '${value}' already exists`,
      field: field
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid Token',
      message: 'Authentication token is invalid'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token Expired',
      message: 'Authentication token has expired'
    });
  }

  // Generic error response
  res.status(err.status || err.statusCode || 500).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    })
  });
});

// ═══════════════════════════════════════════════════════════════
// SERVER INITIALIZATION
// ═══════════════════════════════════════════════════════════════
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';
let server;

const startServer = async () => {
  try {
    server = app.listen(PORT, HOST, () => {
      const localTime = new Date().toLocaleString('en-IN', { 
        timeZone: 'Asia/Kolkata',
        dateStyle: 'full',
        timeStyle: 'long'
      });
      
      console.log('\n╔═══════════════════════════════════════════════════════════╗');
      console.log('║                  🚀 SERVER STARTED                        ║');
      console.log('╚═══════════════════════════════════════════════════════════╝');
      console.log(`📍 Local:        http://localhost:${PORT}`);
      console.log(`🌐 Network:      http://${HOST}:${PORT}`);
      console.log(`📊 Environment:  ${process.env.NODE_ENV || 'development'}`);
      console.log(`💾 MongoDB:      ${process.env.MONGO_URI ? 'Connected ✅' : 'Not configured ⚠️'}`);
      console.log(`💳 Razorpay:     ${process.env.RAZORPAY_KEY_ID ? 'Configured ✅' : 'Not configured ⚠️'}`);
      console.log(`⏰ Started:      ${localTime}`);
      console.log('╚═══════════════════════════════════════════════════════════╝');
      console.log('\n📋 Quick Access Links:');
      console.log(`   • Health Check:    http://localhost:${PORT}/api/health`);
      console.log(`   • API Root:        http://localhost:${PORT}/`);
      console.log(`   • Auth:            http://localhost:${PORT}/api/auth/register`);
      console.log(`   • Subscription:    http://localhost:${PORT}/api/subscription/trial-status`);
      console.log(`   • Payment:         http://localhost:${PORT}/api/payment/create-order`);
      console.log(`   • Documents:       http://localhost:${PORT}/api/documents`);
      console.log('╚═══════════════════════════════════════════════════════════╝\n');
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.log('💡 Try one of these solutions:');
        console.log(`   1. Kill the process using port ${PORT}`);
        console.log('   2. Use a different port by setting PORT in .env');
        console.log(`   3. Run: npx kill-port ${PORT}`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('\n❌ Failed to start server:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

// ═══════════════════════════════════════════════════════════════
// PROCESS ERROR HANDLERS
// ═══════════════════════════════════════════════════════════════

// Uncaught Exception Handler
process.on('uncaughtException', (err) => {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║            ❌ UNCAUGHT EXCEPTION                          ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.error('Error Name:', err.name);
  console.error('Error Message:', err.message);
  console.error('Stack:', err.stack);
  console.log('🔴 Server shutting down...\n');
  process.exit(1);
});

// Unhandled Promise Rejection Handler
process.on('unhandledRejection', (reason, promise) => {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║         ❌ UNHANDLED PROMISE REJECTION                    ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.error('Reason:', reason);
  console.log('🔴 Server shutting down gracefully...\n');
  
  if (server) {
    server.close(() => {
      console.log('✅ HTTP server closed');
      process.exit(1);
    });
    
    setTimeout(() => {
      console.error('❌ Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(1);
  }
});

// Graceful Shutdown Handlers
const gracefulShutdown = (signal) => {
  console.log(`\n👋 ${signal} received: Initiating graceful shutdown...`);
  console.log('⏳ Closing server connections...');
  
  if (server) {
    server.close(() => {
      console.log('✅ HTTP server closed');
      console.log('✅ All connections closed');
      console.log('👋 Goodbye!\n');
      process.exit(0);
    });

    setTimeout(() => {
      console.error('❌ Forced shutdown: Timeout reached');
      process.exit(1);
    }, 15000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the server
startServer();

export default app;