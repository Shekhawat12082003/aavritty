import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Truck, Headphones, Award } from 'lucide-react';
import SEO from '@/components/common/SEO';
import ProductCard from '@/components/common/ProductCard';
import { PageLoader } from '@/components/common/Loader';
import Button from '@/components/common/Button';
import { useFeaturedProducts, useCategories } from '@/hooks/useProducts';
import { STATS } from '@/constants';

const features = [
  { icon: Shield, title: 'Verified Vendors', desc: 'All suppliers are GST verified and quality checked' },
  { icon: Truck, title: 'Pan-India Delivery', desc: 'Fast shipping to 500+ cities across India' },
  { icon: Headphones, title: 'Dedicated Support', desc: '24/7 B2B support for bulk order assistance' },
  { icon: Award, title: 'Best Wholesale Prices', desc: 'Competitive pricing with volume discounts' },
];

export default function HomePage() {
  const { data: featured, isLoading: loadingFeatured } = useFeaturedProducts();
  const { data: categories, isLoading: loadingCategories } = useCategories();

  return (
    <>
      <SEO
        title="Home"
        description="AAVRITTY Business Solutions - India's trusted B2B + B2C electrical wholesale platform"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-800 to-primary-700 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container-app relative py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <span className="badge bg-accent-500/20 text-accent-400">#1 Electrical Wholesale Platform</span>
              <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Power Your Business With{' '}
                <span className="text-accent-400">Quality Electricals</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg text-white/70">
                Source wires, switches, MCBs, lighting and industrial equipment from 2,500+ verified vendors at wholesale prices.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/shop"><Button>Shop Now <ArrowRight className="h-4 w-4" /></Button></Link>
                <Link to="/wholesale"><Button variant="outline" className="!border-white/30 !text-white hover:!bg-white/10">Bulk Orders</Button></Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden lg:block"
            >
              <div className="glass rounded-3xl p-8 shadow-glass">
                <div className="grid grid-cols-2 gap-4">
                  {STATS.map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-white/10 p-4 text-center">
                      <p className="font-display text-2xl font-bold text-accent-400">{stat.value}</p>
                      <p className="mt-1 text-xs text-white/60">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-app py-16">
        <div className="flex items-end justify-between">
          <h2 className="section-title">Shop by Category</h2>
          <Link to="/categories" className="text-sm font-semibold text-primary-600 hover:underline">View All →</Link>
        </div>
        {loadingCategories ? (
          <PageLoader />
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories?.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="card-hover flex flex-col items-center p-6 text-center"
                >
                  <span className="text-3xl">{cat.icon}</span>
                  <h3 className="mt-3 text-sm font-semibold text-slate-800">{cat.name}</h3>
                  <p className="mt-1 text-xs text-slate-400">{cat.count} products</p>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="bg-white py-16">
        <div className="container-app">
          <h2 className="section-title">Featured Products</h2>
          <p className="mt-2 text-slate-500">Top-rated electrical products at wholesale prices</p>
          {loadingFeatured ? (
            <PageLoader />
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured?.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="container-app py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-800">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-app pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-primary-700 to-primary-900 p-8 text-center text-white sm:p-12">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Ready to Scale Your Electrical Business?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">Register as a vendor or start buying in bulk today with exclusive B2B pricing.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link to="/register"><Button>Get Started Free</Button></Link>
            <Link to="/contact"><Button variant="outline" className="!border-white/30 !text-white">Contact Sales</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
