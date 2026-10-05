import apiClient from '../api/apiClient';

export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post('/users/login', credentials);
    return response.data; // { user: email, token: string }
  },

  register: async (userData) => {
    const response = await apiClient.post('/users/register', userData);
    return response.data;
  },

  getUserProfile: async (userId) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },
};

export default authService;
