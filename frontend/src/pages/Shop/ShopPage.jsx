import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import SEO from '@/components/common/SEO';
import ProductCard from '@/components/common/ProductCard';
import { PageLoader } from '@/components/common/Loader';
import { useProducts, useCategories } from '@/hooks/useProducts';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const category = searchParams.get('category') || '';

  const { data, isLoading } = useProducts({
    search: search || undefined,
    category: category || undefined,
    limit: 12,
  });

  const { data: categories } = useCategories();
  const categoriesList = Array.isArray(categories) ? categories : [];

  const products = data?.products || [];
  const pagination = data?.pagination;

  const handleCategoryChange = (categoryId) => {
    if (categoryId === category) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

  const clearCategory = () => {
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  return (
    <>
      <SEO title="Shop" description="Browse electrical products at wholesale prices" />

      <div className="container-app py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="section-title">Shop</h1>
            <p className="mt-1 text-slate-500">
              {category ? (
                <>
                  Showing: <span className="font-medium text-primary-600">{categoriesList.find(c => c.id === category)?.name || category}</span>
                  <button onClick={clearCategory} className="ml-2 text-xs text-slate-400 hover:text-slate-600 underline">
                    Clear filter
                  </button>
                </>
              ) : 'All electrical products'}
              {pagination && ` · ${pagination.total} products`}
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
            <div className="relative">
              <button
                onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                className={`btn-secondary !px-3 ${showCategoryFilter ? 'bg-primary-50 border-primary-300 text-primary-700' : ''}`}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
              {showCategoryFilter && (
                <div className="absolute right-0 top-full z-10 mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-800">Categories</h3>
                    <button onClick={() => setShowCategoryFilter(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    <button
                      onClick={() => handleCategoryChange('')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        !category ? 'bg-primary-100 text-primary-700 font-medium' : 'hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      All Categories
                    </button>
                    {categoriesList.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                          category === cat.id ? 'bg-primary-100 text-primary-700 font-medium' : 'hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {!isLoading && products.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-lg font-medium text-slate-600">No products found</p>
            <p className="mt-1 text-sm text-slate-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </>
  );
}
