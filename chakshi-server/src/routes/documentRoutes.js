import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Document from '../models/Document.js';
import Case from '../models/Case.js';

const router = express.Router();

console.log('🚀 ═══════════════════════════════════════════════════');
console.log('🚀 Document Routes Module Loading...');
console.log('🚀 ═══════════════════════════════════════════════════');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'uploads', 'docs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Upload directory created at:', uploadDir);
} else {
  console.log('✅ Upload directory exists at:', uploadDir);
}

// 🔧 Configure multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    console.log('📂 [Multer] Destination called');
    console.log('   └─ Field name:', file.fieldname);
    console.log('   └─ File:', file.originalname);
    cb(null, 'uploads/docs');
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log('📝 [Multer] Filename generated:', filename);
    cb(null, filename);
  },
});

// 🔧 Configure multer
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('🔍 [Multer] File filter called');
    console.log('   └─ Field name:', file.fieldname, '⚠️ MUST BE "file"');
    console.log('   └─ Original name:', file.originalname);
    console.log('   └─ Mimetype:', file.mimetype);
    
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      console.log('   ✅ File type allowed');
      return cb(null, true);
    } else {
      console.log('   ❌ File type NOT allowed');
      cb(new Error('Only PDF, DOC, DOCX, JPG, and PNG files are allowed!'));
    }
  }
});

console.log('✅ Multer configured');
console.log('   └─ Expected field name: "file"');
console.log('   └─ Max file size: 10MB');
console.log('   └─ Allowed types: PDF, DOC, DOCX, JPG, PNG');

// ═══════════════════════════════════════════════════════════════
// 📤 UPLOAD DOCUMENT ROUTE
// ═══════════════════════════════════════════════════════════════

// Middleware 1: Log incoming request
router.post('/', (req, res, next) => {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║  📤 NEW UPLOAD REQUEST                            ║');
  console.log('╚═══════════════════════════════════════════════════╝');
  console.log('⏰ Time:', new Date().toLocaleString('en-IN'));
  console.log('🌐 Method:', req.method);
  console.log('🔗 URL:', req.originalUrl);
  console.log('📋 Content-Type:', req.headers['content-type']);
  console.log('📦 Content-Length:', req.headers['content-length'], 'bytes');
  console.log('─────────────────────────────────────────────────────');
  next();
});

// Middleware 2: Multer with error handling
router.post('/', (req, res, next) => {
  const uploadSingle = upload.single('file');
  
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('\n╔═══════════════════════════════════════════════════╗');
      console.error('║  ❌ MULTER ERROR                                  ║');
      console.error('╚═══════════════════════════════════════════════════╝');
      console.error('Error Code:', err.code);
      console.error('Error Message:', err.message);
      
      if (err.code === 'UNEXPECTED_FIELD') {
        console.error('\n🔴 FIELD NAME MISMATCH DETECTED!');
        console.error('─────────────────────────────────────────────────────');
        console.error('Expected field name: "file"');
        console.error('Received field name:', err.field);
        console.error('─────────────────────────────────────────────────────');
        console.error('\n💡 SOLUTION:');
        console.error('In your frontend code, change:');
        console.error(`  ❌ formData.append("${err.field}", file)`);
        console.error('  ✅ formData.append("file", file)');
        console.error('─────────────────────────────────────────────────────\n');
        
        return res.status(400).json({
          success: false,
          message: `Field name mismatch! Expected "file" but received "${err.field}"`,
          error: {
            code: 'FIELD_NAME_MISMATCH',
            expected: 'file',
            received: err.field,
            solution: 'Change formData.append() to use "file" as field name'
          }
        });
      }
      
      if (err.code === 'LIMIT_FILE_SIZE') {
        console.error('File too large! Max size: 10MB');
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 10MB'
        });
      }
      
      return res.status(400).json({
        success: false,
        message: err.message
      });
      
    } else if (err) {
      console.error('\n❌ OTHER ERROR:', err.message);
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
    
    // No error, proceed to next middleware
    console.log('✅ Multer processing successful');
    next();
  });
});

