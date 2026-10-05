import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/imageHelper';
import { ShoppingBag, Star, Sparkles, Check } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  if (!product) return null;

  const productId = product.id || product._id;
  const isOutOfStock = product.countInStock <= 0;
  const categoryName = product.category?.name || 'General';
  const ratingVal = parseFloat(product.rating) || 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Featured Badge */}
      {product.isFeatured && (
        <div className="absolute top-3 left-3 z-10 bg-indigo-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
          <Sparkles className="w-3 h-3" />
          <span>Featured</span>
        </div>
      )}

      {/* Product Image Container */}
      <Link to={`/products/${productId}`} className="block relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Info Content */}
      <div className="p-5 flex-1 flex flex-col">
        
        {/* Category & Brand */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
          <span className="font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
            {categoryName}
          </span>
          {product.brand && <span className="font-medium text-slate-400">{product.brand}</span>}
        </div>

        {/* Product Title */}
        <Link to={`/products/${productId}`} className="group-hover:text-indigo-600 transition-colors">
          <h3 className="font-semibold text-slate-900 text-base leading-snug line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center text-amber-400">
            <Star className="w-4 h-4 fill-amber-400" />
          </div>
          <span className="text-xs font-bold text-slate-700">{ratingVal > 0 ? ratingVal : '4.5'}</span>
          <span className="text-xs text-slate-400">({product.numReviews || 0} reviews)</span>
        </div>

        {/* Spacer */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-xl font-bold text-slate-900">
              ${parseFloat(product.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            onClick={() => addItem(product, 1)}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-indigo-600 text-white shadow-sm hover:shadow-indigo-200 active:scale-95'
            }`}
            title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
