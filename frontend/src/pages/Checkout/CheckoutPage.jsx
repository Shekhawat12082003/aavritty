import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CheckCircle } from 'lucide-react';
import SEO from '@/components/common/SEO';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useCartStore, formatPrice } from '@/store';

export default function CheckoutPage() {
  const { items, getTotal } = useCartStore();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const subtotal = getTotal();
  const shipping = subtotal >= 10000 ? 0 : 200;
  const tax = subtotal * 0.18;
  const total = subtotal + tax + shipping;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const onSubmit = (data) => {
    // Save shipping address to localStorage for payment page
    localStorage.setItem('shippingAddress', JSON.stringify(data));
    // Navigate to payment page
    navigate('/payment');
  };

  return (
    <>
      <SEO title="Checkout" />
      <div className="container-app py-8">
        <h1 className="section-title">Checkout</h1>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-semibold">Shipping Address</h2>
              <div className="mt-4 space-y-4">
                <Input label="Full Name" error={errors.name?.message} {...register('name', { required: 'Required' })} />
                <Input label="Phone" error={errors.phone?.message} {...register('phone', { required: 'Required' })} />
                <Input label="Email" type="email" {...register('email')} />
                <Input label="Address Line 1" error={errors.address?.message} {...register('address', { required: 'Required' })} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="City" error={errors.city?.message} {...register('city', { required: 'Required' })} />
                  <Input label="State" error={errors.state?.message} {...register('state', { required: 'Required' })} />
                </div>
                <Input label="Pincode" error={errors.pincode?.message} {...register('pincode', { required: 'Required' })} />
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
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between"><span>GST (18%)</span><span>{formatPrice(tax)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-700">{formatPrice(total)}</span>
              </div>
            </div>
            <Button type="submit" className="mt-6 w-full">Continue to Payment</Button>
          </div>
        </form>
      </div>
    </>
  );
}
