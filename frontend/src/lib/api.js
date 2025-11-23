import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Replace with your actual backend API base URL

// Helper function to create authenticated axios instances
const createAuthInstance = (token) => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

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
    const authAxios = createAuthInstance(token);
    const response = await authAxios.get(`/auth/me`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Template and Category API functions
export const getTemplateCategories = async (token) => {
  try {
    const authAxios = createAuthInstance(token);
    const response = await authAxios.get(`/templates/categories`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getTemplates = async (token, params = {}) => {
  try {
    const authAxios = createAuthInstance(token);
    const response = await authAxios.get(`/templates`, { params });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getTemplateById = async (token, id) => {
  try {
    const authAxios = createAuthInstance(token);
    const response = await authAxios.get(`/templates/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
