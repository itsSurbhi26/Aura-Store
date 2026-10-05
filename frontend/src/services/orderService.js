import apiClient from '../api/apiClient';

export const orderService = {
  getOrders: async () => {
    const response = await apiClient.get('/orders');
    return response.data;
  },

  getOrder: async (id) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await apiClient.put(`/orders/${id}`, { status });
    return response.data;
  },

  deleteOrder: async (id) => {
    const response = await apiClient.delete(`/orders/${id}`);
    return response.data;
  },

  getOrderCount: async () => {
    const response = await apiClient.get('/orders/get/count');
    return response.data; // { orderCount: number }
  },

  getTotalSales: async () => {
    const response = await apiClient.get('/orders/get/totalsales');
    return response.data; // { totalsales: number }
  },

  getUserOrders: async (userId) => {
    const response = await apiClient.get(`/orders/get/usersorders/${userId}`);
    return response.data;
  },
};

export default orderService;
