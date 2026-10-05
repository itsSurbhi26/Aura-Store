import apiClient from '../api/apiClient';

export const userService = {
  getUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  getUser: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  getUserCount: async () => {
    const response = await apiClient.get('/users/get/count');
    return response.data; // { userCount: number }
  },
};

export default userService;
