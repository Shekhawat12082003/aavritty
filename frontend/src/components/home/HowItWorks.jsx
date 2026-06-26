import { Link } from 'react-router-dom';
import { Search, FileText, Truck, CheckCircle2 } from 'lucide-react';

const steps = [
  { icon: Search, title: 'Browse & Compare', desc: 'Search 50,000+ products across categories with wholesale pricing', link: '/shop' },
  { icon: FileText, title: 'Place Bulk Order', desc: 'Add to cart or request custom quotes for large quantities', link: '/wholesale' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Pan-India shipping with real-time order tracking', link: '/orders' },
  { icon: CheckCircle2, title: 'GST Invoice', desc: 'Receive compliant tax invoices for every B2B transaction', link: '/about' },
];

export default function HowItWorks() {
  return (
    <section className="border-y border-slate-200 bg-white py-20">
      <div className="container-app">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-600">Simple Process</p>
          <h2 className="section-title mt-2">How AAVRITTY Works</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-500">
            From discovery to delivery — a seamless B2B procurement experience designed for electrical businesses.
          </p>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Link key={step.title} to={step.link} className="group relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition group-hover:bg-primary-600 group-hover:text-white">
                <step.icon className="h-7 w-7" />
              </div>
              <span className="absolute -top-2 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-5 font-semibold text-slate-800 group-hover:text-primary-700">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
