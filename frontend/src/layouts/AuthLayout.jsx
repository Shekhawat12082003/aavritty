import { Outlet, Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-primary-950 p-12 text-white lg:flex">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-500">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold">AAVRITTY</p>
            <p className="text-sm text-white/60">Business Solutions</p>
          </div>
        </Link>
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight">
            Power Your Business<br />With Quality Electricals
          </h2>
          <p className="mt-4 max-w-md text-lg text-white/70">
            Join 1,00,000+ businesses sourcing electrical products from verified vendors across India.
          </p>
        </div>
        <p className="text-sm text-white/40">Trusted by contractors, retailers & industries nationwide</p>
      </div>
      <div className="flex w-full flex-col items-center justify-center bg-surface-50 px-6 py-12 lg:w-1/2">
        <Outlet />
      </div>
    </div>
  );
}
