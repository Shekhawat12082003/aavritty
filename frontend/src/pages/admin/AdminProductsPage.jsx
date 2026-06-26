import { Package, Search, Filter, Plus, Edit, Trash2, X } from 'lucide-react';
import SEO from '@/components/common/SEO';
import { formatPrice } from '@/store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService, productService, adminApi } from '@/services';
import { PageLoader } from '@/components/common/Loader';
import { useState } from 'react';

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    categoryId: '',
    isActive: true,
    isFeatured: false,
    description: '',
    stock: '',
    image: ''
  });
  const queryClient = useQueryClient();

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['admin-products', { search: searchTerm }],
    queryFn: () => dashboardService.getAdminProducts({ search: searchTerm, limit: 50 }),
  });

  const products = productsData?.data?.products || productsData?.products || [];

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (id) => adminApi.patch(`/products/${id}/toggle-active`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
    },
  });

  const addProductMutation = useMutation({
    mutationFn: (data) => adminApi.post('/admin/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        slug: '',
        price: '',
        categoryId: '',
        isActive: true,
        isFeatured: false,
        description: '',
        stock: '',
        image: ''
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }) => adminApi.put(`/admin/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        slug: '',
        price: '',
        categoryId: '',
        isActive: true,
        isFeatured: false,
        description: '',
        stock: '',
        image: ''
      });
    },
  });

  const handleDelete = (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(productId);
    }
  };

  const handleToggleActive = (productId) => {
    toggleActiveMutation.mutate(productId);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      price: product.price,
      categoryId: product.categoryId,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      description: product.description,
      stock: product.stock,
      image: product.image || ''
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      price: '',
      categoryId: '',
      isActive: true,
      isFeatured: false,
      description: '',
      stock: '',
      image: ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      price: '',
      categoryId: '',
      isActive: true,
      isFeatured: false,
      description: '',
      stock: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      addProductMutation.mutate(productData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      <SEO title="Admin Products" />
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-primary-950">Product Management</h2>
            <p className="text-sm text-slate-500">Manage all products in the catalog</p>
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
              placeholder="Search products by name, SKU, or brand..."
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
                      <button
                        onClick={() => handleToggleActive(product.id)}
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(product)} className="rounded-lg p-2 text-slate-500 hover:bg-surface-100 hover:text-primary-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="product-slug (auto-generated if empty)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="">Select category</option>
                    <option value="1">Wires & Cables</option>
                    <option value="2">Switches & Sockets</option>
                    <option value="3">Circuit Breakers</option>
                    <option value="4">Distribution Boards</option>
                    <option value="5">Fans & Lighting</option>
                    <option value="6">Industrial Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="Product description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="h-20 w-20 object-cover rounded-lg border border-slate-200"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-700">Active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-700">Featured</span>
                  </label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={addProductMutation.isLoading || updateProductMutation.isLoading}
                    className="btn-primary flex-1"
                  >
                    {addProductMutation.isLoading || updateProductMutation.isLoading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
