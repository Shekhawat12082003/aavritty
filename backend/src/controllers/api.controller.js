import { ApiResponse } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const notImplemented = (module) =>
  asyncHandler(async (req, res) => {
    res.status(501).json(new ApiResponse(501, null, `${module} module coming in next phase`));
  });

export const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, search } = req.query;
  const prisma = (await import('../config/database.js')).default;
  
  const where = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  res.status(200).json(new ApiResponse(200, {
    users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  }));
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const prisma = (await import('../config/database.js')).default;
  
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      isActive: true,
      isVerified: true,
      createdAt: true,
      addresses: true,
    },
  });

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, 'User not found'));
  }

  res.status(200).json(new ApiResponse(200, user));
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const prisma = (await import('../config/database.js')).default;
  
  const { firstName, lastName, phone, role, isActive } = req.body;

  const user = await prisma.user.update({
    where: { id },
    data: { firstName, lastName, phone, role, isActive },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      isActive: true,
      isVerified: true,
      createdAt: true,
    },
  });

  res.status(200).json(new ApiResponse(200, user, 'User updated successfully'));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const prisma = (await import('../config/database.js')).default;
  
  await prisma.user.delete({ where: { id } });

  res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'));
});

export const getOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, userId } = req.query;
  const prisma = (await import('../config/database.js')).default;
  
  const where = {};
  if (status) where.status = status;
  if (userId) where.userId = userId;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              include: {
                vendor: {
                  select: {
                    id: true,
                    businessName: true,
                  },
                },
              },
            },
          },
        },
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ]);

  res.status(200).json(new ApiResponse(200, {
    orders,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  }));
});

export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const prisma = (await import('../config/database.js')).default;
  
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
      payments: true,
    },
  });

  if (!order) {
    return res.status(404).json(new ApiResponse(404, null, 'Order not found'));
  }

  res.status(200).json(new ApiResponse(200, order));
});

export const createOrder = asyncHandler(async (req, res) => {
  const prisma = (await import('../config/database.js')).default;
  const { userId, items, shippingAddress, billingAddress, notes } = req.body;

  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const taxAmount = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + taxAmount;

  const order = await prisma.order.create({
    data: {
      userId,
      subtotal,
      taxAmount,
      totalAmount,
      shippingAddress,
      billingAddress,
      notes,
      status: 'PENDING',
      items: {
        create: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          gstRate: 18,
          totalPrice: item.unitPrice * item.quantity,
        })),
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  res.status(201).json(new ApiResponse(200, order, 'Order created successfully'));
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const prisma = (await import('../config/database.js')).default;
  
  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  res.status(200).json(new ApiResponse(200, order, 'Order status updated successfully'));
});

export const getPayments = notImplemented('Payments');
export const createPayment = notImplemented('Payments');

export const getBulkQuotes = notImplemented('Bulk Quotes');
export const createBulkQuote = notImplemented('Bulk Quotes');

export const getReviews = notImplemented('Reviews');
export const createReview = notImplemented('Reviews');

export const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;
  const prisma = (await import('../config/database.js')).default;

  const contact = await prisma.contact.create({
    data: {
      name,
      email,
      phone: phone || null,
      message,
      status: 'PENDING',
    },
  });

  res.status(201).json(new ApiResponse(201, contact, 'Contact form submitted successfully'));
});

export const submitSupportTicket = asyncHandler(async (req, res) => {
  const { subject, priority, message } = req.body;
  const prisma = (await import('../config/database.js')).default;
  const userId = req.user?.id || null;

  const ticket = await prisma.supportTicket.create({
    data: {
      userId,
      subject,
      priority: priority || 'MEDIUM',
      message,
      status: 'OPEN',
    },
  });

  res.status(201).json(new ApiResponse(201, ticket, 'Support ticket created successfully'));
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phone } = req.body;
  const prisma = (await import('../config/database.js')).default;

  const user = await prisma.user.update({
    where: { id },
    data: {
      firstName,
      lastName,
      phone,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
    },
  });

  res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;
  const prisma = (await import('../config/database.js')).default;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, 'User not found'));
  }

  // In production, verify current password hash
  // For now, just update the password (you should hash it)
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      password: newPassword, // TODO: Hash this password
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  });

  res.status(200).json(new ApiResponse(200, null, 'Password changed successfully'));
});

