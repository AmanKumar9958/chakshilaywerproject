import { Request, Response } from 'express';
import { prisma } from '@/services/prisma';
import { sendSuccess, sendServerError, sendNotFound, sendForbidden } from '@/utils/helpers';
import { asyncHandler } from '@/middleware/errorHandler';
import { UserRole } from '@prisma/client';

/**
 * Get hearings for a specific case.
 */
export const getHearingsByCaseId = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId || !req.user?.role) {
      return sendServerError(res, 'User not authenticated or role not found');
    }

    const { caseId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Verify case exists and user has access (advocate owns case or clerk is assigned)
    const caseItem = await prisma.case.findUnique({
      where: { id: caseId },
      select: { advocateId: true, clerkId: true },
    });

    if (!caseItem) {
      return sendNotFound(res, 'Case not found');
    }

    if (userRole === UserRole.ADVOCATE && caseItem.advocateId !== userId) {
      return sendForbidden(res, 'Access denied: You are not the advocate for this case');
    }

    if (userRole === UserRole.CLERK && caseItem.clerkId !== userId) {
      // Further RLS might be needed here to check if clerk is mapped to advocate
      return sendForbidden(res, 'Access denied: You are not assigned to this case');
    }

    const hearings = await prisma.hearing.findMany({
      where: { caseId },
      orderBy: { hearingDatetime: 'asc' },
    });

    return sendSuccess(res, 'Hearings retrieved successfully', { hearings });
  } catch (error) {
    console.error('Get hearings by case ID error:', error);
    return sendServerError(res, 'Failed to retrieve hearings');
  }
});

/**
 * Create a new hearing for a specific case.
 */
export const createHearing = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId || req.user.role !== UserRole.ADVOCATE) {
      return sendServerError(res, 'User not authenticated or not an advocate');
    }

    const caseId = req.params.caseId as string; // Assert caseId as string
    const { courtName, courtRoom, hearingDatetime, status, preparationNeeded } = req.body;

    // Verify case exists and advocate owns it
    const caseItem = await prisma.case.findUnique({
      where: { id: caseId },
      select: { advocateId: true },
    });

    if (!caseItem) {
      return sendNotFound(res, 'Case not found');
    }

    if (caseItem.advocateId !== req.user.userId) {
      return sendForbidden(res, 'Access denied: You are not the advocate for this case');
    }

    const newHearing = await prisma.hearing.create({
      data: {
        caseId,
        courtName,
        courtRoom,
        hearingDatetime: new Date(hearingDatetime),
        status,
        preparationNeeded,
      },
    });

    return sendSuccess(res, 'Hearing created successfully', { hearing: newHearing }, 201);
  } catch (error) {
    console.error('Create hearing error:', error);
    return sendServerError(res, 'Failed to create hearing');
  }
});
