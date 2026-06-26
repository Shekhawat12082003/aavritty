import { ApiResponse } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const notImplemented = (module) =>
  asyncHandler(async (req, res) => {
    res.status(501).json(new ApiResponse(501, null, `${module} module coming in next phase`));
  });

export const getUsers = notImplemented('Users');
export const getUserById = notImplemented('Users');
export const updateUser = notImplemented('Users');
export const deleteUser = notImplemented('Users');

export const getOrders = notImplemented('Orders');
export const getOrderById = notImplemented('Orders');
export const createOrder = notImplemented('Orders');
export const updateOrderStatus = notImplemented('Orders');

export const getPayments = notImplemented('Payments');
export const createPayment = notImplemented('Payments');

export const getBulkQuotes = notImplemented('Bulk Quotes');
export const createBulkQuote = notImplemented('Bulk Quotes');

export const getReviews = notImplemented('Reviews');
export const createReview = notImplemented('Reviews');

export const getVendorDashboard = notImplemented('Vendor Dashboard');
export const getVendorProducts = notImplemented('Vendor Products');

export const getAdminDashboard = notImplemented('Admin Dashboard');
export const getAdminStats = notImplemented('Admin Stats');

export const getDeliveryDashboard = notImplemented('Delivery Dashboard');
export const getDeliveryOrders = notImplemented('Delivery Orders');

export const getDashboardStats = notImplemented('Dashboard');

export const search = asyncHandler(async (req, res) => {
  const { q } = req.query;
  res.status(200).json(new ApiResponse(200, { query: q, results: [] }, 'Search scaffold ready'));
});

export const getNotifications = notImplemented('Notifications');
export const markNotificationRead = notImplemented('Notifications');
