import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import orderService from '../../services/orderService';
import { CheckCircle2, ShoppingBag, ArrowRight, Package, Calendar, MapPin, Truck } from 'lucide-react';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          const res = await orderService.getOrder(id);
          setOrder(res);
        } catch (e) {
          console.error('Failed to fetch order confirmation', e);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-500 font-medium">Fetching order confirmation...</p>
      </div>
    );
  }

  const orderId = order?.id || order?._id || id;
  const status = order?.status || 'Pending';
  const totalPrice = order?.totalPrice || 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-xs text-slate-500">
            Thank you for shopping with us. Your order has been registered in our system.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl font-mono text-xs text-slate-700">
          <span>Order ID:</span>
          <strong className="text-slate-900">{orderId}</strong>
        </div>
      </div>

      {/* Order Details Box */}
      {order && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" />
              <span>Order Summary</span>
            </h3>
            <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full">
              {status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600">
            <div className="space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-600" /> Shipping Destination
              </span>
              <p>{order.shippingAddress1}</p>
              {order.shippingAddress2 && <p>{order.shippingAddress2}</p>}
              <p>{order.city}, {order.zip}</p>
              <p>{order.country}</p>
              <p className="pt-1 font-semibold text-slate-800">Phone: {order.phone}</p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-600" /> Order Details
              </span>
              <p>Date: {new Date(order.dateOrdered || Date.now()).toLocaleDateString()}</p>
              <p className="pt-2 text-base font-extrabold text-slate-900">
                Total Price: ${parseFloat(totalPrice).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/orders"
          className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-sm"
        >
          <Package className="w-4 h-4" />
          View My Orders
        </Link>

        <Link
          to="/products"
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-indigo-200"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
