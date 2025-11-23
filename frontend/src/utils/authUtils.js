import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for handling professional logout functionality
 * Ensures consistent logout behavior across all dashboard components
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async (options = {}) => {
    const {
      showLoading = true,
      redirect = '/',
      onSuccess,
      onError
    } = options;

    try {
      // Show loading state if requested
      if (showLoading && options.setLoading) {
        options.setLoading(true);
      }

      // Add a brief delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      // Clear authentication state
      logout();

      // Redirect to specified page (default: home)
      navigate(redirect);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      
      // Call error callback if provided
      if (onError) {
        onError(error);
      }

      return { success: false, error };
    } finally {
      // Hide loading state
      if (showLoading && options.setLoading) {
        options.setLoading(false);
      }
    }
  };

  return { handleLogout };
};

/**
 * Utility function for standardized logout across components
 */
export const performLogout = async (logout, navigate, options = {}) => {
  const {
    redirect = '/',
    delay = 500
  } = options;

  try {
    // Add delay for smooth UX
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Clear authentication
    logout();
    
    // Navigate to home page
    navigate(redirect);
    
    return { success: true };
  } catch (error) {
    console.error('Logout operation failed:', error);
    return { success: false, error };
  }
};