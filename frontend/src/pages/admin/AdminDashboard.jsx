import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminHeader from '../../components/admin/AdminHeader';
import userService from '../../services/userService';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import orderService from '../../services/orderService';
import {
  Users,
  Package,
  Layers,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Plus
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    productCount: 0,
    categoryCount: 0,
    orderCount: 0,
    totalSales: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        const [usersRes, prodsRes, catsRes, ordersRes, salesRes] = await Promise.allSettled([
          userService.getUserCount(),
          productService.getProductCount(),
          categoryService.getCategories(),
          orderService.getOrderCount(),
          orderService.getTotalSales(),
        ]);

        setStats({
          userCount: usersRes.status === 'fulfilled' ? usersRes.value?.userCount || 0 : 0,
          productCount: prodsRes.status === 'fulfilled' ? prodsRes.value?.productCount || 0 : 0,
          categoryCount: catsRes.status === 'fulfilled' ? (catsRes.value || []).length : 0,
          orderCount: ordersRes.status === 'fulfilled' ? ordersRes.value?.orderCount || 0 : 0,
          totalSales: salesRes.status === 'fulfilled' ? salesRes.value?.totalsales || 0 : 0,
        });
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${parseFloat(stats.totalSales).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    },
    {
      title: 'Total Orders',
      value: stats.orderCount,
      icon: ShoppingBag,
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
      link: '/admin/orders',
    },
    {
      title: 'Products in Store',
      value: stats.productCount,
      icon: Package,
      color: 'bg-sky-500/10 text-sky-600 border-sky-200',
      link: '/admin/products',
    },
    {
      title: 'Categories',
      value: stats.categoryCount,
      icon: Layers,
      color: 'bg-amber-500/10 text-amber-600 border-amber-200',
      link: '/admin/categories',
    },
    {
      title: 'Registered Users',
      value: stats.userCount,
      icon: Users,
      color: 'bg-purple-500/10 text-purple-600 border-purple-200',
      link: '/admin/users',
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 pb-12">
      <AdminHeader title="Dashboard Overview" subtitle="System analytics and store performance" />

      <main className="p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div className={`p-2.5 rounded-2xl border ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-slate-900">
                    {loading ? '...' : card.value}
                  </span>
                  {card.link && (
                    <Link
                      to={card.link}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
                    >
                      Manage <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Shortcuts */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Quick Administration Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-200 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </Link>

            <Link
              to="/admin/categories"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Category</span>
            </Link>

            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-indigo-600" />
              <span>Manage Store Orders</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
