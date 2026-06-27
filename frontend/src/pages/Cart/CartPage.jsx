import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import SEO from '@/components/common/SEO';
import Button from '@/components/common/Button';
import { useCartStore, formatPrice } from '@/store';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, getItemPrice } = useCartStore();
  const subtotal = getTotal();
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  if (items.length === 0) {
    return (
      <>
        <SEO title="Cart" />
        <div className="container-app flex min-h-[400px] flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="h-16 w-16 text-slate-300" />
          <h2 className="mt-4 text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-slate-500">Add some products to get started</p>
          <Link to="/shop" className="btn-primary mt-6">Browse Products</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Cart" />
      <div className="container-app py-8">
        <h1 className="section-title">Shopping Cart</h1>
        <p className="mt-1 text-slate-500">{items.length} item(s)</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const itemPrice = getItemPrice(item);
              const isWholesale = item.wholesalePrice && item.minOrderQty && item.quantity >= item.minOrderQty;
              return (
                <div key={item.id} className="card flex gap-4 p-4">
                  <img src={item.image} alt={item.name} className="h-24 w-24 rounded-xl object-cover" />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800">{item.name}</h3>
                      <p className="text-sm text-slate-400">
                        {typeof item.brand === 'object' ? item.brand?.name : item.brand}
                      </p>
                      {item.wholesalePrice && item.minOrderQty && (
                        <p className="text-xs text-slate-400 mt-1">
                          Wholesale price: {formatPrice(item.wholesalePrice)} (min {item.minOrderQty}+)
                          {isWholesale && <span className="text-green-600 ml-1 font-medium">✓ Applied</span>}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-slate-200">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5"><Minus className="h-3 w-3" /></button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5"><Plus className="h-3 w-3" /></button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-700">{formatPrice(itemPrice * item.quantity)}</p>
                        {isWholesale && (
                          <p className="text-xs text-green-600 line-through">{formatPrice(item.price * item.quantity)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="self-start p-2 text-slate-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="card h-fit p-6">
            <h2 className="font-semibold text-slate-800">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">GST (18%)</span><span>{formatPrice(gst)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span className="text-green-600">Free</span></div>
              <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-lg">
                <span>Total</span><span className="text-primary-700">{formatPrice(total)}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-primary mt-6 block w-full text-center">Proceed to Checkout</Link>
          </div>
        </div>
      </div>
    </>
  );
}