export const getVendorDashboard = asyncHandler(async (req, res) => {
  const prisma = (await import('../config/database.js')).default;
  const vendorId = req.user.id;

  const [products, orders, totalRevenue, pendingOrders] = await Promise.all([
    prisma.product.count({ where: { vendorId } }),
    prisma.order.count({
      where: {
        items: {
          some: {
            product: { vendorId },
          },
        },
      },
    }),
    prisma.order.aggregate({
      where: {
        items: {
          some: {
            product: { vendorId },
          },
        },
        status: 'DELIVERED',
      },
      _sum: { totalAmount: true },
    }),
    prisma.order.count({
      where: {
        items: {
          some: {
            product: { vendorId },
          },
        },
        status: 'PENDING',
      },
    }),
  ]);

  res.status(200).json(new ApiResponse(200, {
    products,
    orders,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    pendingOrders,
  }));
});

export const getVendorProducts = asyncHandler(async (req, res) => {
  const prisma = (await import('../config/database.js')).default;
  const vendorId = req.user.id;
  const { page = 1, limit = 20 } = req.query;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { vendorId },
      include: {
        category: true,
        brand: true,
        inventory: true,
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where: { vendorId } }),
  ]);

  res.status(200).json(new ApiResponse(200, {
    products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  }));
});

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const prisma = (await import('../config/database.js')).default;

  const [users, products, orders, vendors, todayRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.vendor.count(),
    prisma.order.aggregate({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
        status: 'DELIVERED',
      },
      _sum: { totalAmount: true },
    }),
  ]);

  res.status(200).json(new ApiResponse(200, {
    users,
    products,
    orders,
    vendors,
    todayRevenue: todayRevenue._sum.totalAmount || 0,
  }));
});

export const getAdminStats = asyncHandler(async (req, res) => {
  const prisma = (await import('../config/database.js')).default;

  const [pendingVendors, recentOrders, lowStockProducts] = await Promise.all([
    prisma.vendor.count({ where: { isVerified: false } }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    }),
    prisma.inventory.findMany({
      where: {
        quantity: {
          lte: prisma.inventory.fields.lowStockAlert,
        },
      },
      include: {
        product: {
          select: {
            name: true,
            sku: true,
          },
        },
      },
      take: 10,
    }),
  ]);

  res.status(200).json(new ApiResponse(200, {
    pendingVendors,
    recentOrders,
    lowStockProducts,
  }));
});

export const getDeliveryDashboard = asyncHandler(async (req, res) => {
  const prisma = (await import('../config/database.js')).default;
  const deliveryPartnerId = req.user.id;

  const [activeOrders, completedOrders, totalEarnings] = await Promise.all([
    prisma.order.count({
      where: {
        status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED'] },
      },
    }),
    prisma.order.count({
      where: {
        status: 'DELIVERED',
      },
    }),
    prisma.order.aggregate({
      where: {
        status: 'DELIVERED',
      },
      _sum: { totalAmount: true },
    }),
  ]);

  res.status(200).json(new ApiResponse(200, {
    activeOrders,
    completedOrders,
    totalEarnings: (totalEarnings._sum.totalAmount || 0) * 0.05, // 5% commission
  }));
});

export const getDeliveryOrders = asyncHandler(async (req, res) => {
  const prisma = (await import('../config/database.js')).default;
  const { page = 1, limit = 20, status } = req.query;

  const where = {};
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ]);

  res.status(200).json(new ApiResponse(200, {
    orders,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  }));
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const prisma = (await import('../config/database.js')).default;
  const userId = req.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
    return getAdminDashboard(req, res);
  } else if (user.role === 'VENDOR') {
    return getVendorDashboard(req, res);
  } else if (user.role === 'DELIVERY_PARTNER') {
    return getDeliveryDashboard(req, res);
  }

  res.status(200).json(new ApiResponse(200, { message: 'Dashboard stats' }));
});

export const search = asyncHandler(async (req, res) => {
  const { q } = req.query;
  res.status(200).json(new ApiResponse(200, { query: q, results: [] }, 'Search scaffold ready'));
});

export const getNotifications = notImplemented('Notifications');
export const markNotificationRead = notImplemented('Notifications');
