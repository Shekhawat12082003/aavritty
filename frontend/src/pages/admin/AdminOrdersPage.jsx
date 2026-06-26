import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Eye,
  ChevronDown,
  Download,
  Package,
} from 'lucide-react';
import SEO from '@/components/common/SEO';
import { formatPrice } from '@/store';
import { ORDER_STATUSES, STATUS_COLORS } from '@/constants/categories';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '@/services';
import { PageLoader } from '@/components/common/Loader';

const ADMIN_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const queryClient = useQueryClient();

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['admin-orders', { status: statusFilter === 'ALL' ? undefined : statusFilter }],
    queryFn: () => dashboardService.getAdminOrders({
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      limit: 100
    }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => dashboardService.updateAdminOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-orders']);
    },
  });

  const handleStatusUpdate = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  const orders = Array.isArray(ordersData?.data?.orders) ? ordersData.data.orders : Array.isArray(ordersData?.orders) ? ordersData.orders : Array.isArray(ordersData) ? ordersData : [];

  const filtered = useMemo(() => {
    if (!search) return orders;
    const q = search.toLowerCase();
    return orders.filter((o) => {
      return (
        o.orderNumber?.toLowerCase().includes(q) ||
        o.user?.firstName?.toLowerCase().includes(q) ||
        o.user?.lastName?.toLowerCase().includes(q) ||
        o.user?.email?.toLowerCase().includes(q)
      );
    });
  }, [orders, search]);

  const revenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((s, o) => s + (o.totalAmount || 0), 0);

  if (isLoading) return <PageLoader />;

  return (
    <>
      <SEO title="Manage Orders" />
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-primary-950">Order Management</h2>
            <p className="text-sm text-slate-500">View, update status, and manage all platform orders</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary !py-2 !text-xs">
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {[
            ['Total Orders', orders.length, 'text-primary-700'],
            ['Revenue', formatPrice(revenue), 'text-green-600'],
            ['Pending', orders.filter((o) => o.status === 'PENDING').length, 'text-amber-600'],
            ['Shipped', orders.filter((o) => o.status === 'SHIPPED').length, 'text-blue-600'],
          ].map(([label, val, color]) => (
            <div key={label} className="card p-4">
              <p className="text-xs text-slate-500">{label}</p>
              <p className={`mt-1 text-xl font-bold ${color}`}>{val}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex gap-2 overflow-x-auto">
            {ORDER_STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => setStatusFilter(s.value)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                  statusFilter === s.value ? 'bg-primary-600 text-white' : 'bg-surface-100 text-slate-600'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field !py-2 !pl-10 !text-sm"
            />
          </div>
        </div>

        <div className="mt-6 card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-surface-50 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-slate-50 hover:bg-surface-50/50">
                    <td className="px-4 py-3 font-medium text-primary-700">{order.orderNumber || `ORD-${order.id.slice(0, 8)}`}</td>
                    <td className="px-4 py-3">
                      <p>{order.user?.firstName && order.user?.lastName ? `${order.user.firstName} ${order.user.lastName}` : 'Guest User'}</p>
                      <p className="text-xs text-slate-400">{order.user?.email || 'N/A'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${order.paymentMethod === 'COD' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                        {order.paymentMethod || 'COD'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{order.items?.length || 0}</td>
                    <td className="px-4 py-3 font-semibold">{formatPrice(order.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className={`cursor-pointer appearance-none rounded-full border-0 py-1 pl-3 pr-7 text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-700'}`}
                        >
                          {ADMIN_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setSelected(order)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-primary-50 hover:text-primary-600"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelected(null)}>
            <div className="card max-h-[80vh] w-full max-w-lg overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-semibold">{selected.orderNumber}</h3>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="font-medium text-slate-700">Customer Details</p>
                  <p className="text-slate-600">
                    {selected.user?.firstName && selected.user?.lastName 
                      ? `${selected.user.firstName} ${selected.user.lastName}` 
                      : 'Guest User'}
                  </p>
                  {selected.user?.email && <p className="text-slate-600">{selected.user.email}</p>}
                  {selected.user?.phone && <p className="text-slate-600">{selected.user.phone}</p>}
                </div>
                <div>
                  <p className="font-medium text-slate-700">Payment Method</p>
                  <p className="text-slate-600">{selected.paymentMethod || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Shipping Address</p>
                  <p className="text-slate-600">
                    {selected.shippingAddress?.line1}
                    {selected.shippingAddress?.line2 && `, ${selected.shippingAddress.line2}`}
                  </p>
                  <p className="text-slate-600">
                    {selected.shippingAddress?.city}, {selected.shippingAddress?.state} - {selected.shippingAddress?.pincode}
                  </p>
                  <p className="text-slate-600">{selected.shippingAddress?.country}</p>
                </div>
                {selected.notes && (
                  <div>
                    <p className="font-medium text-slate-700">Notes</p>
                    <p className="text-slate-600">{selected.notes}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-2">
                <p className="font-medium text-slate-700">Items</p>
                {selected.items?.map((item, index) => (
                  <div key={item.id || index} className="flex justify-between text-sm">
                    <span>Item #{index + 1} × {item.quantity}</span>
                    <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(selected.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span>{formatPrice(selected.taxAmount)}</span>
                </div>
                <div className="flex justify-between border-t pt-1 font-bold">
                  <span>Total</span>
                  <span>{formatPrice(selected.totalAmount)}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setSelected(null)} className="btn-secondary flex-1 !py-2 !text-xs">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
