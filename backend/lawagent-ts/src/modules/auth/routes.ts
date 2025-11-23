import { Router } from 'express';
import { handleLogin, getCurrentUser } from './controller'; // Changed verifyToken to handleLogin
import { verifyToken as verifyTokenMiddleware } from '@/middleware/auth';

const router = Router();

/**
 * @swagger
 * /auth/verify-token:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify Supabase JWT token
 *     description: Verifies a Supabase JWT token and returns user information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token verified successfully
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
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid or missing token
 */
router.post('/verify-token', handleLogin); // Use handleLogin for verify-token as well, it handles both body and header tokens

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Handle user login via Supabase JWT
 *     description: Receives a Supabase JWT, verifies it, and ensures the user exists in the local database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Supabase JWT token
 *     responses:
 *       200:
 *         description: User logged in/registered successfully
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
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid or missing token
 */
router.post('/login', handleLogin); // Use handleLogin

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get current user profile
 *     description: Get the profile of the currently authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: User not authenticated
 */
router.get('/me', verifyTokenMiddleware, getCurrentUser);

export default router;
