export const APP_NAME = import.meta.env.VITE_APP_NAME || 'AAVRITTY Business Solutions';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

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
  { label: 'Wholesale', path: '/wholesale' },
  { label: 'Categories', path: '/categories' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export const STATS = [
  { label: 'Products Listed', value: '50,000+' },
  { label: 'Verified Vendors', value: '2,500+' },
  { label: 'Cities Served', value: '500+' },
  { label: 'Happy Customers', value: '1,00,000+' },
];
