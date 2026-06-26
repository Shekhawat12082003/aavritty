import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import SEO from '@/components/common/SEO';
import ProductCard from '@/components/common/ProductCard';
import { useWishlistStore } from '@/store';

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);

  if (items.length === 0) {
    return (
      <>
        <SEO title="Wishlist" />
        <div className="container-app flex min-h-[400px] flex-col items-center justify-center py-16 text-center">
          <Heart className="h-16 w-16 text-slate-300" />
          <h2 className="mt-4 text-xl font-semibold">Your wishlist is empty</h2>
          <Link to="/shop" className="btn-primary mt-6">Browse Products</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Wishlist" />
      <div className="container-app py-8">
        <h1 className="section-title">My Wishlist</h1>
        <p className="mt-1 text-slate-500">{items.length} saved item(s)</p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </>
  );
}
