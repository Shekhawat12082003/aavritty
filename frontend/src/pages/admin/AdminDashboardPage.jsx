import { Users, Package, ShoppingBag, DollarSign } from 'lucide-react';
import SEO from '@/components/common/SEO';
import { formatPrice } from '@/store';

const stats = [
  { label: 'Total Users', value: '12,450', icon: Users },
  { label: 'Products', value: '50,234', icon: Package },
  { label: 'Orders Today', value: '342', icon: ShoppingBag },
  { label: 'Revenue Today', value: formatPrice(890000), icon: DollarSign },
];

export default function AdminDashboardPage() {
  return (
    <>
      <SEO title="Admin Dashboard" />
      <div>
        <h2 className="font-display text-xl font-bold text-primary-950">Admin Dashboard</h2>
        <p className="text-sm text-slate-500">Platform overview and management</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
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
            <div className="mt-4 space-y-3">
              {['PowerTech Solutions', 'ElectroMart India', 'WireKing Traders'].map((v) => (
                <div key={v} className="flex items-center justify-between rounded-xl bg-surface-50 p-3">
                  <span className="text-sm font-medium">{v}</span>
                  <div className="flex gap-2">
                    <button className="rounded-lg bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Approve</button>
                    <button className="rounded-lg bg-red-100 px-3 py-1 text-xs font-medium text-red-700">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold">System Health</h3>
            <div className="mt-4 space-y-3">
              {[
                ['API Server', 'Operational'],
                ['Database', 'Connected'],
                ['Payment Gateway', 'Pending Setup'],
                ['Email Service', 'Configured'],
              ].map(([service, status]) => (
                <div key={service} className="flex items-center justify-between text-sm">
                  <span>{service}</span>
                  <span className={`badge ${status === 'Operational' || status === 'Connected' || status === 'Configured' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {status}
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
