import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import Toast from '../components/common/Toast';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-100/80">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </div>
      <Toast />
    </div>
  );
};

export default AdminLayout;
