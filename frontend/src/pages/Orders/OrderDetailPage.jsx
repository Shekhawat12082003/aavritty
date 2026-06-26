import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Truck,
  Package,
  XCircle,
  Download,
  Phone,
  Mail,
} from 'lucide-react';
import SEO from '@/components/common/SEO';
import Button from '@/components/common/Button';
import { formatPrice } from '@/store';
import { STATUS_COLORS } from '@/constants/categories';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services';
import { PageLoader } from '@/components/common/Loader';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getById(orderId),
    enabled: !!orderId,
  });

  if (isLoading) return <PageLoader />;

  if (!order) {
    return (
      <div className="container-app py-20 text-center">
        <Package className="mx-auto h-14 w-14 text-slate-300" />
        <h1 className="mt-4 text-xl font-bold">Order Not Found</h1>
        <Link to="/orders" className="btn-primary mt-4 inline-flex">Back to Orders</Link>
      </div>
    );
  }

  const canCancel = ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status);

  const timeline = [
    { status: 'PENDING', label: 'Order Placed', done: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) },
    { status: 'CONFIRMED', label: 'Order Confirmed', done: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) },
    { status: 'PROCESSING', label: 'Processing', done: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) },
    { status: 'SHIPPED', label: 'Shipped', done: ['SHIPPED', 'DELIVERED'].includes(order.status) },
    { status: 'DELIVERED', label: 'Delivered', done: order.status === 'DELIVERED' },
  ];

  return (
    <>
      <SEO title={`Order ${order.orderNumber}`} />

      <div className="border-b border-slate-200 bg-white">
        <div className="container-app py-6">
          <button
            onClick={() => navigate('/orders')}
            className="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Orders
          </button>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-2xl font-bold text-primary-950">{order.orderNumber}</h1>
                <span className={`badge ${STATUS_COLORS[order.status]}`}>{order.status}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn-secondary !py-2 !text-xs">
                <Download className="h-4 w-4" /> Invoice
              </button>
              {canCancel && (
                <button
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4" /> Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-app py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Timeline */}
            <div className="card p-6">
              <h2 className="font-semibold text-slate-800">Order Timeline</h2>
              <div className="mt-6 space-y-0">
                {timeline.map((step, i) => (
                  <div key={step.status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          step.done ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {step.done ? '✓' : i + 1}
                      </div>
                      {i < timeline.length - 1 && (
                        <div className={`w-0.5 flex-1 min-h-[32px] ${step.done ? 'bg-green-300' : 'bg-slate-200'}`} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={`font-medium ${step.done ? 'text-slate-800' : 'text-slate-400'}`}>{step.label}</p>
                    </div>
                  </div>
                ))}
              </div>
              {order.trackingId && (
                <div className="mt-2 flex items-center gap-2 rounded-xl bg-blue-50 p-3 text-sm text-blue-700">
                  <Truck className="h-4 w-4" />
                  Tracking ID: <strong>{order.trackingId}</strong>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="card p-6">
              <h2 className="font-semibold text-slate-800">Order Items ({order.items?.length || 0})</h2>
              <div className="mt-4 divide-y divide-slate-100">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4">
                    <div className="flex flex-1 flex-col justify-between sm:flex-row">
                      <div>
                        <p className="font-medium text-slate-800">{item.product?.name || 'Product'}</p>
                        <p className="text-xs text-slate-400">SKU: {item.product?.sku || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Qty: {item.quantity}</p>
                        <p className="font-semibold text-primary-700">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-semibold text-slate-800">Order Summary</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">GST (18%)</span><span>{formatPrice(order.taxAmount)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span>{order.shippingAmount === 0 ? 'Free' : formatPrice(order.shippingAmount)}</span></div>
                <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-bold">
                  <span>Total</span><span className="text-primary-700">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="flex items-center gap-2 font-semibold text-slate-800">
                <MapPin className="h-4 w-4 text-primary-600" /> Shipping Address
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {order.shippingAddress?.line1}<br />
                {order.shippingAddress?.line2 && <>{order.shippingAddress.line2}<br /></>}
                {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                PIN: {order.shippingAddress?.pincode}
              </p>
            </div>

            <div className="card p-6">
              <h2 className="flex items-center gap-2 font-semibold text-slate-800">
                <CreditCard className="h-4 w-4 text-primary-600" /> Payment
              </h2>
              <p className="mt-3 text-sm text-slate-600">{order.payments?.[0]?.method || 'Online Payment'}</p>
              <p className="mt-1 text-xs text-slate-400">Status: {order.payments?.[0]?.status || 'Pending'}</p>
            </div>

            <div className="card p-6">
              <h2 className="font-semibold text-slate-800">Customer</h2>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <p className="font-medium">{order.user?.firstName} {order.user?.lastName}</p>
                <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> {order.user?.email}</p>
                <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> {order.user?.phone || 'N/A'}</p>
              </div>
            </div>

            <Link to="/support" className="btn-outline block w-full text-center text-sm">
              Need Help? Contact Support
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
