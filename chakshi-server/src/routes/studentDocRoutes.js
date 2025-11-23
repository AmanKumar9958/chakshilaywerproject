const express = require('express');
const router = express.Router();
const documentController = require('../controllers/studentDocController');

// Upload document (matches frontend: /documents/upload)
router.post(
  '/documents/upload',
  documentController.uploadMiddleware,
  documentController.createDocument
);

// Get all documents
router.get('/documents', documentController.getAllDocuments);

// Download document
router.get('/documents/download/:id', documentController.downloadDocument);

// View document (stream for preview)
router.get('/documents/view/:id', documentController.viewDocument);

// Update document title
router.put('/documents/:id', documentController.updateDocument);

// Delete document
router.delete('/documents/:id', documentController.deleteDocument);

module.exports = router;
