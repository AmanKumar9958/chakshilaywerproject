const NewDocument = require('../models/newDocumentModel');
const NewCase = require('../models/newCaseModel');
const fs = require('fs');
const path = require('path');

// @desc    Upload new document
// @route   POST /api/new-document/upload
// @access  Public (No middleware)
exports.uploadDocument = async (req, res) => {
  console.log('\n========================================');
  console.log('📤 UPLOAD DOCUMENT CONTROLLER CALLED');
  console.log('========================================');
  console.log('📥 Request Body:', JSON.stringify(req.body, null, 2));
  console.log('📁 File Info:', req.file);

  try {
    const { title, description, documentType, caseId } = req.body;

    // Validation
    if (!title || !documentType || !caseId) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, documentType, and caseId'
      });
    }

    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    console.log('✅ Validation passed');

    // Check if case exists
    console.log(`🔍 Checking if case ${caseId} exists...`);
    const caseExists = await NewCase.findById(caseId);
    if (!caseExists) {
      console.log(`❌ Case not found: ${caseId}`);
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }
    console.log('✅ Case exists:', caseExists.caseNumber);

    // Create document object
    console.log('📝 Creating document object...');
    const documentData = {
      title,
      description: description || '',
      filename: req.file.filename,
      originalFilename: req.file.originalname,
      filepath: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      documentType,
      caseId,
      caseNumber: caseExists.caseNumber,
      caseTitle: caseExists.caseTitle,
      status: 'Uploaded',
      uploadedAt: new Date()
    };

    console.log('📄 Document Data:', JSON.stringify(documentData, null, 2));

    // Save document
    console.log('💾 Saving document to database...');
    const newDocument = await NewDocument.create(documentData);
    console.log('✅ Document saved successfully with ID:', newDocument._id);

    // Update case with document reference (optional)
    if (caseExists.documents) {
      caseExists.documents.push({
        name: title,
        url: req.file.path,
        uploadedAt: new Date()
      });
      caseExists.documentCount = (caseExists.documentCount || 0) + 1;
      await caseExists.save();
      console.log('✅ Case updated with document reference');
    }

    console.log('🎉 Document upload completed successfully!');
    console.log('========================================\n');

    res.status(201).json({
      success: true,
      message: `Document "${title}" uploaded successfully`,
      data: newDocument
    });

  } catch (error) {
    console.log('\n❌❌❌ ERROR IN UPLOAD DOCUMENT ❌❌❌');
    console.error('Error Details:', error);
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.log('========================================\n');

    // Delete uploaded file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log('🗑️ Cleaned up uploaded file after error');
    }

    res.status(500).json({
      success: false,
      message: 'Server error while uploading document',
      error: error.message
    });
  }
};

// @desc    Get all documents
// @route   GET /api/new-document
// @access  Public
exports.getAllDocuments = async (req, res) => {
  console.log('\n========================================');
  console.log('📋 GET ALL DOCUMENTS CONTROLLER CALLED');
  console.log('========================================');
  console.log('📥 Query Parameters:', JSON.stringify(req.query, null, 2));

  try {
    const { 
      documentType,
      status,
      caseId,
      search,
      sortBy = 'uploadedAt',
      sortOrder = 'desc'
    } = req.query;

    console.log('✅ Query parameters extracted');

    // Build filter object
    console.log('🔍 Building filter object...');
    const filter = { isDeleted: false };

    if (documentType && documentType !== 'All') {
      filter.documentType = documentType;
      console.log(`✅ Added document type filter: ${documentType}`);
    }

    if (status && status !== 'All') {
      filter.status = status;
      console.log(`✅ Added status filter: ${status}`);
    }

    if (caseId) {
      filter.caseId = caseId;
      console.log(`✅ Added case filter: ${caseId}`);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { caseNumber: { $regex: search, $options: 'i' } }
      ];
      console.log(`✅ Added search filter: "${search}"`);
    }

    console.log('📊 Final Filter Object:', JSON.stringify(filter, null, 2));

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    console.log(`🔀 Sorting by: ${sortBy} (${sortOrder})`);

    // Fetch documents
    console.log('🔍 Fetching documents from database...');
    const documents = await NewDocument.find(filter)
      .sort(sort)
      .populate('caseId', 'caseNumber caseTitle')
      .populate('uploadedBy', 'name email')
      .lean();

    console.log(`✅ Found ${documents.length} documents`);

    console.log('🎉 Documents fetched successfully!');
    console.log('========================================\n');

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });

  } catch (error) {
    console.log('\n❌❌❌ ERROR IN GET ALL DOCUMENTS ❌❌❌');
    console.error('Error Details:', error);
    console.log('========================================\n');

    res.status(500).json({
      success: false,
      message: 'Server error while fetching documents',
      error: error.message
    });
  }
};

