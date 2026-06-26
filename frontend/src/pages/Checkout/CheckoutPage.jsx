import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CheckCircle } from 'lucide-react';
import SEO from '@/components/common/SEO';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useCartStore, formatPrice } from '@/store';
import { useMutation } from '@tanstack/react-query';
import { orderService } from '@/services';

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const [placedOrder, setPlacedOrder] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const subtotal = getTotal();
  const total = subtotal + subtotal * 0.18 + (subtotal >= 10000 ? 0 : 200);

  const orderMutation = useMutation({
    mutationFn: orderService.create,
    onSuccess: (data) => {
      clearCart();
      setPlacedOrder(data);
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    },
  });

  if (items.length === 0 && !placedOrder) {
    navigate('/cart');
    return null;
  }

  const onSubmit = (data) => {
    // TODO: Call real API to create order
    console.log('Placing order with data:', data);
    orderMutation.mutate({
      items: items.map((i) => ({ productId: i.id, quantity: i.quantity, unitPrice: i.price })),
      shippingAddress: {
        line1: data.address,
        line2: '',
        city: data.city,
        state: data.state || 'Maharashtra',
        pincode: data.pincode,
        country: 'India',
      },
      customer: {
        name: data.name,
        email: data.email || 'guest@aavritty.com',
        phone: data.phone,
      },
      paymentMethod: 'UPI',
    });
  };

  if (placedOrder) {
    return (
      <>
        <SEO title="Order Placed" />
        <div className="container-app flex min-h-[400px] flex-col items-center justify-center py-16 text-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold">Order Placed Successfully!</h2>
          <p className="mt-2 text-slate-500">Order {placedOrder.orderNumber || `ORD-${placedOrder.id?.slice(0, 8)}`} — {formatPrice(placedOrder.totalAmount || total)}</p>
          <div className="mt-6 flex gap-4">
            <Link to={`/orders/${placedOrder.id}`} className="btn-primary">View Order Details</Link>
            <Link to="/orders" className="btn-secondary">All Orders</Link>
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
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between"><span>GST (18%)</span><span>{formatPrice(subtotal * 0.18)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{subtotal >= 10000 ? 'Free' : formatPrice(200)}</span></div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-700">{formatPrice(total)}</span>
              </div>
            </div>
            <Button type="submit" loading={orderMutation.isPending} className="mt-6 w-full">Place Order</Button>
          </div>
        </form>
      </div>
    </>
  );
}
