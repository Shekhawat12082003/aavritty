import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const buildTimeline = (status) => {
  const steps = [
    { status: 'PENDING', label: 'Order Placed', done: true },
    { status: 'CONFIRMED', label: 'Confirmed', done: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(status) },
    { status: 'PROCESSING', label: 'Processing', done: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(status) },
    { status: 'SHIPPED', label: 'Shipped', done: ['SHIPPED', 'DELIVERED'].includes(status) },
    { status: 'DELIVERED', label: 'Delivered', done: status === 'DELIVERED' },
  ];
  if (status === 'CANCELLED') {
    return [
      { status: 'PENDING', label: 'Order Placed', done: true },
      { status: 'CANCELLED', label: 'Cancelled', done: true },
    ];
  }
  return steps;
};

export const SEED_ORDERS = [
  {
    id: 'ORD-2026-1045',
    orderNumber: 'ORD-2026-1045',
    date: '2026-06-20T10:30:00',
    status: 'DELIVERED',
    customer: { name: 'Sharma Electricals', email: 'sharma@electricals.com', phone: '+91 98765 11111' },
    shippingAddress: { line1: '12 Industrial Area', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    items: [
      { id: 'prod-001', name: 'Havells 16A Modular Switch', sku: 'HV-MS-16A', quantity: 50, unitPrice: 72, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=100&h=100&fit=crop' },
      { id: 'prod-003', name: 'Schneider 32A MCB', sku: 'SN-MCB-32A', quantity: 20, unitPrice: 210, image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=100&h=100&fit=crop' },
    ],
    subtotal: 7800,
    taxAmount: 1404,
    shippingAmount: 0,
    totalAmount: 9204,
    paymentMethod: 'UPI',
    vendor: 'PowerTech Solutions',
    trackingId: 'TRK892345671',
  },
  {
    id: 'ORD-2026-1044',
    orderNumber: 'ORD-2026-1044',
    date: '2026-06-22T14:15:00',
    status: 'SHIPPED',
    customer: { name: 'Patel Traders', email: 'patel@traders.in', phone: '+91 98765 22222' },
    shippingAddress: { line1: '45 Market Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001' },
    items: [
      { id: 'prod-002', name: 'Polycab 2.5 sq mm FR Wire', sku: 'PC-FR-2.5-90', quantity: 10, unitPrice: 2650, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop' },
    ],
    subtotal: 26500,
    taxAmount: 4770,
    shippingAmount: 0,
    totalAmount: 31270,
    paymentMethod: 'Net Banking',
    vendor: 'WireKing India',
    trackingId: 'TRK892345672',
  },
  {
    id: 'ORD-2026-1043',
    orderNumber: 'ORD-2026-1043',
    date: '2026-06-25T09:00:00',
    status: 'PROCESSING',
    customer: { name: 'Singh Industries', email: 'singh@industries.co', phone: '+91 98765 33333' },
    shippingAddress: { line1: 'Plot 7, MIDC', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
    items: [
      { id: 'prod-006', name: 'Legrand 12 Module DB Box', sku: 'LG-DB-12M', quantity: 15, unitPrice: 780, image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=100&h=100&fit=crop' },
      { id: 'prod-007', name: 'Philips 9W LED Bulb Pack', sku: 'PH-LED-9W-10', quantity: 30, unitPrice: 580, image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=100&h=100&fit=crop' },
    ],
    subtotal: 29100,
    taxAmount: 5238,
    shippingAmount: 0,
    totalAmount: 34338,
    paymentMethod: 'Credit Terms',
    vendor: 'ElectroMart India',
    trackingId: null,
  },
  {
    id: 'ORD-2026-1042',
    orderNumber: 'ORD-2026-1042',
    date: '2026-06-26T08:45:00',
    status: 'CONFIRMED',
    customer: { name: 'Kumar Contractors', email: 'kumar@contractors.com', phone: '+91 98765 44444' },
    shippingAddress: { line1: '88 Builder Lane', city: 'Delhi', state: 'Delhi', pincode: '110001' },
    items: [
      { id: 'prod-004', name: 'Crompton 1200mm Ceiling Fan', sku: 'CR-CF-1200', quantity: 5, unitPrice: 1650, image: 'https://images.unsplash.com/photo-1585771724684-38269db663fc?w=100&h=100&fit=crop' },
    ],
    subtotal: 8250,
    taxAmount: 1485,
    shippingAmount: 200,
    totalAmount: 9935,
    paymentMethod: 'COD',
    vendor: 'FanWorld Distributors',
    trackingId: null,
  },
  {
    id: 'ORD-2026-1041',
    orderNumber: 'ORD-2026-1041',
    date: '2026-06-18T16:20:00',
    status: 'CANCELLED',
    customer: { name: 'Demo User', email: 'demo@aavritty.com', phone: '+91 98765 55555' },
    shippingAddress: { line1: 'Test Address', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
    items: [
      { id: 'prod-005', name: 'Anchor Roma 6A Socket', sku: 'AN-SK-6A', quantity: 100, unitPrice: 52, image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8f0?w=100&h=100&fit=crop' },
    ],
    subtotal: 5200,
    taxAmount: 936,
    shippingAmount: 0,
    totalAmount: 6136,
    paymentMethod: 'UPI',
    vendor: 'Anchor Direct',
    trackingId: null,
  },
];

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: SEED_ORDERS,
      createOrder: ({ items, shippingAddress, customer, paymentMethod = 'UPI' }) => {
        const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
        const taxAmount = Math.round(subtotal * 0.18);
        const totalAmount = subtotal + taxAmount;
        const id = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

        const order = {
          id,
          orderNumber: id,
          date: new Date().toISOString(),
          status: 'PENDING',
          customer: customer || { name: 'Guest', email: 'guest@aavritty.com', phone: '' },
          shippingAddress,
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            sku: i.sku,
            quantity: i.quantity,
            unitPrice: i.price || i.unitPrice,
            image: i.image,
          })),
          subtotal,
          taxAmount,
          shippingAmount: subtotal >= 10000 ? 0 : 200,
          totalAmount: totalAmount + (subtotal >= 10000 ? 0 : 200),
          paymentMethod,
          vendor: 'AAVRITTY Verified Vendor',
          trackingId: null,
        };

        set({ orders: [order, ...get().orders] });
        return order;
      },
      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  trackingId: status === 'SHIPPED' && !o.trackingId ? `TRK${Date.now().toString().slice(-9)}` : o.trackingId,
                }
              : o,
          ),
        });
      },
      cancelOrder: (orderId) => get().updateOrderStatus(orderId, 'CANCELLED'),
      getOrderById: (orderId) => get().orders.find((o) => o.id === orderId || o.orderNumber === orderId),
      getTimeline: (order) => buildTimeline(order?.status),
    }),
    { name: 'aavritty-orders', onRehydrateStorage: () => (state) => {
      if (state && (!state.orders || state.orders.length === 0)) {
        state.orders = SEED_ORDERS;
      }
    } },
  ),
);
