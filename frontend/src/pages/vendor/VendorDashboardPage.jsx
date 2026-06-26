import { Package, ShoppingBag, TrendingUp, DollarSign } from 'lucide-react';
import SEO from '@/components/common/SEO';
import { formatPrice } from '@/store';

const stats = [
  { label: 'Total Products', value: '156', icon: Package, change: '+12 this month' },
  { label: 'Active Orders', value: '23', icon: ShoppingBag, change: '5 pending dispatch' },
  { label: 'Revenue', value: formatPrice(2450000), icon: DollarSign, change: '+18% vs last month' },
  { label: 'Growth', value: '18%', icon: TrendingUp, change: 'Above target' },
];

export default function VendorDashboardPage() {
  return (
    <>
      <SEO title="Vendor Dashboard" />
      <div>
        <h2 className="font-display text-xl font-bold text-primary-950">Vendor Dashboard</h2>
        <p className="text-sm text-slate-500">Overview of your store performance</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{s.label}</p>
                <div className="rounded-xl bg-primary-50 p-2 text-primary-600">
                  <s.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-800">{s.value}</p>
              <p className="mt-1 text-xs text-green-600">{s.change}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 card p-6">
          <h3 className="font-semibold">Recent Orders</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-400">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['ORD-1045', 'Sharma Electricals', '₹12,450', 'Processing'],
                  ['ORD-1044', 'Patel Traders', '₹8,900', 'Shipped'],
                  ['ORD-1043', 'Singh Industries', '₹45,200', 'Delivered'],
                ].map(([id, customer, amount, status]) => (
                  <tr key={id} className="border-b border-slate-50">
                    <td className="py-3 pr-4 font-medium">{id}</td>
                    <td className="py-3 pr-4">{customer}</td>
                    <td className="py-3 pr-4">{amount}</td>
                    <td className="py-3"><span className="badge bg-blue-50 text-blue-700">{status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
