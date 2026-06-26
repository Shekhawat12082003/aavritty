import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEO from '@/components/common/SEO';
import CategoryCard from '@/components/common/CategoryCard';
import CategoryIcon from '@/components/common/CategoryIcon';
import { PageLoader } from '@/components/common/Loader';
import { useCategories } from '@/hooks/useProducts';

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <>
      <SEO title="Categories" description="Browse electrical product categories" />

      <div className="border-b border-slate-200 bg-gradient-to-br from-primary-950 to-primary-800 py-12 text-white">
        <div className="container-app">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Product Categories</h1>
          <p className="mt-2 max-w-xl text-white/70">
            Explore our complete catalog of electrical products organized by category
          </p>
        </div>
      </div>

      <div className="container-app py-12">
        {isLoading ? (
          <PageLoader />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories?.map((cat, i) => (
                <CategoryCard key={cat.id} category={cat} index={i} variant="banner" />
              ))}
            </div>

            <h2 className="section-title mt-16">All Categories</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {categories?.map((cat, i) => (
                <CategoryCard key={`grid-${cat.id}`} category={cat} index={i} variant="grid" />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
