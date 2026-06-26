import SEO from '@/components/common/SEO';
import { Bell, Package, Tag, Truck } from 'lucide-react';

const notifications = [
  { id: 1, type: 'order', title: 'Order Shipped', message: 'Your order ORD-002 has been shipped', time: '2 hours ago', read: false, icon: Truck },
  { id: 2, type: 'promo', title: 'Flash Sale', message: '20% off on all MCBs this week', time: '5 hours ago', read: false, icon: Tag },
  { id: 3, type: 'order', title: 'Order Delivered', message: 'Order ORD-001 delivered successfully', time: '1 day ago', read: true, icon: Package },
  { id: 4, type: 'system', title: 'Welcome!', message: 'Welcome to AAVRITTY Business Solutions', time: '3 days ago', read: true, icon: Bell },
];

export default function NotificationsPage() {
  return (
    <>
      <SEO title="Notifications" />
      <div className="container-app max-w-2xl py-8">
        <h1 className="section-title">Notifications</h1>
        <div className="mt-6 space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`card flex gap-4 p-4 ${!n.read ? 'border-primary-200 bg-primary-50/30' : ''}`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${!n.read ? 'bg-primary-100 text-primary-600' : 'bg-surface-100 text-slate-400'}`}>
                <n.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-800">{n.title}</p>
                  <span className="text-xs text-slate-400">{n.time}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{n.message}</p>
              </div>
              {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-accent-500" />}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
