import { Request, Response } from 'express';
import { prisma } from '@/services/prisma';
import { sendSuccess, sendServerError } from '@/utils/helpers';
import { asyncHandler } from '@/middleware/errorHandler';

/**
 * Get a paginated list of notifications for the authenticated user.
 */
export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return sendServerError(res, 'User not authenticated');
    }

    const userId = req.user.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const isRead = req.query.isRead !== undefined ? String(req.query.isRead).toLowerCase() === 'true' : undefined;

    const skip = (page - 1) * limit;

    let whereClause: any = {
      userId: userId,
    };

    if (isRead !== undefined) {
      whereClause.isRead = isRead;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where: whereClause }),
      prisma.notification.count({ where: { userId, isRead: false } }), // Fetch unread count
    ]);

    const formattedNotifications = notifications.map(notification => ({
      ...notification,
      createdAt: notification.createdAt.toISOString(),
      updatedAt: notification.updatedAt.toISOString(),
    }));

    return sendSuccess(res, 'Notifications retrieved successfully', {
      notifications: formattedNotifications,
      total,
      page,
      limit,
      unreadCount, // Include unread count
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return sendServerError(res, 'Failed to retrieve notifications');
  }
});
