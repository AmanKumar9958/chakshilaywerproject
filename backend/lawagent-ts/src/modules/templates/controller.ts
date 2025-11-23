import { Request, Response } from 'express';
import { prisma } from '@/services/prisma';
import { sendSuccess, sendServerError, sendNotFound, sendForbidden } from '@/utils/helpers';
import { asyncHandler } from '@/middleware/errorHandler';
import { UserRole } from '@prisma/client';

// Helper to generate slug
const generateSlug = (name: string) => {
  return name.toLowerCase()
             .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters except spaces and hyphens
             .trim()
             .replace(/\s+/g, '-'); // Replace spaces with hyphens
};

// Category Controllers

/**
 * Get all template categories.
 */
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return sendSuccess(res, 'Categories retrieved successfully', { categories });
  } catch (error) {
    console.error('Get categories error:', error);
    return sendServerError(res, 'Failed to retrieve categories');
  }
});

/**
 * Create a new template category.
 */
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId || req.user.role !== UserRole.ADVOCATE) {
      return sendForbidden(res, 'Only advocates can create categories');
    }

    const { name, description } = req.body;
    const slug = generateSlug(name);

    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
        slug,
      },
    });
    return sendSuccess(res, 'Category created successfully', { category: newCategory }, 201);
  } catch (error) {
    console.error('Create category error:', error);
    return sendServerError(res, 'Failed to create category');
  }
});

// Template Controllers

/**
 * Get a list of templates.
 */
export const getTemplates = asyncHandler(async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const categoryId = req.query.categoryId as string;
    const isFree = req.query.isFree !== undefined ? String(req.query.isFree).toLowerCase() === 'true' : undefined;
    const difficulty = req.query.difficulty as string;

    const skip = (page - 1) * limit;

    let whereClause: any = {
      isPublic: true, // Only show public templates by default
    };

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }
    if (isFree !== undefined) {
      whereClause.isFree = isFree;
    }
    if (difficulty) {
      whereClause.difficulty = difficulty;
    }

    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          creator: { select: { id: true, name: true } },
        },
      }),
      prisma.template.count({ where: whereClause }),
    ]);

    return sendSuccess(res, 'Templates retrieved successfully', {
      templates,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Get templates error:', error);
    return sendServerError(res, 'Failed to retrieve templates');
  }
});

/**
 * Get a single template by ID.
 */
export const getTemplateById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const template = await prisma.template.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        creator: { select: { id: true, name: true } },
      },
    });

    if (!template) {
      return sendNotFound(res, 'Template not found');
    }

    return sendSuccess(res, 'Template retrieved successfully', { template });
  } catch (error) {
    console.error('Get template by ID error:', error);
    return sendServerError(res, 'Failed to retrieve template');
  }
});

/**
 * Create a new template.
 */
export const createTemplate = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId || req.user.role !== UserRole.ADVOCATE) {
      return sendForbidden(res, 'Only advocates can create templates');
    }

    const {
      title,
      description,
      content,
      categoryId,
      tags,
      isPublic,
      isFree,
      difficulty,
      rating,
      ratingCount,
      completionTimeMin,
      successRatePct,
    } = req.body;

    const newTemplate = await prisma.template.create({
      data: {
        title,
        description,
        content,
        categoryId,
        tags: tags || [],
        isPublic: isPublic ?? true,
        isFree: isFree ?? false,
        difficulty,
        rating,
        ratingCount,
        completionTimeMin,
        successRatePct,
        createdBy: req.user.userId,
      },
    });

    return sendSuccess(res, 'Template created successfully', { template: newTemplate }, 201);
  } catch (error) {
    console.error('Create template error:', error);
    return sendServerError(res, 'Failed to create template');
  }
});

/**
 * Update an existing template.
 */
export const updateTemplate = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId || req.user.role !== UserRole.ADVOCATE) {
      return sendForbidden(res, 'Only advocates can update templates');
    }

    const { id } = req.params;
    const {
      title,
      description,
      content,
      categoryId,
      tags,
      isPublic,
      isFree,
      difficulty,
      rating,
      ratingCount,
      completionTimeMin,
      successRatePct,
    } = req.body;

    const existingTemplate = await prisma.template.findUnique({
      where: { id },
    });

    if (!existingTemplate) {
      return sendNotFound(res, 'Template not found');
    }

    // Ensure only the creator or an admin can update the template
    if (existingTemplate.createdBy !== req.user.userId && req.user.role !== UserRole.ADVOCATE) {
      return sendForbidden(res, 'Access denied: You do not have permission to update this template');
    }

    const updatedTemplate = await prisma.template.update({
      where: { id },
      data: {
        title,
        description,
        content,
        categoryId,
        tags: tags || [],
        isPublic,
        isFree,
        difficulty,
        rating,
        ratingCount,
        completionTimeMin,
        successRatePct,
      },
    });

    return sendSuccess(res, 'Template updated successfully', { template: updatedTemplate });
  } catch (error) {
    console.error('Update template error:', error);
    return sendServerError(res, 'Failed to update template');
  }
});

/**
 * Delete a template.
 */
export const deleteTemplate = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId || req.user.role !== UserRole.ADVOCATE) {
      return sendForbidden(res, 'Only advocates can delete templates');
    }

    const { id } = req.params;

    const existingTemplate = await prisma.template.findUnique({
      where: { id },
    });

    if (!existingTemplate) {
      return sendNotFound(res, 'Template not found');
    }

    // Ensure only the creator or an admin can delete the template
    if (existingTemplate.createdBy !== req.user.userId && req.user.role !== UserRole.ADVOCATE) {
      return sendForbidden(res, 'Access denied: You do not have permission to delete this template');
    }

    await prisma.template.delete({
      where: { id },
    });

    return sendSuccess(res, 'Template deleted successfully', null, 204);
  } catch (error) {
    console.error('Delete template error:', error);
    return sendServerError(res, 'Failed to delete template');
  }
});
