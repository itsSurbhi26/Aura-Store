import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Smartphone, Shirt, Home, Laptop, Gift, Watch, Compass } from 'lucide-react';

const CategoryCard = ({ category }) => {
  if (!category) return null;

  const categoryId = category.id || category._id;

  // Icon selector based on category name or icon string
  const getCategoryIcon = (iconName, name) => {
    const n = (name || '').toLowerCase();
    if (n.includes('phone') || n.includes('mobile')) return <Smartphone className="w-6 h-6" />;
    if (n.includes('clothing') || n.includes('fashion') || n.includes('apparel')) return <Shirt className="w-6 h-6" />;
    if (n.includes('laptop') || n.includes('computer') || n.includes('tech')) return <Laptop className="w-6 h-6" />;
    if (n.includes('home') || n.includes('furniture')) return <Home className="w-6 h-6" />;
    if (n.includes('watch') || n.includes('accessory')) return <Watch className="w-6 h-6" />;
    if (n.includes('gift')) return <Gift className="w-6 h-6" />;
    return <Tag className="w-6 h-6" />;
  };

  const catColor = category.color || '#4f46e5';

  return (
    <Link
      to={`/products?category=${categoryId}`}
      className="group p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform duration-300"
        style={{ backgroundColor: catColor }}
      >
        {getCategoryIcon(category.icon, category.name)}
      </div>

      <h4 className="font-semibold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
        {category.name}
      </h4>
    </Link>
  );
};

export default CategoryCard;
