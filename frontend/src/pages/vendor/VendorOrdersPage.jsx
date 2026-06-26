import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Search } from 'lucide-react';
import SEO from '@/components/common/SEO';
import { formatPrice } from '@/store';
import { STATUS_COLORS } from '@/constants/categories';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services';
import { PageLoader } from '@/components/common/Loader';

export default function VendorOrdersPage() {
  const [search, setSearch] = useState('');

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['vendor-orders'],
    queryFn: () => orderService.getAll({ limit: 100 }),
  });

  const orders = ordersData?.data?.orders || [];

  const vendorOrders = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter(
      (o) =>
        (!q ||
          (o.orderNumber || `ORD-${o.id.slice(0, 8)}`).toLowerCase().includes(q) ||
          (o.user?.firstName || '').toLowerCase().includes(q) ||
          (o.user?.lastName || '').toLowerCase().includes(q)) &&
        o.status !== 'CANCELLED',
    );
  }, [orders, search]);

  if (isLoading) return <PageLoader />;

  return (
    <>
      <SEO title="Vendor Orders" />
      <div>
        <h2 className="font-display text-xl font-bold text-primary-950">Incoming Orders</h2>
        <p className="text-sm text-slate-500">Manage orders assigned to your store</p>

        <div className="relative mt-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field !py-2 !pl-10 !text-sm"
          />
        </div>

        <div className="mt-6 space-y-3">
          {vendorOrders.map((order) => (
            <div key={order.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">{order.orderNumber || `ORD-${order.id.slice(0, 8)}`}</p>
                <p className="text-sm text-slate-500">{order.user?.firstName} {order.user?.lastName} · {order.items?.length || 0} items</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`badge ${STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-700'}`}>{order.status}</span>
                <span className="font-bold text-primary-700">{formatPrice(order.totalAmount)}</span>
                <Link to={`/orders/${order.id}`} className="rounded-lg p-2 hover:bg-surface-100">
                  <Eye className="h-4 w-4 text-slate-500" />
                </Link>
              </div>
            </div>
          ))}
          {vendorOrders.length === 0 && (
            <div className="card p-8 text-center text-slate-500">No orders found</div>
          )}
        </div>
      </div>
    </>
  );
}
