import { Truck, MapPin, Clock, DollarSign } from 'lucide-react';
import SEO from '@/components/common/SEO';
import Button from '@/components/common/Button';
import { formatPrice } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { dashboardService, orderService } from '@/services';
import { PageLoader } from '@/components/common/Loader';

const statsConfig = [
  { label: 'Active Deliveries', key: 'activeOrders', icon: Truck },
  { label: 'Completed Today', key: 'completedOrders', icon: Clock },
  { label: 'Today\'s Earnings', key: 'totalEarnings', icon: DollarSign, format: true },
  { label: 'Rating', value: '4.8 ★', icon: MapPin },
];

export default function DeliveryDashboardPage() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['delivery-dashboard'],
    queryFn: dashboardService.getDeliveryDashboard,
  });

  const { data: ordersData } = useQuery({
    queryKey: ['delivery-orders'],
    queryFn: () => orderService.getAll({ status: 'CONFIRMED,PROCESSING,SHIPPED', limit: 10 }),
  });

  const activeOrders = ordersData?.data?.orders || [];

  if (isLoading) return <PageLoader />;

  const stats = statsConfig.map((config) => {
    if (config.value) return config;
    return {
      ...config,
      value: config.format 
        ? formatPrice(dashboard?.[config.key] || 0)
        : (dashboard?.[config.key]?.toLocaleString() || '0'),
    };
  });

  return (
    <>
      <SEO title="Delivery Dashboard" />
      <div>
        <h2 className="font-display text-xl font-bold text-primary-950">Delivery Dashboard</h2>
        <p className="text-sm text-slate-500">Manage your deliveries and earnings</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{s.label}</p>
                <s.icon className="h-4 w-4 text-primary-600" />
              </div>
              <p className="mt-2 text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 card p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Active Orders</h3>
            <Button variant="secondary" className="!py-1.5 !text-xs">Go Online</Button>
          </div>
          <div className="mt-4 space-y-4">
            {activeOrders.map((order) => (
              <div key={order.id} className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{order.orderNumber || `ORD-${order.id.slice(0, 8)}`}</p>
                  <p className="text-sm text-slate-500">{order.shippingAddress?.address || 'Address not available'}</p>
                  <p className="text-xs text-slate-400">{order.items?.length || 0} items</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-primary-700">{formatPrice(order.totalAmount)}</span>
                  <Button className="!py-1.5 !text-xs">Accept</Button>
                </div>
              </div>
            ))}
            {activeOrders.length === 0 && (
              <div className="py-8 text-center text-slate-500">No active orders available</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
