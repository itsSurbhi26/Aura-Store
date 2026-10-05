import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import orderService from '../../services/orderService';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/imageHelper';
import { ShoppingBag, Eye, Trash2, Edit3, X, CheckCircle2 } from 'lucide-react';

const AdminOrdersPage = () => {
  const { showToast } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status update modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('Pending');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data || []);
    } catch (e) {
      console.error('Failed to load orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || 'Pending');
    setIsStatusModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    const id = selectedOrder.id || selectedOrder._id;

    setSubmitting(true);
    try {
      await orderService.updateOrderStatus(id, newStatus);
      showToast(`Order status updated to ${newStatus}`, 'success');
      setIsStatusModalOpen(false);
      fetchOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert(err.response?.data || 'Failed to update order status');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await orderService.deleteOrder(id);
      showToast('Order deleted', 'info');
      fetchOrders();
    } catch (e) {
      console.error('Failed to delete order:', e);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || 'Pending').toLowerCase();
    if (s.includes('delivered')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s.includes('shipped') || s.includes('processed')) return 'bg-sky-50 text-sky-700 border-sky-200';
    if (s.includes('cancelled')) return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 pb-12">
      <AdminHeader title="Order Administration" subtitle="Track customer orders and fulfillments" />

      <main className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        
        {/* Controls Bar */}
        <div className="flex items-center justify-between bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-base">All Customer Orders</h3>
            <p className="text-xs text-slate-500">Total {orders.length} orders placed</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-4">Customer</th>
                  <th className="py-4 px-4">Total Price</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">Loading orders...</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">No orders found.</td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const id = order.id || order._id;
                    const customerName = order.user?.name || 'Guest User';
                    const dateStr = new Date(order.dateOrdered || Date.now()).toLocaleDateString();

                    return (
                      <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-6 font-mono font-semibold text-slate-900">
                          {id}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {customerName}
                          <span className="block text-[11px] font-normal text-slate-400">{order.phone}</span>
                        </td>
                        <td className="py-3 px-4 font-black text-slate-900">
                          ${parseFloat(order.totalPrice || 0).toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border ${getStatusBadge(order.status)}`}>
                            {order.status || 'Pending'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">{dateStr}</td>
                        <td className="py-3 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenStatusModal(order)}
                              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                              title="Update Status"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteOrder(id)}
                              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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

      {/* Update Status Modal */}
      {isStatusModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-base">Update Order Status</h3>
              <button onClick={() => setIsStatusModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Order Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processed">Processed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-md transition-colors"
              >
                {submitting ? 'Updating Status...' : 'Save Order Status'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
