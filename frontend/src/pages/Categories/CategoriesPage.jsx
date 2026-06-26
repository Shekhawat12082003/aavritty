import { Link } from 'react-router-dom';
import SEO from '@/components/common/SEO';
import { PageLoader } from '@/components/common/Loader';
import { useCategories } from '@/hooks/useProducts';

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <>
      <SEO title="Categories" description="Browse electrical product categories" />
      <div className="container-app py-8">
        <h1 className="section-title">All Categories</h1>
        <p className="mt-2 text-slate-500">Explore our complete range of electrical products</p>

        {isLoading ? (
          <PageLoader />
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="card-hover flex items-center gap-4 p-6"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-2xl">
                  {cat.icon}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-800">{cat.name}</h3>
                  <p className="text-sm text-slate-400">{cat.count} products available</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
