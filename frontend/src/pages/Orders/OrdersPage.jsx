import { Link } from 'react-router-dom';
import {
  Search,
  Eye,
  Package,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import SEO from '@/components/common/SEO';
import Button from '@/components/common/Button';
import { formatPrice } from '@/store';
import { ORDER_STATUSES, STATUS_COLORS } from '@/constants/categories';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services';
import { PageLoader } from '@/components/common/Loader';

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getAll({ limit: 100 }),
  });

  const orders = Array.isArray(ordersData?.orders) ? ordersData.orders : Array.isArray(ordersData) ? ordersData : [];

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        o.orderNumber?.toLowerCase().includes(q) ||
        o.user?.firstName?.toLowerCase().includes(q) ||
        o.user?.lastName?.toLowerCase().includes(q) ||
        o.items?.some((i) => i.product?.name?.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, search]);

  const stats = useMemo(() => ({
    total: orders.length,
    active: orders.filter((o) => !['DELIVERED', 'CANCELLED'].includes(o.status)).length,
    delivered: orders.filter((o) => o.status === 'DELIVERED').length,
  }), [orders]);

  if (isLoading) return <PageLoader />;

  return (
    <>
      <SEO title="My Orders" description="View and manage all your orders" />

      <div className="border-b border-slate-200 bg-white">
        <div className="container-app py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="section-title">My Orders</h1>
              <p className="mt-1 text-slate-500">Track, view details, and manage all your orders in one place</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 sm:max-w-lg">
            {[
              ['Total Orders', stats.total, 'text-primary-700'],
              ['Active', stats.active, 'text-amber-600'],
              ['Delivered', stats.delivered, 'text-green-600'],
            ].map(([label, val, color]) => (
              <div key={label} className="rounded-xl border border-slate-100 bg-surface-50 p-4 text-center">
                <p className={`text-2xl font-bold ${color}`}>{val}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-app py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {ORDER_STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => setStatusFilter(s.value)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                  statusFilter === s.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-surface-50'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search orders, products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field !pl-10"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-16 text-center">
            <Package className="mx-auto h-14 w-14 text-slate-300" />
            <p className="mt-4 text-lg font-medium text-slate-600">No orders found</p>
            <Link to="/shop" className="btn-primary mt-4 inline-flex">Start Shopping</Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filtered.map((order) => (
              <div key={order.id} className="card overflow-hidden">
                <div className="flex flex-col gap-4 border-b border-slate-100 bg-surface-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <p className="font-semibold text-slate-800">{order.orderNumber || `ORD-${order.id.slice(0, 8)}`}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span className={`badge ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-primary-700">{formatPrice(order.totalAmount)}</p>
                    <Link to={`/orders/${order.id}`}>
                      <Button variant="secondary" className="!py-2 !text-xs">
                        <Eye className="h-4 w-4" /> View Details
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="flex flex-wrap gap-3">
                    {order.items?.slice(0, 4).map((item) => (
                      <div key={item.id} className="flex items-center gap-2 rounded-xl bg-surface-50 px-3 py-2">
                        <div>
                          <p className="max-w-[140px] truncate text-xs font-medium">{item.product?.name || 'Product'}</p>
                          <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {(order.items?.length || 0) > 4 && (
                      <span className="flex items-center text-xs text-slate-400">+{order.items.length - 4} more</span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                    <span>{order.items?.length || 0} item(s)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
