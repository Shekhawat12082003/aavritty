import { Package, Clock, CheckCircle, Truck } from 'lucide-react';
import SEO from '@/components/common/SEO';
import { formatPrice } from '@/store';

const demoOrders = [
  { id: 'ORD-001', date: '2026-06-20', status: 'Delivered', total: 4580, items: 3, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  { id: 'ORD-002', date: '2026-06-22', status: 'Shipped', total: 12450, items: 8, icon: Truck, color: 'text-blue-600 bg-blue-50' },
  { id: 'ORD-003', date: '2026-06-25', status: 'Processing', total: 2890, items: 2, icon: Clock, color: 'text-amber-600 bg-amber-50' },
];

export default function OrdersPage() {
  return (
    <>
      <SEO title="My Orders" />
      <div className="container-app py-8">
        <h1 className="section-title">My Orders</h1>
        <p className="mt-1 text-slate-500">Track and manage your orders</p>

        <div className="mt-8 space-y-4">
          {demoOrders.map((order) => {
            const Icon = order.icon;
            return (
              <div key={order.id} className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${order.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{order.id}</p>
                    <p className="text-sm text-slate-400">{order.date} · {order.items} items</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`badge ${order.color}`}>{order.status}</span>
                  <span className="font-bold text-primary-700">{formatPrice(order.total)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {demoOrders.length === 0 && (
          <div className="mt-16 text-center">
            <Package className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4 text-slate-500">No orders yet</p>
          </div>
        )}
      </div>
    </>
  );
}
