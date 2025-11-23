import { Router } from 'express';
import { getSchedule } from './controller';
import { verifyToken } from '@/middleware/auth';

const router = Router();

/**
 * @swagger
 * /schedule:
 *   get:
 *     tags:
 *       - Schedule
 *     summary: Get user's daily schedule
 *     description: Retrieve a list of scheduled events for the authenticated user for a given day.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for schedule filter (e.g., YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for schedule filter (e.g., YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Schedule retrieved successfully
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
 *                     schedule:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: string }
 *                           type: { type: string }
 *                           title: { type: string }
 *                           description: { type: string }
 *                           scheduledAt: { type: string, format: "date-time" }
 *                           location: { type: string }
 *                           preparationRequired: { type: boolean }
 *                           caseId: { type: string }
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', verifyToken, getSchedule);

export default router;
