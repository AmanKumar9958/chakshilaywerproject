import { Router } from 'express';
import { getRecentActivities } from './controller';
import { verifyToken } from '@/middleware/auth';

const router = Router();

/**
 * @swagger
 * /activity:
 *   get:
 *     tags:
 *       - Activity
 *     summary: Get recent user activities
 *     description: Retrieve a list of recent activities or events related to the authenticated user.
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
 *     responses:
 *       200:
 *         description: Recent activities retrieved successfully
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
 *                     activities:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: string }
 *                           action: { type: string }
 *                           text: { type: string }
 *                           time: { type: string }
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', verifyToken, getRecentActivities);

export default router;
