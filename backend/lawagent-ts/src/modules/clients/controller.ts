import { Request, Response } from 'express';
import { prisma } from '@/services/prisma';
import { sendSuccess, sendServerError, sendNotFound } from '@/utils/helpers';
import { asyncHandler } from '@/middleware/errorHandler';
import { UserRole } from '@prisma/client';

/**
 * Create a new client.
 */
export const createClient = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return sendServerError(res, 'User not authenticated');
    }

    const { name, email, phone, organisation, billingStatus, preferredContact } = req.body;

    const newClient = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        organisation,
        billingStatus,
        preferredContact,
        createdBy: req.user.userId,
      },
    });

    return sendSuccess(res, 'Client created successfully', { client: newClient }, 201);
  } catch (error) {
    console.error('Create client error:', error);
    return sendServerError(res, 'Failed to create client');
  }
});

/**
 * Get a paginated and filterable list of clients for the authenticated user.
 */
export const getClients = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId || !req.user?.role) {
      return sendServerError(res, 'User not authenticated or role not found');
    }

    const userId = req.user.userId;
    const userRole = req.user.role;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    let whereClause: any = {};

    // Advocates can only see clients they created
    if (userRole === UserRole.ADVOCATE) {
      whereClause.createdBy = userId;
    }
    // Clerks might see clients based on RLS, or if assigned to cases related to clients.
    // For now, we'll assume clerks can see clients created by their assigned advocates.
    // This would typically be handled by RLS or a more complex query joining AdvocateClerk.
    // For simplicity, we'll allow clerks to see all clients for now, assuming RLS will restrict.

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.client.count({ where: whereClause }),
    ]);

    return sendSuccess(res, 'Clients retrieved successfully', {
      clients,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Get clients error:', error);
    return sendServerError(res, 'Failed to retrieve clients');
  }
});

/**
 * Get a single client by ID.
 */
export const getClientById = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId || !req.user?.role) {
      return sendServerError(res, 'User not authenticated or role not found');
    }

    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    let whereClause: any = { id };

    // Advocates can only retrieve clients they created
    if (userRole === UserRole.ADVOCATE) {
      whereClause.createdBy = userId;
    }

    const client = await prisma.client.findUnique({
      where: whereClause,
    });

    if (!client) {
      return sendNotFound(res, 'Client not found or access denied');
    }

    return sendSuccess(res, 'Client retrieved successfully', { client });
  } catch (error) {
    console.error('Get client by ID error:', error);
    return sendServerError(res, 'Failed to retrieve client');
  }
});

/**
 * Update an existing client.
 */
export const updateClient = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId || !req.user?.role) {
      return sendServerError(res, 'User not authenticated or role not found');
    }

    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;
    const { name, email, phone, organisation, billingStatus, preferredContact } = req.body;

    let whereClause: any = { id };

    // Advocates can only update clients they created
    if (userRole === UserRole.ADVOCATE) {
      whereClause.createdBy = userId;
    }

    const existingClient = await prisma.client.findUnique({
      where: whereClause,
    });

    if (!existingClient) {
      return sendNotFound(res, 'Client not found or access denied');
    }

    const updatedClient = await prisma.client.update({
      where: { id }, // Update by ID, RLS will handle ownership
      data: {
        name,
        email,
        phone,
        organisation,
        billingStatus,
        preferredContact,
      },
    });

    return sendSuccess(res, 'Client updated successfully', { client: updatedClient });
  } catch (error) {
    console.error('Update client error:', error);
    return sendServerError(res, 'Failed to update client');
  }
});

/**
 * Delete a client.
 */
export const deleteClient = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId || !req.user?.role) {
      return sendServerError(res, 'User not authenticated or role not found');
    }

    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    let whereClause: any = { id };

    // Advocates can only delete clients they created
    if (userRole === UserRole.ADVOCATE) {
      whereClause.createdBy = userId;
    }

    const existingClient = await prisma.client.findUnique({
      where: whereClause,
    });

    if (!existingClient) {
      return sendNotFound(res, 'Client not found or access denied');
    }

    await prisma.client.delete({
      where: { id }, // Delete by ID, RLS will handle ownership
    });

    return sendSuccess(res, 'Client deleted successfully', null, 204);
  } catch (error) {
    console.error('Delete client error:', error);
    return sendServerError(res, 'Failed to delete client');
  }
});
