import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { APP_NAME } from '@/constants';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-primary-950 text-white">
      <div className="container-app grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-bold">AAVRITTY</p>
              <p className="text-xs text-white/60">Business Solutions</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            India's premier B2B + B2C electrical wholesale platform. Connecting businesses with verified vendors nationwide.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link to="/shop" className="hover:text-white">Shop</Link></li>
            <li><Link to="/wholesale" className="hover:text-white">Wholesale</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold">For Business</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link to="/vendor/dashboard" className="hover:text-white">Vendor Portal</Link></li>
            <li><Link to="/wholesale" className="hover:text-white">Bulk Orders</Link></li>
            <li><Link to="/delivery/dashboard" className="hover:text-white">Delivery Partner</Link></li>
            <li><Link to="/support" className="hover:text-white">Support</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold">Contact</h4>
          <p className="mt-2 text-sm text-white/70">Virendra Kothari</p>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent-400" /> +91 9509679668</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent-400" /> Virendra.Kothari@Jaincybersolutions.com</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" /> Indore, Madhya Pradesh</li>
          </ul>
          <div className="mt-4 flex gap-3">
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="rounded-lg bg-white/10 p-2 transition hover:bg-accent-500">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
