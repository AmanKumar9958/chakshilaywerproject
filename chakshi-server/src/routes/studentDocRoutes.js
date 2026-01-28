import express from 'express';
import { 
  uploadMiddleware,
  createDocument,
  getAllDocuments,
  downloadDocument,
  viewDocument,
  updateDocument,
  deleteDocument 
} from '../controllers/studentDocController.js';

const router = express.Router();

// Upload document (matches frontend: /documents/upload)
router.post(
  '/documents/upload',
  uploadMiddleware,
  createDocument
);

// Get all documents
router.get('/documents', getAllDocuments);

// Download document
router.get('/documents/download/:id', downloadDocument);

// View document (stream for preview)
router.get('/documents/view/:id', viewDocument);

// Update document title
router.put('/documents/:id', updateDocument);

// Delete document
router.delete('/documents/:id', deleteDocument);

export default router;
