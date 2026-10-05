import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/imageHelper';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Plus, Minus } from 'lucide-react';

const CartPage = () => {
  const { cartItems, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Looks like you haven't added any items to your shopping cart yet.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-2xl shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02]"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const shippingCost = subtotal > 100 ? 0 : 15;
  const grandTotal = subtotal + shippingCost;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review items and proceed to checkout
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
        >
          Clear Cart
        </button>
      </div>

      {/* Main Cart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const product = item.product;
            const productId = product.id || product._id;

            return (
              <div
                key={productId}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
              >
                {/* Image */}
                <Link to={`/products/${productId}`} className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <Link to={`/products/${productId}`}>
                    <h3 className="font-semibold text-slate-900 text-sm hover:text-indigo-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-400 font-medium">
                    {product.brand ? `Brand: ${product.brand}` : 'Item'}
                  </p>
                  <span className="text-sm font-bold text-slate-900 block sm:hidden">
                    ${parseFloat(product.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 px-1">
                  <button
                    onClick={() => updateQuantity(productId, item.quantity - 1)}
                    className="p-1.5 text-slate-600 hover:text-slate-900"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(productId, item.quantity + 1)}
                    className="p-1.5 text-slate-600 hover:text-slate-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Item Total */}
                <div className="hidden sm:block text-right">
                  <span className="text-sm font-bold text-slate-900 block">
                    ${(parseFloat(product.price || 0) * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] text-slate-400">${product.price} each</span>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeItem(productId)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}

          <div className="pt-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs h-fit space-y-6">
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Shipping Fee</span>
              {shippingCost === 0 ? (
                <span className="font-bold text-emerald-600">FREE</span>
              ) : (
                <span className="font-semibold text-slate-900">${shippingCost.toFixed(2)}</span>
              )}
            </div>

            {shippingCost > 0 && (
              <p className="text-[11px] text-slate-400 italic">
                Add ${(100 - subtotal).toFixed(2)} more for Free Shipping!
              </p>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline text-sm">
              <span className="font-bold text-slate-900">Total</span>
              <span className="text-2xl font-black text-indigo-600">
                ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all hover:scale-[1.01] active:scale-[0.98]"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
