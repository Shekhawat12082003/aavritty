import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Truck, Headphones, Award } from 'lucide-react';
import SEO from '@/components/common/SEO';
import ProductCard from '@/components/common/ProductCard';
import CategoryCard from '@/components/common/CategoryCard';
import HeroVideo from '@/components/home/HeroVideo';
import HowItWorks from '@/components/home/HowItWorks';
import { PageLoader } from '@/components/common/Loader';
import Button from '@/components/common/Button';
import { useFeaturedProducts, useCategories } from '@/hooks/useProducts';

const features = [
  { icon: Shield, title: 'Verified Vendors', desc: 'All suppliers are GST verified and quality checked' },
  { icon: Truck, title: 'Pan-India Delivery', desc: 'Fast shipping to 50+ cities across India' },
  { icon: Headphones, title: 'Dedicated Support', desc: '24/7 B2B support for bulk order assistance' },
  { icon: Award, title: 'Best Wholesale Prices', desc: 'Competitive pricing with volume discounts' },
];

export default function HomePage() {
  const { data: featured, isLoading: loadingFeatured } = useFeaturedProducts();
  const { data: categories, isLoading: loadingCategories } = useCategories();

  const categoriesList = Array.isArray(categories) ? categories : [];
  const featuredList = Array.isArray(featured) ? featured : [];

  return (
    <>
      <SEO
        title="Home"
        description="AAVRITTY Business Solutions - India's trusted B2B + B2C electrical wholesale platform"
      />

      <HeroVideo />

      {/* Categories — distinct full-width section */}
      <section className="bg-surface-50 py-20">
        <div className="container-app">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-accent-600">Catalog</p>
              <h2 className="section-title mt-1">Shop by Category</h2>
              <p className="mt-2 text-slate-500">Browse electrical products by specialized categories</p>
            </div>
            <Link to="/categories" className="hidden items-center gap-1 text-sm font-semibold text-primary-600 hover:underline sm:flex">
              View All Categories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingCategories ? (
            <PageLoader />
          ) : (
            <>
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {categoriesList.slice(0, 6).map((cat, i) => (
                  <CategoryCard key={cat.id} category={cat} index={i} />
                ))}
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoriesList.slice(0, 3).map((cat, i) => (
                  <CategoryCard key={`banner-${cat.id}`} category={cat} index={i} variant="banner" />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <HowItWorks />

      {/* Featured Products */}
      <section className="py-20">
        <div className="container-app">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">Top Picks</p>
              <h2 className="section-title mt-1">Featured Products</h2>
            </div>
            <Link to="/shop" className="text-sm font-semibold text-primary-600 hover:underline">View All →</Link>
          </div>
          {loadingFeatured ? (
            <PageLoader />
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredList.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="border-y border-slate-200 bg-white py-20">
        <div className="container-app">
          <h2 className="section-title text-center">Why Businesses Choose AAVRITTY</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        </div>
      </section>

      {/* Order management CTA */}
      <section className="bg-primary-950 py-16 text-white">
        <div className="container-app grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold">Complete Order Management</h2>
            <p className="mt-4 text-white/70">
              Track every order from placement to delivery. View timelines, download invoices,
              update statuses, and manage your entire procurement pipeline.
            </p>
            <Link to="/orders" className="btn-primary mt-6 inline-flex">
              Manage My Orders <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['Real-time Tracking', 'GST Invoices', 'Bulk Orders', 'Admin Dashboard'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm font-medium">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-app py-20">
        <div className="rounded-3xl bg-gradient-to-r from-primary-700 to-primary-900 p-8 text-center text-white sm:p-14">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Ready to Scale Your Electrical Business?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            Register as a vendor or start buying in bulk today with exclusive B2B pricing.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register"><Button>Get Started Free</Button></Link>
            <Link to="/contact"><Button variant="outline" className="!border-white/30 !text-white">Contact Sales</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
