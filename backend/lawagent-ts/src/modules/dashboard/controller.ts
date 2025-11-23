import { Request, Response } from 'express';
import { sendSuccess, sendServerError } from '@/utils/helpers';
import { asyncHandler } from '@/middleware/errorHandler';
import { supabaseAdmin } from '@/services/supabaseClient'; // Import supabaseAdmin
import { UserRole } from '@prisma/client'; // Import UserRole

/**
 * Get role-based dashboard data using Supabase RPC views
 */
export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId || !req.user?.role) {
      return sendServerError(res, 'User not authenticated or role not found');
    }

    const userRole = req.user.role;
    let dashboardData: any;
    let rpcFunctionName: string;

    switch (userRole) {
      case UserRole.ADVOCATE:
        rpcFunctionName = 'advocate_dashboard';
        break;
      case UserRole.CLERK:
        rpcFunctionName = 'clerk_dashboard';
        break;
      case UserRole.STUDENT:
        rpcFunctionName = 'student_dashboard';
        break;
      default:
        return sendServerError(res, 'Unsupported user role for dashboard');
    }

    if (!supabaseAdmin) {
      return sendServerError(res, 'Supabase admin client not initialized');
    }

    const { data, error } = await supabaseAdmin.rpc(rpcFunctionName);

    if (error) {
      console.error(`Error fetching ${rpcFunctionName} dashboard:`, error);
      return sendServerError(res, `Failed to retrieve ${userRole} dashboard data`);
    }

    // Assuming the RPC returns a single row with JSON data
    dashboardData = data && data.length > 0 ? data[0] : {};

    // TODO: Integrate buildDashboardPayload utility here if needed for further formatting

    return sendSuccess(res, `${userRole} dashboard retrieved successfully`, dashboardData);
  } catch (error) {
    console.error('Dashboard retrieval error:', error);
    return sendServerError(res, 'Failed to retrieve dashboard data');
  }
});
