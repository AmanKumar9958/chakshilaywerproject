import { Router } from 'express';
import {
  createCase,
  getCases,
  getCaseById,
  updateCase,
} from './controller';
import { verifyToken, requireAdvocate } from '@/middleware/auth';

const router = Router();

/**
 * @swagger
 * /cases:
 *   get:
 *     tags:
 *       - Cases
 *     summary: Get a list of cases for the authenticated user
 *     description: Retrieve a paginated and filterable list of cases associated with the authenticated user's role.
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, PENDING, COMPLETED]
 *         description: Filter cases by status
 *     responses:
 *       200:
 *         description: List of cases retrieved successfully
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
 *                     cases:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Case'
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Server error
 */
router.post('/', verifyToken, requireAdvocate, createCase);
router.get('/', verifyToken, getCases); // RLS will handle access for clerks/advocates
router.get('/:id', verifyToken, getCaseById); // RLS will handle access for clerks/advocates
router.put('/:id', verifyToken, requireAdvocate, updateCase);

export default router;
