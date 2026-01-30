import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || '';


export const loginUser = async (token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { token });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const verifySupabaseToken = async (token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-token`, { token });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getCurrentUserProfile = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Add other API functions here as needed
