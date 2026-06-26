import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import SEO from '@/components/common/SEO';
import Button from '@/components/common/Button';
import { useCartStore, formatPrice } from '@/store';
import { useMutation } from '@tanstack/react-query';
import { orderService, api } from '@/services';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export default function PaymentPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [error, setError] = useState('');
  const [shippingAddress, setShippingAddress] = useState(null);
  const navigate = useNavigate();
  const subtotal = getTotal();
  const shipping = subtotal >= 10000 ? 0 : 200;
  const tax = subtotal * 0.18;
  const total = subtotal + tax + shipping;

  // Get shipping address from localStorage (stored from checkout)
  useEffect(() => {
    const savedAddress = localStorage.getItem('shippingAddress');
    if (savedAddress) {
      setShippingAddress(JSON.parse(savedAddress));
    } else {
      navigate('/checkout');
    }
  }, [navigate]);

  const orderMutation = useMutation({
    mutationFn: orderService.create,
    onSuccess: (data) => {
      clearCart();
      localStorage.removeItem('shippingAddress');
      setPlacedOrder(data);
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    },
  });

  const handleRazorpayPayment = async () => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError('Failed to load payment gateway. Please try again.');
      return;
    }

    try {
      // Get Razorpay key from backend
      const configResponse = await api.get('/payment/config');
      const razorpayKey = configResponse.key_id;

      if (!razorpayKey || razorpayKey.includes('YOUR_KEY_ID')) {
        setError('Payment gateway not configured. Please use COD for now.');
        return;
      }

      // Create Razorpay order
      const response = await api.post('/payment/create-order', { amount: total });
      const { order_id, amount, currency } = response;

      const options = {
        key: razorpayKey,
        amount: amount,
        currency: currency,
        name: 'AAVRITTY Business Solutions',
        description: 'Electrical Products Order',
        order_id: order_id,
        handler: async function (response) {
          // Verify payment
          const verifyResponse = await api.post('/payment/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });

          if (verifyResponse.success) {
            // Place order after successful payment
            orderMutation.mutate({
              items: items.map((i) => ({ productId: i.id, quantity: i.quantity, unitPrice: i.price })),
              shippingAddress: {
                line1: shippingAddress.address,
                line2: '',
                city: shippingAddress.city,
                state: shippingAddress.state,
                pincode: shippingAddress.pincode,
                country: 'India',
              },
              billingAddress: {
                line1: shippingAddress.address,
                line2: '',
                city: shippingAddress.city,
                state: shippingAddress.state,
                pincode: shippingAddress.pincode,
                country: 'India',
              },
              paymentMethod: 'ONLINE',
              notes: shippingAddress.notes || '',
            });
          } else {
            setError('Payment verification failed. Please try again.');
          }
        },
        prefill: {
          name: shippingAddress?.name || '',
          email: shippingAddress?.email || '',
          contact: shippingAddress?.phone || ''
        },
        theme: {
          color: '#2563eb'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Razorpay error:', err);
      setError('Payment failed. Please try again or use COD.');
    }
  };

  const handlePayment = () => {
    if (!shippingAddress) {
      navigate('/checkout');
      return;
    }

    if (paymentMethod === 'online') {
      handleRazorpayPayment();
      return;
    }

    // Place order with COD
    orderMutation.mutate({
      items: items.map((i) => ({ productId: i.id, quantity: i.quantity, unitPrice: i.price })),
      shippingAddress: {
        line1: shippingAddress.address,
        line2: '',
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        country: 'India',
      },
      billingAddress: {
        line1: shippingAddress.address,
        line2: '',
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        country: 'India',
      },
      paymentMethod: 'COD',
      notes: shippingAddress.notes || '',
    });
  };

  if (items.length === 0 && !placedOrder) {
    navigate('/cart');
    return null;
  }

  if (placedOrder) {
    return (
      <>
        <SEO title="Order Placed Successfully" />
        <div className="container-app py-12">
          <div className="mx-auto max-w-2xl">
            <div className="card p-8 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="font-display text-2xl font-bold text-primary-950">Order Placed Successfully!</h1>
              <p className="mt-2 text-slate-600">Your order has been placed and will be processed soon.</p>
              <div className="mt-6 rounded-xl bg-surface-50 p-4 text-left">
                <p className="text-sm text-slate-500">Order ID</p>
                <p className="font-mono text-lg font-semibold">{placedOrder.orderNumber || `ORD-${placedOrder.id.slice(0, 8)}`}</p>
              </div>
              <div className="mt-6 flex gap-4 justify-center">
                <Button onClick={() => navigate('/')} className="btn-primary">
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Payment" />
      <div className="container-app py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-2xl font-bold text-primary-950">Select Payment Method</h1>
          <p className="mt-2 text-slate-600">Choose your preferred payment option</p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Payment Methods */}
            <div className="space-y-4">
              <h2 className="font-semibold text-primary-950">Payment Options</h2>

              {/* COD Option */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`card cursor-pointer border-2 transition-all ${
                  paymentMethod === 'cod' ? 'border-primary-600 bg-primary-50' : 'border-slate-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-center gap-4 p-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    paymentMethod === 'cod' ? 'bg-primary-600 text-white' : 'bg-surface-100 text-slate-600'
                  }`}>
                    <Truck className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary-950">Cash on Delivery</h3>
                    <p className="text-sm text-slate-600">Pay when you receive your order</p>
                  </div>
                  <div className={`h-6 w-6 rounded-full border-2 ${
                    paymentMethod === 'cod' ? 'border-primary-600 bg-primary-600' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'cod' && <div className="mt-1 ml-1 h-2 w-2 rounded-full bg-white" />}
                  </div>
                </div>
              </div>

              {/* Online Payment Option */}
              <div
                onClick={() => setPaymentMethod('online')}
                className={`card cursor-pointer border-2 transition-all ${
                  paymentMethod === 'online' ? 'border-primary-600 bg-primary-50' : 'border-slate-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-center gap-4 p-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    paymentMethod === 'online' ? 'bg-primary-600 text-white' : 'bg-surface-100 text-slate-600'
                  }`}>
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary-950">Online Payment</h3>
                    <p className="text-sm text-slate-600">Pay securely with UPI, Card, or Net Banking</p>
                  </div>
                  <div className={`h-6 w-6 rounded-full border-2 ${
                    paymentMethod === 'online' ? 'border-primary-600 bg-primary-600' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'online' && <div className="mt-1 ml-1 h-2 w-2 rounded-full bg-white" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="card p-6">
              <h2 className="font-semibold text-primary-950">Order Summary</h2>
              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-surface-100">
                      <span className="text-xs text-slate-500">IMG</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-primary-950">{item.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2 border-t border-slate-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax (18%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary-950">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={orderMutation.isLoading}
                className="btn-primary mt-6 w-full"
              >
                {orderMutation.isLoading ? 'Processing...' : `Pay ${formatPrice(total)}`}
              </Button>

              <p className="mt-4 text-center text-xs text-slate-500">
                By placing this order, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
