import { TrendingUp, Users, Package, DollarSign, ShoppingCart } from 'lucide-react';
import SEO from '@/components/common/SEO';
import { formatPrice } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { dashboardService, orderService } from '@/services';
import { PageLoader } from '@/components/common/Loader';

export default function AdminAnalyticsPage() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: dashboardService.getAdminDashboard,
  });

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: dashboardService.getAdminStats,
  });

  if (isLoading) return <PageLoader />;

  const metrics = [
    { label: 'Total Users', value: dashboard?.users?.toLocaleString() || '0', icon: Users, color: 'text-blue-600' },
    { label: 'Total Products', value: dashboard?.products?.toLocaleString() || '0', icon: Package, color: 'text-green-600' },
    { label: 'Total Orders', value: dashboard?.orders?.toLocaleString() || '0', icon: ShoppingCart, color: 'text-purple-600' },
    { label: 'Total Vendors', value: dashboard?.vendors?.toLocaleString() || '0', icon: Users, color: 'text-amber-600' },
    { label: 'Today\'s Revenue', value: formatPrice(dashboard?.todayRevenue || 0), icon: DollarSign, color: 'text-emerald-600' },
  ];

  return (
    <>
      <SEO title="Admin Analytics" />
      <div>
        <h2 className="font-display text-xl font-bold text-primary-950">Platform Analytics</h2>
        <p className="text-sm text-slate-500">Comprehensive platform statistics and insights</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {metrics.map((metric) => (
            <div key={metric.label} className="card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{metric.label}</p>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
              <p className="mt-2 text-2xl font-bold">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <h3 className="font-semibold">Pending Vendor Approvals</h3>
            <p className="mt-4 text-4xl font-bold text-amber-600">{stats?.pendingVendors || 0}</p>
            <p className="mt-2 text-sm text-slate-500">Vendors awaiting verification</p>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold">Recent Activity</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">New orders today</span>
                <span className="font-semibold">{stats?.recentOrders?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Low stock alerts</span>
                <span className="font-semibold">{stats?.lowStockProducts?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 card p-6">
          <h3 className="font-semibold">Growth Overview</h3>
          <div className="mt-4 h-64 flex items-center justify-center rounded-xl bg-surface-50">
            <div className="text-center text-slate-500">
              <TrendingUp className="mx-auto h-12 w-12 mb-2" />
              <p>Analytics charts coming soon</p>
              <p className="text-sm">Connect to backend for real-time data visualization</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
