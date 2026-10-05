import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import userService from '../../services/userService';
import { useCart } from '../../context/CartContext';
import { Users, Trash2, ShieldCheck, User as UserIcon } from 'lucide-react';

const AdminUsersPage = () => {
  const { showToast } = useCart();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data || []);
    } catch (e) {
      console.error('Failed to load users:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userService.deleteUser(id);
      showToast('User deleted', 'info');
      fetchUsers();
    } catch (e) {
      console.error('Failed to delete user:', e);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 pb-12">
      <AdminHeader title="User Directory" subtitle="Registered accounts and permissions" />

      <main className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        
        {/* Controls Bar */}
        <div className="flex items-center justify-between bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Registered Users</h3>
            <p className="text-xs text-slate-500">Total {users.length} user accounts</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-4">Phone</th>
                  <th className="py-4 px-4">Location</th>
                  <th className="py-4 px-4">Role</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400">Loading users...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400">No users found.</td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const id = u.id || u._id;
                    const location = [u.city, u.country].filter(Boolean).join(', ') || 'N/A';

                    return (
                      <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                              {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{u.name}</p>
                              <p className="text-[11px] text-slate-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{u.phone || 'N/A'}</td>
                        <td className="py-3 px-4 text-slate-600">{location}</td>
                        <td className="py-3 px-4">
                          {u.isAdmin ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                              <ShieldCheck className="w-3 h-3" /> Administrator
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                              <UserIcon className="w-3 h-3" /> Customer
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-6 text-right">
                          <button
                            onClick={() => handleDeleteUser(id)}
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminUsersPage;
