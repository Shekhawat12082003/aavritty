import { Package, Search, Filter, Plus, Edit, Trash2, X } from 'lucide-react';
import SEO from '@/components/common/SEO';
import { formatPrice } from '@/store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService, productService } from '@/services';
import { PageLoader } from '@/components/common/Loader';
import { useState } from 'react';

export default function VendorProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const queryClient = useQueryClient();

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['vendor-products'],
    queryFn: dashboardService.getVendorProducts,
  });

  const products = productsData?.data?.products || [];

  const deleteMutation = useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['vendor-products']);
    },
  });

  const handleDelete = (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(productId);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      <SEO title="My Products" />
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-primary-950">My Products</h2>
            <p className="text-sm text-slate-500">Manage your product catalog</p>
          </div>
          <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by name, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-surface-50">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Products Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-surface-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.brand?.name || 'No Brand'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{product.sku}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{product.category?.name || 'Uncategorized'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <div>
                        <p className="font-medium">{formatPrice(product.price)}</p>
                        <p className="text-xs text-slate-500">Wholesale: {formatPrice(product.wholesalePrice)}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{product.inventory?.quantity || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(product)} className="rounded-lg p-2 text-slate-500 hover:bg-surface-100 hover:text-primary-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">No products yet. Add your first product!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button onClick={handleCloseModal} className="p-2 hover:bg-surface-100 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 text-center text-slate-500">
                <p>Product form coming soon. This will allow adding/editing products with all fields.</p>
                <p className="text-sm mt-2">For now, use the backend API directly or seed data.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
