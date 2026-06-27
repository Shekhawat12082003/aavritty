import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Eye, Heart } from 'lucide-react';
import SEO from '@/components/common/SEO';
import { STATS } from '@/constants';

export default function AboutPage() {
  return (
    <>
      <SEO title="About Us" description="Learn about AAVRITTY Business Solutions" />
      <section className="bg-primary-950 py-16 text-white">
        <div className="container-app text-center">
          <h1 className="font-display text-4xl font-bold">About AAVRITTY</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Empowering India's electrical trade with technology, transparency, and trust since 2020.
          </p>
        </div>
      </section>

      <section className="container-app py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="section-title">Our Story</h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              AAVRITTY Business Solutions was founded with a vision to digitize India's electrical wholesale market.
              We connect contractors, retailers, and industries with verified vendors offering genuine products at competitive prices.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              Today, we serve over 1,00,000 customers across 50+ cities, listing 50,000+ products from verified vendors.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="card p-6 text-center">
                <p className="font-display text-2xl font-bold text-primary-700">{s.value}</p>
                <p className="mt-1 text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {[
            { icon: Target, title: 'Mission', desc: 'Make quality electrical products accessible to every business in India.' },
            { icon: Eye, title: 'Vision', desc: 'Become India\'s most trusted B2B electrical marketplace.' },
            { icon: Heart, title: 'Values', desc: 'Integrity, quality, transparency, and customer-first approach.' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6"
            >
              <item.icon className="h-8 w-8 text-primary-600" />
              <h3 className="mt-4 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
