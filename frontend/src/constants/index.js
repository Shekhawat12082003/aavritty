export const APP_NAME = import.meta.env.VITE_APP_NAME || 'AAVRITTY Business Solutions';
// Use Vite proxy in dev — avoids CORS when port changes (5173, 5174, etc.)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  VENDOR: 'VENDOR',
  CUSTOMER: 'CUSTOMER',
  DELIVERY_PARTNER: 'DELIVERY_PARTNER',
};

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Categories', path: '/categories' },
  { label: 'Wholesale', path: '/wholesale' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export const STATS = [
  { label: 'Products Listed', value: '50,000+' },
  { label: 'Verified Vendors', value: '2,500+' },
  { label: 'Cities Served', value: '500+' },
  { label: 'Happy Customers', value: '1,00,000+' },
];
