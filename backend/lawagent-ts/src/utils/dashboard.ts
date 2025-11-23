e import { UserRole } from '@prisma/client';

/**
 * Transforms raw dashboard data from Supabase RPC into a frontend-friendly payload.
 * This function can be expanded to normalize data across different roles or add computed properties.
 * @param role The role of the user (e.g., ADVOCATE, CLERK, STUDENT).
 * @param rawData The raw data received from the Supabase RPC function.
 * @returns A structured dashboard payload.
 */
export const buildDashboardPayload = (role: UserRole, rawData: any) => {
  // For now, a simple passthrough.
  // In the future, this can be expanded to:
  // - Normalize data structure across roles
  // - Add computed fields
  // - Filter/transform specific data points
  switch (role) {
    case UserRole.ADVOCATE:
      return {
        activeCases: rawData.active_cases || 0,
        hearingsTomorrow: rawData.hearings_tomorrow || 0,
        recentActivity: rawData.recent_activity || [],
        // Add more advocate-specific transformations
      };
    case UserRole.CLERK:
      return {
        // Define clerk-specific payload structure
        // Example: upcomingTasks: rawData.upcoming_tasks || [],
      };
    case UserRole.STUDENT:
      return {
        // Example: enrolledCourses: rawData.enrolled_courses || [],
        recentActivities: rawData.recent_activities || [], // Assuming Supabase RPC provides 'recent_activities'
      };
    default:
      return rawData; // Fallback for unsupported roles or generic data
  }
};
