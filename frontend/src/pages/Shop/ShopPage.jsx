import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import SEO from '@/components/common/SEO';
import ProductCard from '@/components/common/ProductCard';
import { PageLoader } from '@/components/common/Loader';
import { useProducts } from '@/hooks/useProducts';

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const category = searchParams.get('category') || '';

  const { data, isLoading } = useProducts({
    search: search || undefined,
    category: category || undefined,
    limit: 12,
  });

  return (
    <>
      <SEO title="Shop" description="Browse electrical products at wholesale prices" />

      <div className="container-app py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="section-title">Shop</h1>
            <p className="mt-1 text-slate-500">
              {category ? `Showing: ${category}` : 'All electrical products'}
              {data?.pagination && ` · ${data.pagination.total} products`}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field !pl-10"
              />
            </div>
            <button className="btn-secondary !px-3">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data?.products?.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {!isLoading && data?.products?.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-lg font-medium text-slate-600">No products found</p>
            <p className="mt-1 text-sm text-slate-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </>
  );
}
