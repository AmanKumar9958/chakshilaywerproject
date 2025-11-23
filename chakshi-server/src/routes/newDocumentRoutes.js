const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { 
  uploadDocument,
  getAllDocuments,
  getDocumentById,
  viewDocument,
  downloadDocument,
  deleteDocument,
  getDocumentsByCase
} = require('../controllers/newDocumentController');

const router = express.Router();

console.log('✅ New Document Routes Module Loaded Successfully');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/documents';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`📁 Created upload directory: ${uploadDir}`);
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + ext;
    console.log(`📝 Generated filename: ${filename}`);
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    console.log(`✅ File type accepted: ${file.mimetype}`);
    cb(null, true);
  } else {
    console.log(`❌ File type rejected: ${file.mimetype}`);
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, JPEG, PNG are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Middleware to log all incoming requests
router.use((req, res, next) => {
  console.log('\n🔵═══════════════════════════════════════════════════════════');
  console.log('🚀 NEW DOCUMENT ROUTE HIT');
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

// POST - Upload document (with file)
router.post('/upload', 
  (req, res, next) => {
    console.log('📤 Route: POST /upload - Upload New Document');
    console.log('📝 Processing file upload...');
    next();
  },
  upload.single('file'),
  (req, res, next) => {
    console.log('✅ File upload middleware completed');
    console.log('📄 Calling uploadDocument controller...\n');
    next();
  },
  uploadDocument
);

// GET - Get all documents
router.get('/', 
  (req, res, next) => {
    console.log('📋 Route: GET / - Get All Documents');
    console.log('📄 Calling getAllDocuments controller...\n');
    next();
  },
  getAllDocuments
);

// GET - View document (stream for viewing)
router.get('/view/:id', 
  (req, res, next) => {
    console.log('👁️ Route: GET /view/:id - View Document');
    console.log('🆔 Document ID:', req.params.id);
    console.log('📄 Calling viewDocument controller...\n');
    next();
  },
  viewDocument
);

// GET - Download document
router.get('/download/:id', 
  (req, res, next) => {
    console.log('⬇️ Route: GET /download/:id - Download Document');
    console.log('🆔 Document ID:', req.params.id);
    console.log('📄 Calling downloadDocument controller...\n');
    next();
  },
  downloadDocument
);

// GET - Get documents by case ID
router.get('/case/:caseId', 
  (req, res, next) => {
    console.log('📁 Route: GET /case/:caseId - Get Documents By Case');
    console.log('🆔 Case ID:', req.params.caseId);
    console.log('📄 Calling getDocumentsByCase controller...\n');
    next();
  },
  getDocumentsByCase
);

// GET - Get single document by ID
router.get('/:id', 
  (req, res, next) => {
    console.log('🔍 Route: GET /:id - Get Document By ID');
    console.log('🆔 Document ID:', req.params.id);
    console.log('📄 Calling getDocumentById controller...\n');
    next();
  },
  getDocumentById
);

// DELETE - Delete document (soft delete)
router.delete('/:id', 
  (req, res, next) => {
    console.log('🗑️ Route: DELETE /:id - Delete Document');
    console.log('🆔 Document ID:', req.params.id);
    console.log('⚠️ This will SOFT DELETE the document');
    console.log('📄 Calling deleteDocument controller...\n');
    next();
  },
  deleteDocument
);

// Log route registration on module load
console.log('\n✅ New Document Routes Registered:');
console.log('═══════════════════════════════════════════════════════════');
console.log('   📤 POST   /api/new-document/upload          - Upload Document');
console.log('   📋 GET    /api/new-document/                - Get All Documents');
console.log('   👁️ GET    /api/new-document/view/:id        - View Document');
console.log('   ⬇️ GET    /api/new-document/download/:id    - Download Document');
console.log('   📁 GET    /api/new-document/case/:caseId    - Get Documents By Case');
console.log('   🔍 GET    /api/new-document/:id             - Get Document By ID');
console.log('   🗑️ DELETE /api/new-document/:id             - Delete Document');
console.log('═══════════════════════════════════════════════════════════\n');

module.exports = router;
