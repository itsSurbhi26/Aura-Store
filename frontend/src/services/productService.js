import apiClient from '../api/apiClient';

export const productService = {
  getProducts: async (categories = null) => {
    const params = {};
    if (categories && categories.length > 0) {
      params.categories = Array.isArray(categories) ? categories.join(',') : categories;
    }
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  getProduct: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  getFeaturedProducts: async (count = 6) => {
    const response = await apiClient.get(`/products/get/featured/${count}`);
    return response.data;
  },

  getProductCount: async () => {
    const response = await apiClient.get('/products/get/count');
    return response.data; // { productCount: number }
  },

  createProduct: async (formData) => {
    const response = await apiClient.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProduct: async (id, data) => {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },

  uploadGalleryImages: async (id, formData) => {
    const response = await apiClient.put(`/products/gallery-images/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default productService;
