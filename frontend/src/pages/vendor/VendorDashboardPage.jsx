import { Package, ShoppingBag, TrendingUp, DollarSign } from 'lucide-react';
import SEO from '@/components/common/SEO';
import { formatPrice } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { dashboardService, orderService } from '@/services';
import { PageLoader } from '@/components/common/Loader';

const statsConfig = [
  { label: 'Total Products', key: 'products', icon: Package },
  { label: 'Total Orders', key: 'orders', icon: ShoppingBag },
  { label: 'Total Revenue', key: 'totalRevenue', icon: DollarSign, format: true },
  { label: 'Pending Orders', key: 'pendingOrders', icon: TrendingUp },
];

export default function VendorDashboardPage() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['vendor-dashboard'],
    queryFn: dashboardService.getVendorDashboard,
  });

  const { data: ordersData } = useQuery({
    queryKey: ['vendor-orders'],
    queryFn: () => orderService.getAll({ limit: 5 }),
  });

  const recentOrders = ordersData?.data?.orders || [];

  if (isLoading) return <PageLoader />;

  const stats = statsConfig.map((config) => ({
    ...config,
    value: config.format 
      ? formatPrice(dashboard?.[config.key] || 0)
      : (dashboard?.[config.key]?.toLocaleString() || '0'),
    change: config.key === 'pendingOrders' 
      ? 'Awaiting action' 
      : 'This month',
  }));

  return (
    <>
      <SEO title="Vendor Dashboard" />
      <div>
        <h2 className="font-display text-xl font-bold text-primary-950">Vendor Dashboard</h2>
        <p className="text-sm text-slate-500">Overview of your store performance</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{s.label}</p>
                <div className="rounded-xl bg-primary-50 p-2 text-primary-600">
                  <s.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-800">{s.value}</p>
              <p className="mt-1 text-xs text-green-600">{s.change}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 card p-6">
          <h3 className="font-semibold">Recent Orders</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-400">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-50">
                    <td className="py-3 pr-4 font-medium">{order.orderNumber || `ORD-${order.id.slice(0, 8)}`}</td>
                    <td className="py-3 pr-4">{order.user?.firstName} {order.user?.lastName}</td>
                    <td className="py-3 pr-4">{formatPrice(order.totalAmount)}</td>
                    <td className="py-3">
                      <span className={`badge ${
                        order.status === 'DELIVERED' ? 'bg-green-50 text-green-700' :
                        order.status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">No orders yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
