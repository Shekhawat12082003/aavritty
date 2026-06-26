import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Razorpay Configuration
console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID ? 'Set' : 'Not set');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET'
});

// Middleware
app.use(cors());
app.use(express.json());

// Data storage file path
const DATA_FILE = join(__dirname, 'data.json');

// Initialize data storage
let data = {
  products: [],
  categories: [],
  orders: [],
  users: [],
  admin: {
    email: 'admin@aavritty.com',
    password: '$2a$10$YourHashedPasswordHere', // Will be set on first run
    token: null
  }
};

// Load data from file
function loadData() {
  try {
    const fileData = readFileSync(DATA_FILE, 'utf8');
    data = JSON.parse(fileData);
  } catch (err) {
    // Initialize with sample data if file doesn't exist
    initializeSampleData();
    saveData();
  }
}

// Save data to file
function saveData() {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Initialize sample data
function initializeSampleData() {
  data.categories = [
    { id: '1', name: 'Wires & Cables', slug: 'wires-cables', image: '/categories/wires-cables.jpg', sortOrder: 1 },
    { id: '2', name: 'Switches & Sockets', slug: 'switches-sockets', image: '/categories/switches-sockets.jpg', sortOrder: 2 },
    { id: '3', name: 'Circuit Breakers', slug: 'circuit-breakers', image: '/categories/circuit-breakers.jpg', sortOrder: 3 },
    { id: '4', name: 'Distribution Boards', slug: 'distribution-boards', image: '/categories/distribution-boards.jpg', sortOrder: 4 },
    { id: '5', name: 'Fans & Lighting', slug: 'fans-lighting', image: '/categories/fans-lighting.jpg', sortOrder: 5 },
    { id: '6', name: 'Industrial Equipment', slug: 'industrial', image: '/categories/industrial.jpg', sortOrder: 6 }
  ];

  data.products = [
    { id: '1', name: 'Havells Wires 2.5mm', slug: 'havells-wires-25mm', price: 1100, categoryId: '1', isActive: true, isFeatured: true, description: 'High quality wires', stock: 50 },
    { id: '2', name: 'Polycab Switch 2A', slug: 'polycab-switch-2a', price: 150, categoryId: '2', isActive: true, isFeatured: true, description: 'Modular switch', stock: 100 },
    { id: '3', name: 'Schneider MCB 16A', slug: 'schneider-mcb-16a', price: 450, categoryId: '3', isActive: true, isFeatured: true, description: 'Circuit breaker', stock: 75 },
    { id: '4', name: 'Legrand DB Box', slug: 'legrand-db-box', price: 850, categoryId: '4', isActive: true, isFeatured: false, description: 'Distribution board', stock: 30 },
    { id: '5', name: 'Crompton Fan', slug: 'crompton-fan', price: 2500, categoryId: '5', isActive: true, isFeatured: true, description: 'Ceiling fan', stock: 25 }
  ];

  // Set default admin password (admin123 hashed with bcrypt)
  data.admin.password = '$2a$10$YourHashedPasswordHere';
}

// Load data on startup
loadData();

// Helper: Generate ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Helper: Generate order number
const generateOrderNumber = () => {
  const orderCount = data.orders.length + 1;
  return `ORD-${String(orderCount).padStart(6, '0')}`;
};

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Categories endpoints
app.get('/api/v1/products/categories', (req, res) => {
  res.json({ success: true, data: data.categories });
});

// Products endpoints
app.get('/api/v1/products', (req, res) => {
  const { admin, category, search, featured } = req.query;
  let products = [...data.products];

  // Filter by active status (only for non-admin)
  if (admin !== 'true') {
    products = products.filter(p => p.isActive);
  }

  // Filter by category
  if (category) {
    products = products.filter(p => p.categoryId === category);
  }

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description?.toLowerCase().includes(searchLower)
    );
  }

  // Filter by featured
  if (featured === 'true') {
    products = products.filter(p => p.isFeatured);
  }

  res.json({ success: true, data: { products, pagination: { total: products.length } } });
});

app.get('/api/v1/products/featured', (req, res) => {
  const featured = data.products.filter(p => p.isActive && p.isFeatured);
  res.json({ success: true, data: featured });
});

