import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import { getImageUrl } from '../../utils/imageHelper';
import { Package, Calendar, MapPin, Clock, ArrowRight, ShoppingBag } from 'lucide-react';

const UserOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await orderService.getUserOrders(user.id);
        setOrders(res || []);
      } catch (err) {
        console.error('Failed to fetch user orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-500 font-medium">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Orders Placed Yet</h2>
        <p className="text-xs text-slate-500">
          You haven't placed any orders with this account yet.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-2xl shadow-md shadow-indigo-200"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const s = (status || 'Pending').toLowerCase();
    if (s.includes('delivered')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s.includes('shipped')) return 'bg-sky-50 text-sky-700 border-sky-200';
    if (s.includes('cancelled')) return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Order History
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track and review your past purchases
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => {
          const orderId = order.id || order._id;
          const dateStr = new Date(order.dateOrdered || Date.now()).toLocaleDateString();

          return (
            <div
              key={orderId}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden"
            >
              {/* Order Header Bar */}
              <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <div>
                    <span className="block font-medium text-slate-400">Order Placed</span>
                    <span className="font-bold text-slate-900">{dateStr}</span>
                  </div>
                  <div>
                    <span className="block font-medium text-slate-400">Total Price</span>
                    <span className="font-bold text-slate-900">${parseFloat(order.totalPrice || 0).toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="block font-medium text-slate-400">Order ID</span>
                    <span className="font-mono font-semibold text-slate-800">{orderId}</span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusBadge(order.status)}`}
                >
                  {order.status || 'Pending'}
                </span>
              </div>

              {/* Order Items */}
              <div className="p-4 sm:p-6 space-y-4">
                {order.orderItems?.map((item, idx) => {
                  const prod = item.product;
                  if (!prod) return null;

                  return (
                    <div key={idx} className="flex items-center gap-4 text-xs">
                      <img
                        src={getImageUrl(prod.image)}
                        alt={prod.name || 'Product'}
                        className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${prod.id || prod._id}`}
                          className="font-bold text-slate-900 text-sm hover:text-indigo-600 line-clamp-1"
                        >
                          {prod.name || 'Product Item'}
                        </Link>
                        <p className="text-slate-400 mt-0.5">Quantity: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-slate-900 text-sm">
                        ${(parseFloat(prod.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Shipping info footer */}
              <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span className="truncate">
                  Deliver to: <strong>{order.city}, {order.country}</strong> ({order.phone})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserOrdersPage;
