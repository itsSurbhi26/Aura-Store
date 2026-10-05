import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto border-t border-slate-800">
      
      {/* Value Proposition Highlights */}
      <div className="border-b border-slate-800 py-10 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Express Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Fast & reliable shipping on all orders</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">100% Authentic</h4>
              <p className="text-xs text-slate-400 mt-0.5">Genuine products directly from brands</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Easy Returns</h4>
              <p className="text-xs text-slate-400 mt-0.5">Hassle-free 30-day return policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Brand info */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">AuraStore</span>
          </Link>
          <p className="text-xs leading-relaxed text-slate-400">
            Your destination for premium products, top technology, lifestyle essentials, and curated fashion.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-4">Quick Links</h3>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/products" className="hover:text-white transition-colors">Product Catalog</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors">My Cart</Link></li>
            <li><Link to="/orders" className="hover:text-white transition-colors">Order History</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-4">Account</h3>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
            <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
            <li><Link to="/admin" className="hover:text-indigo-400 transition-colors">Admin Dashboard</Link></li>
          </ul>
        </div>

        {/* Contact & Support */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-4">Customer Support</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Have questions about your order or products?
          </p>
          <div className="text-xs text-indigo-400 font-mono">support@aurastore.com</div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} AuraStore E-Commerce. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="text-slate-300 font-semibold">Node.js Express & React API</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
