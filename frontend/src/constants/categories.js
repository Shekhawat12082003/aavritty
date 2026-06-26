export const CATEGORY_ICON_MAP = {
  'wires-cables': { icon: 'Cable', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50' },
  'switches-sockets': { icon: 'ToggleRight', color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50' },
  'circuit-breakers': { icon: 'ShieldCheck', color: 'from-red-500 to-rose-600', bg: 'bg-red-50' },
  'distribution-boards': { icon: 'LayoutGrid', color: 'from-slate-600 to-slate-800', bg: 'bg-slate-100' },
  'fans-lighting': { icon: 'Lightbulb', color: 'from-yellow-400 to-amber-500', bg: 'bg-yellow-50' },
  industrial: { icon: 'Factory', color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50' },
};

export const ORDER_STATUSES = [
  { value: 'ALL', label: 'All Orders' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const STATUS_COLORS = {
  PENDING: 'bg-slate-100 text-slate-700',
  CONFIRMED: 'bg-indigo-100 text-indigo-700',
  PROCESSING: 'bg-amber-100 text-amber-700',
  SHIPPED: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-purple-100 text-purple-700',
};
