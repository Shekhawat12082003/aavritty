import api from './api';
import axios from 'axios';
import { API_BASE_URL } from '@/constants';

export { api };

export const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => {
    console.log('Admin API Response:', response.data);
    return response.data;
  },
  async (error) => {
    console.log('Admin API Error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  },
);

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getFeatured: () => api.get('/products/featured'),
  getCategories: () => api.get('/products/categories'),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
};

export const adminAuthService = {
  login: (data) => adminApi.post('/admin/login', data),
  logout: () => adminApi.post('/auth/logout'),
  getProfile: () => adminApi.get('/auth/me'),
};

export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  updateProfile: (id, data) => api.patch(`/users/${id}/profile`, data),
  changePassword: (id, data) => api.patch(`/users/${id}/password`, data),
};

export const orderService = {
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getAdminDashboard: () => adminApi.get('/admin/dashboard'),
  getAdminStats: () => adminApi.get('/admin/stats'),
  getAdminProducts: (params) => adminApi.get('/admin/products', { params }),
  getAdminOrders: (params) => adminApi.get('/admin/orders', { params }),
  getAdminOrderById: (id) => adminApi.get(`/admin/orders/${id}`),
  updateAdminOrderStatus: (id, status) => adminApi.patch(`/admin/orders/${id}/status`, { status }),
  getVendorDashboard: () => api.get('/vendor/dashboard'),
  getVendorProducts: (params) => api.get('/vendor/products', { params }),
  getDeliveryDashboard: () => api.get('/delivery/dashboard'),
  getDeliveryOrders: (params) => api.get('/delivery/orders', { params }),
};

export const healthService = {
  check: () => api.get('/health'),
};

export const contactService = {
  submit: (data) => api.post('/contact/submit', data),
};

export const supportService = {
  submitTicket: (data) => api.post('/support/tickets', data),
};
