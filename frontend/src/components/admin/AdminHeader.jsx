import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, User } from 'lucide-react';

const AdminHeader = ({ title, subtitle }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200/80 px-8 py-5 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-semibold text-indigo-900">Admin Mode</span>
        </div>

        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">{user?.name || 'Admin User'}</p>
            <p className="text-[10px] text-slate-500">{user?.email || 'admin@store.com'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
