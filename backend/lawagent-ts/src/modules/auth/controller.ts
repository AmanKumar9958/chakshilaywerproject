import { Request, Response } from 'express';
import { verifySupabaseJWT } from '@/services/supabaseClient';
import { prisma } from '@/services/prisma';
import { sendSuccess, sendUnauthorized, sendServerError } from '@/utils/helpers';
import { asyncHandler } from '@/middleware/errorHandler';
import { User, Prisma } from '@prisma/client'; // Import User model and Prisma

type UserWithAdvocateProfile = Prisma.UserGetPayload<{
  include: { advocateProfile: true };
}>;

/**
 * Handles user login via Supabase JWT.
 * Verifies the token, and creates or updates the user in the local database.
 */
export const handleLogin = asyncHandler(async (req: Request, res: Response) => {
  try {
    const token = (req.body && req.body.token) || (req.headers.authorization || '').replace('Bearer ', '').trim();

    if (!token) {
      return sendUnauthorized(res, 'No token provided');
    }

    // Verify token with Supabase
    const supabaseUser = await verifySupabaseJWT(token);

    if (!supabaseUser) {
      return sendUnauthorized(res, 'Invalid or expired token');
    }

    // Find or create user in our database
    let dbUser: UserWithAdvocateProfile | null = await prisma.user.findUnique({
      where: { id: supabaseUser.id }, // Use Supabase ID as our primary ID
      include: { advocateProfile: true },
    });

    // If user doesn't exist in our database, create them with default role
    if (!dbUser) {
      const userName = (supabaseUser as any).user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User';
      await prisma.user.create({ // Create without including advocateProfile initially
        data: {
          id: supabaseUser.id, // Use Supabase ID
          email: supabaseUser.email || '',
          name: userName,
          role: 'STUDENT', // Always default to STUDENT role for security
        },
      });
      // Re-fetch the newly created user with advocateProfile
      dbUser = await prisma.user.findUnique({
        where: { id: supabaseUser.id },
        include: { advocateProfile: true },
      });
    } else {
      // User exists, optionally update user data if it changed in Supabase
      const updatedName = (supabaseUser as any).user_metadata?.full_name || dbUser.name;
      await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          email: supabaseUser.email || dbUser.email,
          name: updatedName,
          // Add other fields to update if necessary
        },
      });
      // Re-fetch to ensure advocateProfile is included after update if it wasn't before
      dbUser = await prisma.user.findUnique({
        where: { id: dbUser.id },
        include: { advocateProfile: true },
      });
    }

    // Ensure dbUser is not null after all operations
    if (!dbUser) {
      return sendServerError(res, 'Failed to retrieve or create user');
    }

    // Return user information
    return sendSuccess(res, 'Login successful', {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
        avatar: dbUser.avatar,
        isActive: dbUser.isActive,
        advocateProfile: dbUser.advocateProfile,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
      },
    });
  } catch (error) {
    console.error('Login/Token verification error:', error);
    return sendUnauthorized(res, 'Invalid or expired token');
  }
});

/**
 * Get current user profile
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return sendUnauthorized(res, 'User not authenticated');
    }

    const user: UserWithAdvocateProfile | null = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { advocateProfile: true },
    });

    if (!user) {
      return sendUnauthorized(res, 'User not found');
    }

    return sendSuccess(res, 'User profile retrieved successfully', {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        isActive: user.isActive,
        advocateProfile: user.advocateProfile, // Include advocateProfile here
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return sendServerError(res, 'Failed to retrieve user profile');
  }
});