// @desc    Get single document by ID
// @route   GET /api/new-document/:id
// @access  Public
exports.getDocumentById = async (req, res) => {
  console.log('\n========================================');
  console.log('🔍 GET DOCUMENT BY ID CONTROLLER CALLED');
  console.log('========================================');
  console.log('📥 Document ID:', req.params.id);

  try {
    console.log('🔍 Fetching document from database...');
    const document = await NewDocument.findById(req.params.id)
      .populate('caseId', 'caseNumber caseTitle')
      .populate('uploadedBy', 'name email');

    if (!document || document.isDeleted) {
      console.log(`❌ Document not found with ID: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    console.log('✅ Document found:', document.title);
    console.log('========================================\n');

    res.status(200).json({
      success: true,
      data: document
    });

  } catch (error) {
    console.log('\n❌❌❌ ERROR IN GET DOCUMENT BY ID ❌❌❌');
    console.error('Error Details:', error);
    console.log('========================================\n');

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching document',
      error: error.message
    });
  }
};

// @desc    View document (stream file)
// @route   GET /api/new-document/view/:id
// @access  Public
exports.viewDocument = async (req, res) => {
  console.log('\n========================================');
  console.log('👁️ VIEW DOCUMENT CONTROLLER CALLED');
  console.log('========================================');
  console.log('📥 Document ID:', req.params.id);

  try {
    const document = await NewDocument.findById(req.params.id);

    if (!document || document.isDeleted) {
      console.log(`❌ Document not found: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    console.log('✅ Document found:', document.title);

    // Check if file exists
    if (!fs.existsSync(document.filepath)) {
      console.log(`❌ File not found on disk: ${document.filepath}`);
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    // Increment views
    document.views += 1;
    await document.save();
    console.log(`✅ View count incremented to ${document.views}`);

    // Set headers
    res.setHeader('Content-Type', document.mimetype);
    res.setHeader('Content-Disposition', `inline; filename="${document.originalFilename}"`);

    // Stream file
    console.log('📤 Streaming file to client...');
    const fileStream = fs.createReadStream(document.filepath);
    fileStream.pipe(res);

    console.log('✅ File streamed successfully');
    console.log('========================================\n');

  } catch (error) {
    console.log('\n❌❌❌ ERROR IN VIEW DOCUMENT ❌❌❌');
    console.error('Error Details:', error);
    console.log('========================================\n');

    res.status(500).json({
      success: false,
      message: 'Server error while viewing document',
      error: error.message
    });
  }
};

// @desc    Download document
// @route   GET /api/new-document/download/:id
// @access  Public
exports.downloadDocument = async (req, res) => {
  console.log('\n========================================');
  console.log('⬇️ DOWNLOAD DOCUMENT CONTROLLER CALLED');
  console.log('========================================');
  console.log('📥 Document ID:', req.params.id);

  try {
    const document = await NewDocument.findById(req.params.id);

    if (!document || document.isDeleted) {
      console.log(`❌ Document not found: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    console.log('✅ Document found:', document.title);

    // Check if file exists
    if (!fs.existsSync(document.filepath)) {
      console.log(`❌ File not found on disk: ${document.filepath}`);
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    // Increment downloads
    document.downloads += 1;
    await document.save();
    console.log(`✅ Download count incremented to ${document.downloads}`);

    // Set headers for download
    res.setHeader('Content-Type', document.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalFilename}"`);
    res.setHeader('Content-Length', document.size);

    // Stream file
    console.log('📤 Streaming file to client for download...');
    const fileStream = fs.createReadStream(document.filepath);
    fileStream.pipe(res);

    console.log('✅ File downloaded successfully');
    console.log('========================================\n');

  } catch (error) {
    console.log('\n❌❌❌ ERROR IN DOWNLOAD DOCUMENT ❌❌❌');
    console.error('Error Details:', error);
    console.log('========================================\n');

    res.status(500).json({
      success: false,
      message: 'Server error while downloading document',
      error: error.message
    });
  }
};

// @desc    Delete document (soft delete)
// @route   DELETE /api/new-document/:id
// @access  Public
exports.deleteDocument = async (req, res) => {
  console.log('\n========================================');
  console.log('🗑️ DELETE DOCUMENT CONTROLLER CALLED');
  console.log('========================================');
  console.log('📥 Document ID:', req.params.id);

  try {
    const document = await NewDocument.findById(req.params.id);

    if (!document || document.isDeleted) {
      console.log(`❌ Document not found: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    console.log('✅ Document found:', document.title);

    // Soft delete
    console.log('🗃️ Soft deleting document...');
    document.isDeleted = true;
    document.deletedAt = new Date();
    document.status = 'Deleted';
    await document.save();

    console.log('✅ Document soft deleted successfully');
    console.log('========================================\n');

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.log('\n❌❌❌ ERROR IN DELETE DOCUMENT ❌❌❌');
    console.error('Error Details:', error);
    console.log('========================================\n');

    res.status(500).json({
      success: false,
      message: 'Server error while deleting document',
      error: error.message
    });
  }
};

// @desc    Get documents by case ID
// @route   GET /api/new-document/case/:caseId
// @access  Public
exports.getDocumentsByCase = async (req, res) => {
  console.log('\n========================================');
  console.log('📁 GET DOCUMENTS BY CASE CONTROLLER CALLED');
  console.log('========================================');
  console.log('📥 Case ID:', req.params.caseId);

  try {
    const documents = await NewDocument.findByCaseId(req.params.caseId);

    console.log(`✅ Found ${documents.length} documents for case`);
    console.log('========================================\n');

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });

  } catch (error) {
    console.log('\n❌❌❌ ERROR IN GET DOCUMENTS BY CASE ❌❌❌');
    console.error('Error Details:', error);
    console.log('========================================\n');

    res.status(500).json({
      success: false,
      message: 'Server error while fetching documents',
      error: error.message
    });
  }
};
