import { Request, Response } from 'express';
import { prisma } from '@/services/prisma'; // Import prisma
import { sendSuccess, sendServerError } from '@/utils/helpers';
import { asyncHandler } from '@/middleware/errorHandler';

/**
 * Get recent user activities
 */
export const getRecentActivities = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return sendServerError(res, 'User not authenticated');
    }

    const userId = req.user.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where: { userId: userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          userId: true,
          caseId: true,
          clientId: true,
          message: true,
          createdAt: true,
        },
      }),
      prisma.activity.count({ where: { userId: userId } }),
    ]);

    const formattedActivities = activities.map(activity => ({
      id: activity.id,
      userId: activity.userId,
      caseId: activity.caseId,
      clientId: activity.clientId,
      message: activity.message,
      createdAt: activity.createdAt.toISOString(), // ISO 8601 with timezone
    }));

    return sendSuccess(res, 'Recent activities retrieved successfully', {
      activities: formattedActivities,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Get recent activities error:', error);
    return sendServerError(res, 'Failed to retrieve recent activities');
  }
});
