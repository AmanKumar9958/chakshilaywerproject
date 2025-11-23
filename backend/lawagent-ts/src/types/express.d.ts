import { UserRole } from '@prisma/client';

// Extend the Express Request type to include a 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: UserRole;
      };
    }
  }
}
