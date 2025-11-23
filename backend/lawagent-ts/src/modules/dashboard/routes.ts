import { Router } from 'express';
import { getDashboard } from './controller';
import { verifyToken } from '@/middleware/auth';

const router = Router();

/**
 * @swagger
 * /dashboard:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get role-based dashboard data
 *     description: Retrieves dashboard data tailored to the authenticated user's role (Advocate, Clerk, Student).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
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
 *                   description: Dynamic dashboard data based on user role.
 *       401:
 *         description: Unauthorized - User not authenticated or role not found.
 *       500:
 *         description: Server Error - Failed to retrieve dashboard data.
 */
router.get('/', verifyToken, getDashboard);

export default router;
