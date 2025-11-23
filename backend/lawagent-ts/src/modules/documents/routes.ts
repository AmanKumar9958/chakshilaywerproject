import { Router } from 'express';
import { getSignedUrl, getDocuments } from './controller';
import { verifyToken } from '@/middleware/auth';

const router = Router();

/**
 * @swagger
 * /documents:
 *   get:
 *     tags:
 *       - Documents
 *     summary: Get a list of documents for the authenticated user
 *     description: Retrieve a paginated and filterable list of documents.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: caseId
 *         schema:
 *           type: string
 *         description: Filter documents by associated case ID
 *       - in: query
 *         name: needsReview
 *         schema:
 *           type: boolean
 *         description: Filter documents by review status
 *       - in: query
 *         name: docType
 *         schema:
 *           type: string
 *           enum: [LEGAL_DOCUMENT, EVIDENCE, CONTRACT, CERTIFICATE, OTHER]
 *         description: Filter documents by type
 *     responses:
 *       200:
 *         description: List of documents retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     documents:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: string }
 *                           fileName: { type: string }
 *                           caseId: { type: string }
 *                           uploadedBy: { type: string }
 *                           uploadedAt: { type: string, format: "date-time" }
 *                           needsReview: { type: boolean }
 *                           docType: { type: string }
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * /documents/{id}/signed-url:
 *   get:
 *     tags:
 *       - Documents
 *     summary: Generate a time-limited signed URL for a document
 *     description: Returns a pre-signed URL to access a specific document from storage.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the document
 *     responses:
 *       200:
 *         description: Signed URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     signedUrl:
 *                       type: string
 *                       format: url
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Document not found
 *       500:
 *         description: Server error
 */
router.get('/', verifyToken, getDocuments);
router.get('/:id/signed-url', verifyToken, getSignedUrl);

export default router;