app.get('/api/v1/products/:slug', (req, res) => {
  const product = data.products.find(p => p.slug === req.params.slug);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

// Admin products endpoints
app.get('/api/v1/admin/products', (req, res) => {
  res.json({ success: true, data: { products: data.products, pagination: { total: data.products.length } } });
});

app.post('/api/v1/admin/products', (req, res) => {
  const { name, slug, price, categoryId, isActive, isFeatured, description, stock, image } = req.body;
  
  const newProduct = {
    id: generateId(),
    name,
    slug: slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    price: parseFloat(price),
    categoryId,
    isActive: isActive !== undefined ? isActive : true,
    isFeatured: isFeatured || false,
    description: description || '',
    stock: parseInt(stock) || 0,
    image: image || ''
  };
  
  data.products.push(newProduct);
  saveData();
  res.status(201).json({ success: true, data: newProduct });
});

app.put('/api/v1/admin/products/:id', (req, res) => {
  const index = data.products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  
  const { name, slug, price, categoryId, isActive, isFeatured, description, stock, image } = req.body;
  
  data.products[index] = {
    ...data.products[index],
    name: name || data.products[index].name,
    slug: slug || data.products[index].slug,
    price: price !== undefined ? parseFloat(price) : data.products[index].price,
    categoryId: categoryId || data.products[index].categoryId,
    isActive: isActive !== undefined ? isActive : data.products[index].isActive,
    isFeatured: isFeatured !== undefined ? isFeatured : data.products[index].isFeatured,
    description: description !== undefined ? description : data.products[index].description,
    stock: stock !== undefined ? parseInt(stock) : data.products[index].stock,
    image: image !== undefined ? image : data.products[index].image
  };
  
  saveData();
  res.json({ success: true, data: data.products[index] });
});

app.patch('/api/v1/admin/products/:id/toggle-active', (req, res) => {
  const product = data.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  product.isActive = !product.isActive;
  saveData();
  res.json({ success: true, data: product });
});

app.delete('/api/v1/admin/products/:id', (req, res) => {
  const index = data.products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  data.products.splice(index, 1);
  saveData();
  res.json({ success: true, message: 'Product deleted' });
});

// Orders endpoints
app.get('/api/v1/orders', (req, res) => {
  res.json({ success: true, data: { orders: data.orders, pagination: { total: data.orders.length } } });
});

app.post('/api/v1/orders', (req, res) => {
  const { items, shippingAddress, billingAddress, notes, paymentMethod } = req.body;
  
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const taxAmount = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + taxAmount;

  const order = {
    id: generateId(),
    orderNumber: generateOrderNumber(),
    userId: null, // Guest orders
    status: 'PENDING',
    subtotal,
    taxAmount,
    totalAmount,
    paymentMethod: paymentMethod || 'COD',
    shippingAddress,
    billingAddress,
    notes,
    items: items.map(item => ({
      ...item,
      id: generateId(),
      totalPrice: item.unitPrice * item.quantity
    })),
    createdAt: new Date().toISOString()
  };

  data.orders.push(order);
  saveData();
  res.status(201).json({ success: true, data: order });
});

app.get('/api/v1/orders/:id', (req, res) => {
  const order = data.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, data: order });
});

app.patch('/api/v1/orders/:id/status', (req, res) => {
  const order = data.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  order.status = req.body.status;
  saveData();
  res.json({ success: true, data: order });
});

// Admin orders endpoints
app.get('/api/v1/admin/orders', (req, res) => {
  res.json({ success: true, data: { orders: data.orders, pagination: { total: data.orders.length } } });
});

app.get('/api/v1/admin/orders/:id', (req, res) => {
  const order = data.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, data: order });
});

app.patch('/api/v1/admin/orders/:id/status', (req, res) => {
  const order = data.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  order.status = req.body.status;
  saveData();
  res.json({ success: true, data: order });
});

// Admin dashboard endpoints
app.get('/api/v1/admin/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      users: data.users.length,
      products: data.products.length,
      orders: data.orders.length,
      todayRevenue: data.orders.reduce((sum, o) => sum + o.totalAmount, 0)
    }
  });
});

app.get('/api/v1/admin/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      recentOrders: data.orders.slice(-5).reverse()
    }
  });
});

// Admin authentication
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token)	return res.status(401).json({ success: false, message: 'No token provided' });
  
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Admin login endpoint (no auth required)
app.post('/api/v1/admin/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (email !== data.admin.email) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // For simplicity, accept admin123 as password
  if (password === 'admin123') {
    const token = jwt.sign({ email, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '7d' });
    data.admin.token = token;
    saveData();
    return res.json({
      success: true,
      data: {
        token,
        admin: { email, firstName: 'Admin', lastName: 'User', role: 'ADMIN' }
      }
    });
  }

  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Apply auth middleware to protected admin routes
app.get('/api/v1/admin/dashboard', verifyAdminToken);
app.get('/api/v1/admin/stats', verifyAdminToken);
app.get('/api/v1/admin/products', verifyAdminToken);
app.post('/api/v1/admin/products', verifyAdminToken);
app.put('/api/v1/admin/products/:id', verifyAdminToken);
app.patch('/api/v1/admin/products/:id/toggle-active', verifyAdminToken);
app.delete('/api/v1/admin/products/:id', verifyAdminToken);
app.get('/api/v1/admin/orders', verifyAdminToken);
app.get('/api/v1/admin/orders/:id', verifyAdminToken);
app.patch('/api/v1/admin/orders/:id/status', verifyAdminToken);

// Razorpay Payment Endpoints
app.get('/api/v1/payment/config', (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  res.json({
    success: true,
    key_id: keyId,
    configured: !!keyId && !keyId.includes('YOUR_KEY_ID')
  });
});

app.post('/api/v1/payment/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount is required and must be greater than 0' });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    if (!keyId || keyId.includes('YOUR_KEY_ID')) {
      return res.status(500).json({ success: false, message: 'Razorpay not configured. Please use COD.' });
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: 'receipt_' + Date.now()
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order_id: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error('❌ RAZORPAY ERROR:', err);
    res.status(500).json({ success: false, message: 'Payment order failed', details: err.message });
  }
});

app.post('/api/v1/payment/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification data' });
    }
    
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', razorpay.key_secret)
      .update(body)
      .digest('hex');
    
    if (expectedSignature === razorpay_signature) {
      return res.json({ success: true, message: 'Payment verified ✅' });
    }
    
    res.status(400).json({ success: false, message: 'Invalid signature ❌' });
  } catch (err) {
    console.error('❌ VERIFY ERROR:', err);
    res.status(500).json({ success: false, message: 'Verification failed', details: err.message });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/v1/health`);
});
