import SEO from '@/components/common/SEO';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <>
      <SEO title="Notifications" />
      <div className="container-app max-w-2xl py-8">
        <h1 className="section-title">Notifications</h1>
        <div className="mt-6 card p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-100 text-slate-400">
            <Bell className="h-8 w-8" />
          </div>
          <h3 className="mt-4 font-semibold text-slate-800">No notifications yet</h3>
          <p className="mt-2 text-sm text-slate-500">
            You'll receive notifications about your orders, shipments, and updates here.
          </p>
        </div>
      </div>
    </>
  );
}
