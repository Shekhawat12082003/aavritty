import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CheckCircle } from 'lucide-react';
import SEO from '@/components/common/SEO';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useCartStore, formatPrice } from '@/store';

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const [placed, setPlaced] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const subtotal = getTotal();
  const total = subtotal + subtotal * 0.18;

  if (items.length === 0 && !placed) {
    navigate('/cart');
    return null;
  }

  const onSubmit = () => {
    setPlaced(true);
    clearCart();
  };

  if (placed) {
    return (
      <>
        <SEO title="Order Placed" />
        <div className="container-app flex min-h-[400px] flex-col items-center justify-center py-16 text-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold">Order Placed Successfully!</h2>
          <p className="mt-2 text-slate-500">Your order will be processed shortly. Payment integration coming in Phase 6.</p>
          <div className="mt-6 flex gap-4">
            <Link to="/orders" className="btn-primary">View Orders</Link>
            <Link to="/shop" className="btn-secondary">Continue Shopping</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Checkout" />
      <div className="container-app py-8">
        <h1 className="section-title">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-semibold">Shipping Address</h2>
              <div className="mt-4 space-y-4">
                <Input label="Full Name" error={errors.name?.message} {...register('name', { required: 'Required' })} />
                <Input label="Phone" error={errors.phone?.message} {...register('phone', { required: 'Required' })} />
                <Input label="Address Line 1" error={errors.address?.message} {...register('address', { required: 'Required' })} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="City" error={errors.city?.message} {...register('city', { required: 'Required' })} />
                  <Input label="Pincode" error={errors.pincode?.message} {...register('pincode', { required: 'Required' })} />
                </div>
              </div>
            </div>
          </div>

          <div className="card h-fit p-6">
            <h2 className="font-semibold">Order Summary</h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-600">{item.name} × {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total (incl. GST)</span>
                <span className="text-primary-700">{formatPrice(total)}</span>
              </div>
            </div>
            <Button type="submit" className="mt-6 w-full">Place Order</Button>
          </div>
        </form>
      </div>
    </>
  );
}
