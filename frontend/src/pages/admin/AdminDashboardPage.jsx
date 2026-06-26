import { Users, Package, ShoppingBag, DollarSign, Building2 } from 'lucide-react';
import SEO from '@/components/common/SEO';
import { formatPrice } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services';
import { PageLoader } from '@/components/common/Loader';

const statsConfig = [
  { label: 'Total Users', key: 'users', icon: Users },
  { label: 'Products', key: 'products', icon: Package },
  { label: 'Total Orders', key: 'orders', icon: ShoppingBag },
  { label: 'Vendors', key: 'vendors', icon: Building2 },
];

export default function AdminDashboardPage() {
  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: dashboardService.getAdminDashboard,
  });

  const { data: stats, error: statsError } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: dashboardService.getAdminStats,
  });

  if (isLoading) return <PageLoader />;

  if (error || statsError) {
    return <div className="p-6 text-red-600">Error loading dashboard. Check console for details.</div>;
  }

  const statsWithRevenue = [
    ...statsConfig.map((config) => ({
      ...config,
      value: dashboard?.[config.key]?.toLocaleString() || '0',
    })),
    {
      label: 'Today\'s Revenue',
      key: 'todayRevenue',
      icon: DollarSign,
      value: formatPrice(dashboard?.todayRevenue || 0),
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

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <h3 className="font-semibold">Pending Vendor Approvals</h3>
            <p className="mt-2 text-2xl font-bold text-amber-600">{stats?.pendingVendors || 0}</p>
            <p className="text-sm text-slate-500">Vendors awaiting verification</p>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold">Recent Orders</h3>
            <div className="mt-4 space-y-3">
              {stats?.recentOrders?.slice(0, 5).map((order) => (
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
