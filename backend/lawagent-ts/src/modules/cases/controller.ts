import { Request, Response } from 'express';
import { prisma } from '@/services/prisma';
import { sendSuccess, sendServerError, sendNotFound, sendForbidden } from '@/utils/helpers';
import { asyncHandler } from '@/middleware/errorHandler';
import { UserRole, CaseStatus, RiskLevel } from '@prisma/client'; // Import UserRole, CaseStatus, and RiskLevel

/**
 * Create a new case.
 */
export const createCase = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId || req.user.role !== UserRole.ADVOCATE) {
      return sendServerError(res, 'User not authenticated or not an advocate');
    }

    const {
      title,
      category,
      status,
      progressPct,
      riskLevel,
      successProbPct,
      valueUsd,
      clientId,
      clerkId,
      openedDate,
      closedDate,
    } = req.body;

    const newCase = await prisma.case.create({
      data: {
        title,
        category,
        status,
        progressPct,
        riskLevel,
        successProbPct,
        valueUsd,
        clientId,
        advocateId: req.user.userId,
        clerkId,
        openedDate: openedDate ? new Date(openedDate) : undefined,
        closedDate: closedDate ? new Date(closedDate) : undefined,
      },
    });

    return sendSuccess(res, 'Case created successfully', { case: newCase }, 201);
  } catch (error) {
    console.error('Create case error:', error);
    return sendServerError(res, 'Failed to create case');
  }
});

/**
 * Get a paginated and filterable list of cases for the authenticated user.
 */
export const getCases = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId || !req.user?.role) {
      return sendServerError(res, 'User not authenticated or role not found');
    }

    const userId = req.user.userId;
    const userRole = req.user.role;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as CaseStatus; // Use CaseStatus enum

    const skip = (page - 1) * limit;

    let whereClause: any = {};

    // Filter cases based on user role
    switch (userRole) {
      case UserRole.ADVOCATE:
        whereClause.advocateId = userId;
        break;
      case UserRole.CLERK:
        // Clerks can see cases based on RLS policies. No explicit filter here.
        // RLS policy for hearings will link to cases owned by advocate.
        break;
      case UserRole.STUDENT:
        // Students might not have direct cases, or their cases are linked differently
        // For now, we'll return an empty array or handle specific student-case relationships
        return sendSuccess(res, 'Cases retrieved successfully', { cases: [], total: 0, page, limit });
      default:
        return sendServerError(res, 'Unsupported user role for case retrieval');
    }

    if (status) {
      whereClause.status = status;
    }

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { id: true, name: true, email: true } },
          advocate: { select: { id: true, name: true, email: true } },
          _count: { select: { documents: true } },
        },
      }),
      prisma.case.count({ where: whereClause }),
    ]);

    return sendSuccess(res, 'Cases retrieved successfully', {
      cases,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Get cases error:', error);
    return sendServerError(res, 'Failed to retrieve cases');
  }
});

/**
 * Get a single case by ID for the authenticated user.
 */
export const getCaseById = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId || !req.user?.role) {
      return sendServerError(res, 'User not authenticated or role not found');
    }

    const { id } = req.params;

    const caseItem = await prisma.case.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true, email: true } },
        advocate: { select: { id: true, name: true, email: true } },
        documents: true,
        hearings: true,
        caseStages: true,
        simulations: true,
        activities: true,
      },
    });

    if (!caseItem) {
      return sendServerError(res, 'Case not found');
    }

    // RLS should handle access control, but a final check can be added if needed
    // For example, if (caseItem.advocateId !== req.user.userId && caseItem.clientId !== req.user.userId && req.user.role !== UserRole.CLERK) {
    //   return sendForbidden(res, 'Access denied');
    // }

    return sendSuccess(res, 'Case retrieved successfully', { case: caseItem });
  } catch (error) {
    console.error('Get case by ID error:', error);
    return sendServerError(res, 'Failed to retrieve case');
  }
});

/**
 * Update an existing case.
 */
export const updateCase = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId || req.user.role !== UserRole.ADVOCATE) {
      return sendServerError(res, 'User not authenticated or not an advocate');
    }

    const { id } = req.params;
    const {
      title,
      category,
      status,
      progressPct,
      riskLevel,
      successProbPct,
      valueUsd,
      clientId,
      clerkId,
      openedDate,
      closedDate,
    } = req.body;

    const existingCase = await prisma.case.findUnique({
      where: { id },
    });

    if (!existingCase) {
      return sendNotFound(res, 'Case not found');
    }

    // Ensure only the advocate who owns the case can update it
    if (existingCase.advocateId !== req.user.userId) {
      return sendForbidden(res, 'Access denied: You do not own this case');
    }

    const updatedCase = await prisma.case.update({
      where: { id },
      data: {
        title,
        category,
        status,
        progressPct,
        riskLevel,
        successProbPct,
        valueUsd,
        clientId,
        clerkId,
        openedDate: openedDate ? new Date(openedDate) : undefined,
        closedDate: closedDate ? new Date(closedDate) : undefined,
      },
    });

    return sendSuccess(res, 'Case updated successfully', { case: updatedCase });
  } catch (error) {
    console.error('Update case error:', error);
    return sendServerError(res, 'Failed to update case');
  }
});
