import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Users, TrendingDown, Clock } from 'lucide-react';
import SEO from '@/components/common/SEO';
import Button from '@/components/common/Button';
import ProductCard from '@/components/common/ProductCard';
import { PageLoader } from '@/components/common/Loader';
import { useProducts } from '@/hooks/useProducts';

const benefits = [
  { icon: TrendingDown, title: 'Volume Discounts', desc: 'Up to 30% off on bulk orders above MOQ' },
  { icon: FileText, title: 'GST Invoices', desc: 'Compliant tax invoices for all B2B transactions' },
  { icon: Users, title: 'Dedicated Account Manager', desc: 'Personal support for enterprise buyers' },
  { icon: Clock, title: 'Flexible Credit Terms', desc: 'Net-30 payment options for verified businesses' },
];

export default function WholesalePage() {
  const { data, isLoading } = useProducts({ limit: 4 });

  return (
    <>
      <SEO title="Wholesale" description="Bulk electrical orders at wholesale prices for businesses" />

      <section className="bg-gradient-to-br from-primary-950 to-primary-800 py-16 text-white">
        <div className="container-app text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold sm:text-5xl"
          >
            B2B Wholesale Portal
          </motion.h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Source electrical products in bulk with competitive wholesale pricing, GST invoices, and dedicated support.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register"><Button>Register as Business</Button></Link>
            <Link to="/contact"><Button variant="outline" className="!border-white/30 !text-white">Request Quote</Button></Link>
          </div>
        </div>
      </section>

      <section className="container-app py-16">
        <h2 className="section-title text-center">Why Buy Wholesale?</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <b.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-app">
          <h2 className="section-title">Popular Wholesale Products</h2>
          {isLoading ? (
            <PageLoader />
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data?.products?.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
