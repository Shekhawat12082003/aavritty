import { Users, Package, ShoppingBag, DollarSign } from 'lucide-react';
import SEO from '@/components/common/SEO';
import { formatPrice } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services';
import { PageLoader } from '@/components/common/Loader';

const statsConfig = [
  { label: 'Total Users', key: 'users', icon: Users },
  { label: 'Products', key: 'products', icon: Package },
  { label: 'Total Orders', key: 'orders', icon: ShoppingBag },
];

export default function AdminDashboardPage() {
  console.log('AdminDashboardPage rendering');

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: dashboardService.getAdminDashboard,
    retry: false,
  });

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: dashboardService.getAdminStats,
    retry: false,
  });

  console.log('Dashboard data:', dashboard);
  console.log('Stats data:', stats);

  // Use fallback data if API fails
  const dashboardData = dashboard?.data || { users: 0, products: 0, orders: 0, todayRevenue: 0 };
  const statsData = stats?.data || { recentOrders: [] };

  const statsWithRevenue = [
    ...statsConfig.map((config) => ({
      ...config,
      value: dashboardData[config.key]?.toLocaleString() || '0',
    })),
    {
      label: 'Today\'s Revenue',
      key: 'todayRevenue',
      icon: DollarSign,
      value: formatPrice(dashboardData.todayRevenue || 0),
    },
  ];

  return (
    <>
      <SEO title="Admin Dashboard" />
      <div>
        <h2 className="font-display text-xl font-bold text-primary-950">Admin Dashboard</h2>
        <p className="text-sm text-slate-500">Platform overview and management</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statsWithRevenue.map((s) => (
            <div key={s.label} className="card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{s.label}</p>
                <div className="rounded-xl bg-accent-500/10 p-2 text-accent-600">
                  <s.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="card p-6">
            <h3 className="font-semibold">Recent Orders</h3>
            <div className="mt-4 space-y-3">
              {statsData.recentOrders?.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-xl bg-surface-50 p-3">
                  <div>
                    <p className="text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-slate-500">{order.user?.firstName} {order.user?.lastName}</p>
                  </div>
                  <span className={`badge ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))}
              {statsData.recentOrders?.length === 0 && (
                <p className="text-sm text-slate-500">No recent orders</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
