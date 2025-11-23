import { Router } from 'express';
import {
  getCategories,
  createCategory,
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from './controller';
import { verifyToken, requireAdvocate } from '@/middleware/auth';

const router = Router();

// Category Routes
/**
 * @swagger
 * /templates/categories:
 *   get:
 *     tags:
 *       - Templates
 *     summary: Get all template categories
 *     description: Retrieve a list of all available template categories.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: string }
 *                           name: { type: string }
 *                           slug: { type: string }
 *                           description: { type: string }
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/categories', verifyToken, getCategories);

/**
 * @swagger
 * /templates/categories:
 *   post:
 *     tags:
 *       - Templates
 *     summary: Create a new template category
 *     description: Create a new category for templates. Requires ADVOCATE role.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name: { type: string }
 *               slug: { type: string }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Category created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Server error
 */
router.post('/categories', verifyToken, requireAdvocate, createCategory);

// Template Routes
/**
 * @swagger
 * /templates:
 *   get:
 *     tags:
 *       - Templates
 *     summary: Get a list of templates
 *     description: Retrieve a paginated and filterable list of templates.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Number of items per page
 *       - in: query
 *         name: categoryId
 *         schema: { type: string }
 *         description: Filter templates by category ID
 *       - in: query
 *         name: isFree
 *         schema: { type: boolean }
 *         description: Filter templates by free status
 *       - in: query
 *         name: difficulty
 *         schema: { type: string, enum: [Beginner, Intermediate, Advanced] }
 *         description: Filter templates by difficulty
 *     responses:
 *       200:
 *         description: Templates retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', verifyToken, getTemplates);

/**
 * @swagger
 * /templates/{id}:
 *   get:
 *     tags:
 *       - Templates
 *     summary: Get a single template by ID
 *     description: Retrieve a specific template by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *         description: The ID of the template
 *     responses:
 *       200:
 *         description: Template retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Template not found
 *       500:
 *         description: Server error
 */
router.get('/:id', verifyToken, getTemplateById);

/**
 * @swagger
 * /templates:
 *   post:
 *     tags:
 *       - Templates
 *     summary: Create a new template
 *     description: Create a new template. Requires ADVOCATE role.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - categoryId
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               content: { type: string }
 *               categoryId: { type: string }
 *               tags: { type: array, items: { type: string } }
 *               isPublic: { type: boolean }
 *               isFree: { type: boolean }
 *               difficulty: { type: string }
 *               rating: { type: number, format: float }
 *               ratingCount: { type: integer }
 *               completionTimeMin: { type: integer }
 *               successRatePct: { type: number, format: float }
 *     responses:
 *       201:
 *         description: Template created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Server error
 */
router.post('/', verifyToken, requireAdvocate, createTemplate);

/**
 * @swagger
 * /templates/{id}:
 *   put:
 *     tags:
 *       - Templates
 *     summary: Update an existing template
 *     description: Update an existing template by ID. Requires ADVOCATE role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *         description: The ID of the template
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               content: { type: string }
 *               categoryId: { type: string }
 *               tags: { type: array, items: { type: string } }
 *               isPublic: { type: boolean }
 *               isFree: { type: boolean }
 *               difficulty: { type: string }
 *               rating: { type: number, format: float }
 *               ratingCount: { type: integer }
 *               completionTimeMin: { type: integer }
 *               successRatePct: { type: number, format: float }
 *     responses:
 *       200:
 *         description: Template updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Template not found
 *       500:
 *         description: Server error
 */
router.put('/:id', verifyToken, requireAdvocate, updateTemplate);

/**
 * @swagger
 * /templates/{id}:
 *   delete:
 *     tags:
 *       - Templates
 *     summary: Delete a template
 *     description: Delete a template by ID. Requires ADVOCATE role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *         description: The ID of the template
 *     responses:
 *       204:
 *         description: Template deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Template not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', verifyToken, requireAdvocate, deleteTemplate);

export default router;
