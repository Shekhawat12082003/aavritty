import { Truck, MapPin, Clock, DollarSign } from 'lucide-react';
import SEO from '@/components/common/SEO';
import Button from '@/components/common/Button';
import { formatPrice } from '@/store';

export default function DeliveryDashboardPage() {
  return (
    <>
      <SEO title="Delivery Dashboard" />
      <div>
        <h2 className="font-display text-xl font-bold text-primary-950">Delivery Dashboard</h2>
        <p className="text-sm text-slate-500">Manage your deliveries and earnings</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Active Deliveries', value: '4', icon: Truck },
            { label: 'Completed Today', value: '12', icon: Clock },
            { label: 'Today\'s Earnings', value: formatPrice(2400), icon: DollarSign },
            { label: 'Rating', value: '4.8 ★', icon: MapPin },
          ].map((s) => (
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
            {[
              { id: 'DEL-301', address: 'Andheri East, Mumbai', amount: '₹4,580', distance: '3.2 km' },
              { id: 'DEL-302', address: 'Bandra West, Mumbai', amount: '₹12,450', distance: '5.8 km' },
            ].map((order) => (
              <div key={order.id} className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-slate-500">{order.address}</p>
                  <p className="text-xs text-slate-400">{order.distance} away</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-primary-700">{order.amount}</span>
                  <Button className="!py-1.5 !text-xs">Accept</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
