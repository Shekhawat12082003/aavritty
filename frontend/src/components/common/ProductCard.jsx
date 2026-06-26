import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useCartStore, useWishlistStore, formatPrice } from '@/store';

export default function ProductCard({ product, index = 0 }) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-hover group overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-100">
        <Link to={`/product/${product.slug}`}>
          <img
            src={product.image}
            alt={product.name}
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
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{product.brand}</p>
        <Link to={`/product/${product.slug}`}>
          <h3 className="mt-1 line-clamp-2 font-semibold text-slate-800 transition hover:text-primary-600">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-xs text-slate-400">({product.reviewCount})</span>
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-lg font-bold text-primary-700">{formatPrice(product.price)}</p>
            {product.wholesalePrice && (
              <p className="text-xs text-slate-400">
                Wholesale: {formatPrice(product.wholesalePrice)}
              </p>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            className="rounded-xl bg-primary-600 p-2.5 text-white transition hover:bg-primary-700"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
