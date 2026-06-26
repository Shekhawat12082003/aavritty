import { TrendingUp, Package, ShoppingCart, DollarSign, BarChart3 } from 'lucide-react';
import SEO from '@/components/common/SEO';
import { formatPrice } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services';
import { PageLoader } from '@/components/common/Loader';

export default function VendorAnalyticsPage() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['vendor-dashboard'],
    queryFn: dashboardService.getVendorDashboard,
  });

  if (isLoading) return <PageLoader />;

  const metrics = [
    { label: 'Total Products', value: dashboard?.products?.toLocaleString() || '0', icon: Package, color: 'text-blue-600' },
    { label: 'Total Orders', value: dashboard?.orders?.toLocaleString() || '0', icon: ShoppingCart, color: 'text-green-600' },
    { label: 'Total Revenue', value: formatPrice(dashboard?.totalRevenue || 0), icon: DollarSign, color: 'text-emerald-600' },
    { label: 'Pending Orders', value: dashboard?.pendingOrders?.toLocaleString() || '0', icon: BarChart3, color: 'text-amber-600' },
  ];

  return (
    <>
      <SEO title="Vendor Analytics" />
      <div>
        <h2 className="font-display text-xl font-bold text-primary-950">Store Analytics</h2>
        <p className="text-sm text-slate-500">Performance metrics and insights for your store</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        <div className="mt-8 card p-6">
          <h3 className="font-semibold">Sales Overview</h3>
          <div className="mt-4 h-64 flex items-center justify-center rounded-xl bg-surface-50">
            <div className="text-center text-slate-500">
              <TrendingUp className="mx-auto h-12 w-12 mb-2" />
              <p>Sales charts coming soon</p>
              <p className="text-sm">Connect to backend for real-time data visualization</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <h3 className="font-semibold">Top Performing Products</h3>
            <div className="mt-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-surface-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600 text-xs font-bold">
                      #{i}
                    </div>
                    <span className="text-sm font-medium">Product {i}</span>
                  </div>
                  <span className="text-sm text-slate-600">{formatPrice(Math.floor(Math.random() * 50000))}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold">Recent Activity</h3>
            <div className="mt-4 space-y-3">
              {[
                'New order received',
                'Product inventory updated',
                'Customer inquiry',
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-primary-500" />
                  <span className="text-slate-600">{activity}</span>
                  <span className="ml-auto text-xs text-slate-400">{i + 1}h ago</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
