import { Request, Response } from 'express';
import { prisma } from '@/services/prisma'; // Import prisma
import { sendSuccess, sendServerError } from '@/utils/helpers';
import { asyncHandler } from '@/middleware/errorHandler';

/**
 * Get user's schedule with filtering and sorting.
 */
export const getSchedule = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return sendServerError(res, 'User not authenticated');
    }

    const userId = req.user.userId;
    const { from, to } = req.query;

    let whereClause: any = {
      case: {
        OR: [{ advocateId: userId }, { clientId: userId }],
      },
    };

    if (from || to) {
      whereClause.scheduledAt = {};
      if (from) {
        whereClause.scheduledAt.gte = new Date(from as string);
      }
      if (to) {
        whereClause.scheduledAt.lte = new Date(to as string);
      }
    }

    const scheduleEvents = await prisma.schedule.findMany({
      where: whereClause,
      orderBy: { scheduledAt: 'asc' }, // Sort by datetime
      select: {
        id: true,
        caseId: true,
        title: true,
        description: true,
        scheduledAt: true,
        location: true,
        preparationRequired: true,
      },
    });

    const formattedSchedule = scheduleEvents.map(event => ({
      id: event.id,
      caseId: event.caseId,
      title: event.title,
      description: event.description,
      scheduledAt: event.scheduledAt.toISOString(), // ISO 8601 with timezone
      location: event.location,
      preparationRequired: event.preparationRequired,
      // type: 'event', // Assuming a default type or infer from title/description
    }));

    return sendSuccess(res, 'Schedule retrieved successfully', {
      schedule: formattedSchedule,
    });
  } catch (error) {
    console.error('Get schedule error:', error);
    return sendServerError(res, 'Failed to retrieve schedule');
  }
});
