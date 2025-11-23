import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifySupabaseJWT } from '@/services/supabaseClient';
import { prisma } from '@/services/prisma';
import { sendUnauthorized, sendForbidden } from '@/utils/helpers';
import { config } from '@/config';
import { User, UserRole } from '@prisma/client'; // Import User and UserRole

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole; // Use UserRole enum
        userId?: string; // Database user ID
      };
    }
  }
}

/**
 * Middleware to verify JWT token from Supabase
 */
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendUnauthorized(res, 'No token provided');
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token with Supabase
    const user = await verifySupabaseJWT(token);
    
    // Find user in our database
    const dbUser: User | null = await prisma.user.findUnique({
      where: { id: user.id }, // Use Supabase ID as our primary ID
      // include: { profile: true }, // Removed incorrect include
    });

    if (!dbUser || !dbUser.isActive) {
      sendUnauthorized(res, 'User not found or inactive');
      return;
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email || '',
      role: dbUser.role,
      userId: dbUser.id,
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    sendUnauthorized(res, 'Invalid token');
    return;
  }
};

/**
 * Middleware to check if user has required role
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendUnauthorized(res, 'Authentication required');
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendForbidden(res, 'Insufficient permissions');
      return;
    }

    next();
  };
};

/**
 * Middleware to check if user is advocate
 */
export const requireAdvocate = requireRole([UserRole.ADVOCATE]);

/**
 * Middleware to check if user is clerk
 */
export const requireClerk = requireRole([UserRole.CLERK]);

/**
 * Middleware to check if user is student
 */
export const requireStudent = requireRole([UserRole.STUDENT]);

/**
 * Middleware for optional authentication (doesn't fail if no token)
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without user
    }

    const token = authHeader.substring(7);
    const user = await verifySupabaseJWT(token);
    
    const dbUser: User | null = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (dbUser && dbUser.isActive) {
      req.user = {
        id: user.id,
        email: user.email || '',
        role: dbUser.role,
        userId: dbUser.id,
      };
    }

    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
};
