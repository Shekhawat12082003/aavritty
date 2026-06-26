import api from './api';

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getFeatured: () => api.get('/products/featured'),
  getCategories: () => api.get('/products/categories'),
  getBySlug: (slug) => api.get(`/products/${slug}`),
};

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
};

export const healthService = {
  check: () => api.get('/health'),
};
