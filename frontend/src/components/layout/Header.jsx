import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  Zap,
} from 'lucide-react';
import { NAV_LINKS, APP_NAME } from '@/constants';
import { useCartStore, useWishlistStore } from '@/store';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const cartCount = useCartStore((s) => s.getCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="border-b border-slate-100 bg-primary-950 py-2 text-center text-xs text-white/90">
        🚀 India's Trusted B2B + B2C Electrical Wholesale Platform — Free shipping on bulk orders above ₹10,000
      </div>

      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
            <Zap className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-lg font-bold leading-tight text-primary-950">AAVRITTY</p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">Business Solutions</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                location.pathname === link.path || (link.path === '/orders' && location.pathname.startsWith('/orders'))
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-surface-100 hover:text-primary-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="rounded-xl p-2.5 text-slate-600 transition hover:bg-surface-100"
          >
            <Search className="h-5 w-5" />
          </button>

          <Link to="/wishlist" className="relative rounded-xl p-2.5 text-slate-600 transition hover:bg-surface-100">
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative rounded-xl p-2.5 text-slate-600 transition hover:bg-surface-100">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl p-2.5 text-slate-600 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-3">
          <div className="container-app">
            <input
              type="search"
              placeholder="Search products, brands, SKUs..."
              className="input-field"
              autoFocus
            />
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-surface-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
