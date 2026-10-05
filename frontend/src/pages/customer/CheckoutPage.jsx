import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import orderService from '../../services/orderService';
import { getImageUrl } from '../../utils/imageHelper';
import { ShieldCheck, Truck, CreditCard, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

const CheckoutPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { cartItems, subtotal, clearCart, showToast } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shippingAddress1: user?.street || '',
    shippingAddress2: user?.apartment || '',
    city: user?.city || '',
    zip: user?.zip || '',
    country: user?.country || 'USA',
    phone: user?.phone || '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const shippingCost = subtotal > 100 ? 0 : 15;
  const grandTotal = subtotal + shippingCost;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Build order items array strictly matching OrderItem model
      const orderItems = cartItems.map((item) => ({
        quantity: item.quantity,
        product: item.product.id || item.product._id,
      }));

      const orderData = {
        orderItems,
        shippingAddress1: formData.shippingAddress1,
        shippingAddress2: formData.shippingAddress2,
        city: formData.city,
        zip: formData.zip,
        country: formData.country,
        phone: formData.phone,
        status: 'Pending',
        user: user?.id || user?._id || undefined,
      };

      const createdOrder = await orderService.createOrder(orderData);

      if (createdOrder) {
        clearCart();
        showToast('Order placed successfully!', 'success');
        const orderId = createdOrder.id || createdOrder._id;
        navigate(`/order-success/${orderId}`, { state: { order: createdOrder } });
      }
    } catch (err) {
      console.error('Checkout failed:', err);
      setError(err.response?.data?.message || err.response?.data || 'Failed to place order. Check required fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Checkout
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete shipping details to finalize order
          </p>
        </div>
        <Link to="/cart" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium rounded-2xl">
          {error}
        </div>
      )}

      {/* Main Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Shipping Form */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Truck className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">Shipping & Delivery Details</h3>
          </div>

          <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Country *</label>
                <input
                  type="text"
                  name="country"
                  required
                  placeholder="United States"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Street Address Line 1 *</label>
              <input
                type="text"
                name="shippingAddress1"
                required
                placeholder="123 Shopping Blvd"
                value={formData.shippingAddress1}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Street Address Line 2 (Optional)</label>
              <input
                type="text"
                name="shippingAddress2"
                placeholder="Apt 4B, Suite 100"
                value={formData.shippingAddress2}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="New York"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Zip / Postal Code *</label>
                <input
                  type="text"
                  name="zip"
                  required
                  placeholder="10001"
                  value={formData.zip}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>
            </div>

            {/* Payment Method Option */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-indigo-600" /> Payment Method
              </label>
              <div className="p-4 bg-indigo-50/60 border border-indigo-200/80 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Cash on Delivery / Direct API Order</p>
                    <p className="text-[11px] text-slate-500">Pay upon package arrival</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600">Selected</span>
              </div>
            </div>
          </form>
        </div>

        {/* Right: Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs h-fit space-y-6">
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
            Items in Order ({cartItems.length})
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item) => {
              const product = item.product;
              return (
                <div key={product.id || product._id} className="flex items-center gap-3 text-xs">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{product.name}</p>
                    <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-slate-900">
                    ${(parseFloat(product.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-semibold text-slate-900">${shippingCost.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline text-sm">
              <span className="font-bold text-slate-900">Total Due</span>
              <span className="text-xl font-black text-indigo-600">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={submitting}
            className={`w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all hover:scale-[1.01] ${
              submitting ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            {submitting ? (
              <span>Processing Order...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Place Order Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
