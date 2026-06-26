import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Truck, Shield, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import SEO from '@/components/common/SEO';
import Button from '@/components/common/Button';
import { PageLoader } from '@/components/common/Loader';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore, useWishlistStore, formatPrice } from '@/store';

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const { data: product, isLoading, error } = useProduct(slug);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isInWishlist } = useWishlistStore();

  if (isLoading) return <PageLoader />;
  if (error || !product) {
    return (
      <div className="container-app py-20 text-center">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <Link to="/shop" className="mt-4 inline-block text-primary-600 hover:underline">Back to Shop</Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  return (
    <>
      <SEO title={product.name} description={product.shortDescription} />

      <div className="container-app py-8">
        <nav className="mb-6 text-sm text-slate-400">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-primary-600">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-600">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="card overflow-hidden">
            <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-400">{product.brand}</p>
            <h1 className="mt-2 font-display text-2xl font-bold text-primary-950 sm:text-3xl">{product.name}</h1>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                ))}
              </div>
              <span className="text-sm text-slate-500">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            <div className="mt-6 flex items-end gap-4">
              <span className="text-3xl font-bold text-primary-700">{formatPrice(product.price)}</span>
              {product.mrp && <span className="text-lg text-slate-400 line-through">{formatPrice(product.mrp)}</span>}
            </div>
            {product.wholesalePrice && (
              <p className="mt-1 text-sm font-medium text-accent-600">
                Wholesale Price: {formatPrice(product.wholesalePrice)} (Min. {product.minOrderQty} {product.unit}s)
              </p>
            )}

            <p className="mt-4 text-slate-600">{product.shortDescription}</p>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center rounded-xl border border-slate-200">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-surface-50"><Minus className="h-4 w-4" /></button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-2 hover:bg-surface-50"><Plus className="h-4 w-4" /></button>
              </div>
              <span className={`badge ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {product.inStock ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => addItem(product, qty)} className="flex-1 sm:flex-none">
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </Button>
              <button
                onClick={() => toggle(product)}
                className={`btn-secondary ${inWishlist ? '!border-red-200 !text-red-600' : ''}`}
              >
                <Heart className={`h-4 w-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                {inWishlist ? 'Saved' : 'Wishlist'}
              </button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-surface-50 p-4">
                <Truck className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm font-medium">Free Delivery</p>
                  <p className="text-xs text-slate-400">On orders above ₹10,000</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-surface-50 p-4">
                <Shield className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm font-medium">Genuine Products</p>
                  <p className="text-xs text-slate-400">100% authentic with warranty</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-sm text-slate-400">
              SKU: {product.sku} · GST: {product.gstRate}%
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
