import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  Bell,
  LogOut,
  Truck,
  BarChart3,
  Menu,
  X,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore, useAdminAuthStore } from '@/store';

const sidebarLinks = {
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ],
  delivery: [
    { label: 'Dashboard', path: '/delivery/dashboard', icon: LayoutDashboard },
    { label: 'Active Orders', path: '/delivery/orders', icon: Truck },
    { label: 'Earnings', path: '/delivery/earnings', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ],
};

export default function DashboardLayout({ type = 'vendor' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const { logout: adminLogout, admin } = useAdminAuthStore();
  const links = sidebarLinks[type] || sidebarLinks.vendor;

  console.log('DashboardLayout rendering - type:', type);
  console.log('DashboardLayout - admin:', admin);
  console.log('DashboardLayout - user:', user);

  const handleLogout = () => {
    if (type === 'admin') {
      adminLogout();
      navigate('/admin/login');
    } else {
      logout();
      navigate('/login');
    }
  };

  const currentUser = type === 'admin' ? admin : user;
  console.log('DashboardLayout - currentUser:', currentUser);

  console.log('DashboardLayout - rendering layout with Outlet');

  return (
    <div className="flex min-h-screen bg-surface-50">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
            <Zap className="h-4 w-4" />
          </div>
          <span className="font-display font-bold text-primary-950">AAVRITTY</span>
        </div>
        <nav className="space-y-1 p-4">
          {links.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-surface-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full border-t border-slate-100 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-lg p-2 lg:hidden">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h1 className="font-display text-lg font-bold capitalize text-primary-950">{type} Portal</h1>
          <div className="flex items-center gap-3">
            <Link to="/notifications" className="relative rounded-xl p-2 hover:bg-surface-100">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent-500" />
            </Link>
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                {currentUser?.firstName?.[0] || 'U'}
              </div>
              <span className="text-sm font-medium">{currentUser?.firstName || 'User'}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
