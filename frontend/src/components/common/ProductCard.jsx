import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCartStore, useWishlistStore, formatPrice } from '@/store';
import { ProductImage } from '@/utils/productImages';
import { useState } from 'react';
import Toast from './Toast';

export default function ProductCard({ product, index = 0 }) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = () => {
    addItem(product);
    setShowToast(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="card-hover group overflow-hidden"
      >
        <div className="relative aspect-square overflow-hidden bg-surface-100">
          <Link to={`/product/${product.slug}`}>
            <ProductImage
              product={product}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </Link>
          {product.isFeatured && (
            <span className="badge absolute left-3 top-3 bg-accent-500 text-white">Featured</span>
          )}
          <button
            onClick={() => toggle(product)}
            className={`absolute right-3 top-3 rounded-full p-2 shadow-md transition ${
              inWishlist ? 'bg-red-500 text-white' : 'bg-white text-slate-600 hover:text-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {typeof product.brand === 'object' ? product.brand?.name : product.brand}
          </p>
          <Link to={`/product/${product.slug}`}>
            <h3 className="mt-1 line-clamp-2 font-semibold text-slate-800 transition hover:text-primary-600">
              {product.name}
            </h3>
          </Link>

          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-lg font-bold text-primary-700">{formatPrice(product.price)}</p>
              {product.wholesalePrice && product.minOrderQty && (
                <p className="text-xs text-slate-400">
                  Buy {product.minOrderQty}+ for {formatPrice(product.wholesalePrice)}
                  {product.wholesalePrice < product.price && (
                    <span className="text-green-600 ml-1">
                      ({Math.round(((product.price - product.wholesalePrice) / product.price) * 100)}% off)
                    </span>
                  )}
                </p>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={(product.stock || 0) === 0}
              className={`rounded-xl p-2.5 text-white transition ${
                (product.stock || 0) === 0 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
      {showToast && (
        <Toast
          message={`${product.name} added to cart`}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}