// Middleware 3: Main upload handler with try-catch and fallback
router.post('/', async (req, res) => {
  try {
    console.log('\n🔍 POST-MULTER PROCESSING');
    console.log('─────────────────────────────────────────────────────');
    console.log('📄 Body fields:', Object.keys(req.body).join(', '));
    console.log('📎 File received:', req.file ? 'YES' : 'NO');
    
    if (req.file) {
      console.log('\n📎 File Details:');
      console.log('   └─ Field name:', req.file.fieldname);
      console.log('   └─ Original name:', req.file.originalname);
      console.log('   └─ Mimetype:', req.file.mimetype);
      console.log('   └─ Size:', (req.file.size / 1024).toFixed(2), 'KB');
      console.log('   └─ Path:', req.file.path);
    }
    
    console.log('\n📋 Body Data:');
    console.log(JSON.stringify(req.body, null, 2));
    console.log('─────────────────────────────────────────────────────');

    // ⭐ Extract fields from req.body
    const { name, category, linkedCase, linkedCaseNumber, linkedClient, description } = req.body;

    // Validation: File must exist
    if (!req.file) {
      console.error('❌ Validation failed: No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please select a file.'
      });
    }

    // Validation: Required fields
    if (!name || !category) {
      console.error('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Name and category are required fields'
      });
    }

    console.log('✅ All validations passed');

    // ✅ FIXED: Resolve case references with try-catch and fallback
    let caseObjectId = null;
    let caseNumber = null;

    // If linkedCaseNumber is provided, look it up by case number (STRING)
    if (linkedCaseNumber && linkedCaseNumber.trim() !== '') {
      console.log('🔍 Looking up case by caseNumber:', linkedCaseNumber);
      
      try {
        const caseDoc = await Case.findOne({ caseNumber: linkedCaseNumber });
        
        if (caseDoc) {
          caseObjectId = caseDoc._id;
          caseNumber = caseDoc.caseNumber;
          console.log('   ✅ Case found:');
          console.log('      └─ ObjectId:', caseObjectId);
          console.log('      └─ Case Number:', caseNumber);
        } else {
          console.log('   ⚠️ Case not found in database');
          console.log('   ℹ️ Using provided case number as fallback');
          caseNumber = linkedCaseNumber; // Fallback: use input
        }
      } catch (error) {
        console.log('   ⚠️ Error looking up case:', error.message);
        console.log('   ℹ️ Using provided case number as fallback');
        caseNumber = linkedCaseNumber; // Fallback: use input
      }
    }

    // If linkedCase ObjectId is provided (alternative lookup)
    if (linkedCase && linkedCase.trim() !== '' && !linkedCaseNumber) {
      console.log('🔍 Looking up case by ObjectId:', linkedCase);
      
      try {
        // Validate if it's a valid ObjectId format
        const objectIdRegex = /^[0-9a-fA-F]{24}$/;
        if (objectIdRegex.test(linkedCase)) {
          const caseDoc = await Case.findById(linkedCase);
          
          if (caseDoc) {
            caseObjectId = caseDoc._id;
            caseNumber = caseDoc.caseNumber;
            console.log('   ✅ Case found:');
            console.log('      └─ ObjectId:', caseObjectId);
            console.log('      └─ Case Number:', caseNumber);
          } else {
            console.log('   ⚠️ Case not found');
          }
        } else {
          console.log('   ⚠️ Invalid ObjectId format, treating as case number');
          caseNumber = linkedCase; // Fallback: treat as case number
        }
      } catch (error) {
        console.log('   ⚠️ Error looking up case:', error.message);
        caseNumber = linkedCase; // Fallback: use input
      }
    }

    // ⭐ Validate linkedClient - check if it's a valid ObjectId
    let clientObjectId = null;
    if (linkedClient && linkedClient.trim() !== '') {
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (objectIdRegex.test(linkedClient)) {
        clientObjectId = linkedClient;
        console.log('✅ Valid client ObjectId:', clientObjectId);
      } else {
        console.log('⚠️ linkedClient is not a valid ObjectId, setting to null');
        console.log('   Received value:', linkedClient);
        console.log('   Expected format: 24 character hex string');
      }
    } else {
      console.log('ℹ️ No linkedClient provided');
    }

    // Create document data
    const documentData = {
      name: name || req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      size: `${(req.file.size / 1024).toFixed(2)} KB`,
      category,
      linkedCase: caseObjectId,
      linkedCaseNumber: caseNumber,
      linkedClient: clientObjectId,
      description: description || '',
      uploadedBy: 'Current User',
    };

    console.log('\n💾 Creating document...');
    console.log('Document data:', JSON.stringify({
      name: documentData.name,
      category: documentData.category,
      linkedCaseNumber: documentData.linkedCaseNumber,
      linkedCase: documentData.linkedCase,
      linkedClient: documentData.linkedClient || 'null'
    }, null, 2));
    
    const newDoc = await Document.create(documentData);

    console.log('\n✅✅✅ SUCCESS! ✅✅✅');
    console.log('Document ID:', newDoc._id);
    console.log('File saved at:', newDoc.filePath);
    console.log('Linked to case:', newDoc.linkedCaseNumber || 'None');
    console.log('Linked to client:', newDoc.linkedClient || 'None');
    console.log('╚═══════════════════════════════════════════════════╝\n');

    res.status(201).json({ 
      success: true, 
      message: 'Document uploaded successfully', 
      data: newDoc 
    });

  } catch (err) {
    console.error('\n╔═══════════════════════════════════════════════════╗');
    console.error('║  ❌ ERROR IN UPLOAD HANDLER                       ║');
    console.error('╚═══════════════════════════════════════════════════╝');
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    console.error('╚═══════════════════════════════════════════════════╝\n');
    
    // Clean up uploaded file if document creation fails
    if (req.file && req.file.path) {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
          console.log('🗑️ Cleaned up uploaded file after error');
        }
      } catch (cleanupError) {
        console.error('⚠️ Failed to clean up file:', cleanupError.message);
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// 📚 GET ALL DOCUMENTS
// ═══════════════════════════════════════════════════════════════
router.get('/', async (req, res) => {
  try {
    console.log('\n📚 GET ALL DOCUMENTS');
    
    const { client, category, linkedCase } = req.query;
    
    const filter = {};
    if (client) filter.linkedClient = client;
    if (category) filter.category = category;
    if (linkedCase) filter.linkedCaseNumber = linkedCase;

    console.log('Filter:', JSON.stringify(filter));
    
    const docs = await Document.find(filter)
      .sort({ uploadDate: -1 })
      .populate('linkedCase')
      .populate('linkedClient');
    
    console.log('✅ Found', docs.length, 'documents\n');
    
    res.json({ success: true, count: docs.length, data: docs });
  } catch (err) {
    console.error('❌ Error fetching documents:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch documents',
      error: err.message 
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// 📁 GET DOCUMENTS BY CASE NUMBER
// ═══════════════════════════════════════════════════════════════
router.get('/case/:caseNumber', async (req, res) => {
  try {
    const { caseNumber } = req.params;
    
    console.log('\n📁 GET DOCUMENTS BY CASE NUMBER');
    console.log('Case number:', caseNumber);
    console.log('Query field: linkedCaseNumber (String)');
    
    const docs = await Document.find({ linkedCaseNumber: caseNumber })
      .sort({ uploadDate: -1 })
      .populate('linkedClient')
      .populate('linkedCase');
    
    console.log('✅ Found', docs.length, 'documents\n');

    res.status(200).json({
      success: true,
      count: docs.length,
      data: docs
    });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch documents by case number',
      error: err.message 
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// 📁 GET DOCUMENTS BY CASE OBJECTID
// ═══════════════════════════════════════════════════════════════
router.get('/case-id/:caseId', async (req, res) => {
  try {
    const { caseId } = req.params;
    
    console.log('\n📁 GET DOCUMENTS BY CASE OBJECTID');
    console.log('Case ID:', caseId);
    
    const docs = await Document.find({ linkedCase: caseId })
      .sort({ uploadDate: -1 })
      .populate('linkedClient')
      .populate('linkedCase');
    
    console.log('✅ Found', docs.length, 'documents\n');

    res.status(200).json({
      success: true,
      count: docs.length,
      data: docs
    });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch documents by case ID',
      error: err.message 
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// 📄 GET SINGLE DOCUMENT
// ═══════════════════════════════════════════════════════════════
router.get('/:id', async (req, res) => {
  try {
    console.log('\n📄 GET DOCUMENT:', req.params.id);
    
    const doc = await Document.findById(req.params.id)
      .populate('linkedCase')
      .populate('linkedClient');
    
    if (!doc) {
      console.log('❌ Not found\n');
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    console.log('✅ Found:', doc.name, '\n');
    res.json({ success: true, data: doc });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch document',
      error: err.message 
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// 📥 DOWNLOAD DOCUMENT
// ═══════════════════════════════════════════════════════════════
router.get('/:id/download', async (req, res) => {
  try {
    console.log('\n📥 DOWNLOAD DOCUMENT:', req.params.id);
    
    const doc = await Document.findById(req.params.id);
    
    if (!doc) {
      console.log('❌ Document not found\n');
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    if (!fs.existsSync(doc.filePath)) {
      console.log('❌ File not found on disk\n');
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    console.log('✅ Sending file:', doc.name);
    res.download(doc.filePath, doc.name);
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to download document',
      error: err.message 
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// 🔄 UPDATE DOCUMENT
// ═══════════════════════════════════════════════════════════════
router.put('/:id', async (req, res) => {
  try {
    console.log('\n🔄 UPDATE DOCUMENT:', req.params.id);
    
    const { name, category, description, status } = req.body;
    
    const updatedDoc = await Document.findByIdAndUpdate(
      req.params.id,
      { name, category, description, status },
      { new: true, runValidators: true }
    );

    if (!updatedDoc) {
      console.log('❌ Not found\n');
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    console.log('✅ Updated successfully\n');
    res.json({ 
      success: true, 
      message: 'Document updated successfully',
      data: updatedDoc 
    });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update document',
      error: err.message 
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// 🗑️ DELETE DOCUMENT
// ═══════════════════════════════════════════════════════════════
router.delete('/:id', async (req, res) => {
  try {
    console.log('\n🗑️ DELETE DOCUMENT:', req.params.id);
    
    const doc = await Document.findByIdAndDelete(req.params.id);

    if (!doc) {
      console.log('❌ Not found\n');
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Delete file from filesystem
    if (doc.filePath && fs.existsSync(doc.filePath)) {
      try {
        fs.unlinkSync(doc.filePath);
        console.log('✅ File deleted from disk');
      } catch (fileError) {
        console.log('⚠️ Failed to delete file from disk:', fileError.message);
      }
    }

    console.log('✅ Deleted successfully\n');
    res.json({ 
      success: true, 
      message: 'Document deleted successfully' 
    });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete document',
      error: err.message 
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// 📊 GET STATISTICS
// ═══════════════════════════════════════════════════════════════
router.get('/stats/overview', async (req, res) => {
  try {
    console.log('\n📊 GET STATISTICS');
    
    const stats = await Document.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalSize: { $sum: { $toDouble: { $substr: ['$size', 0, -3] } } }
        }
      }
    ]);

    const totalDocs = await Document.countDocuments();

    console.log('✅ Total:', totalDocs, 'documents\n');

    res.json({
      success: true,
      data: {
        total: totalDocs,
        byCategory: stats
      }
    });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch statistics',
      error: err.message 
    });
  }
});

console.log('\n✅ ═══════════════════════════════════════════════════');
console.log('✅ Document Routes Configured Successfully');
console.log('✅ ═══════════════════════════════════════════════════');
console.log('   POST   /               - Upload (field: "file")');
console.log('   GET    /               - Get all (with filters)');
console.log('   GET    /case/:num      - Get by case number');
console.log('   GET    /case-id/:id    - Get by case ObjectId');
console.log('   GET    /:id            - Get single');
console.log('   GET    /:id/download   - Download file');
console.log('   PUT    /:id            - Update');
console.log('   DELETE /:id            - Delete');
console.log('   GET    /stats/overview - Statistics');
console.log('✅ ═══════════════════════════════════════════════════\n');

export default router;