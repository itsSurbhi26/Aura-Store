import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import categoryService from '../../services/categoryService';
import { useCart } from '../../context/CartContext';
import { Layers, Plus, Edit2, Trash2, X, Tag } from 'lucide-react';

const AdminCategoriesPage = () => {
  const { showToast } = useCart();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    color: '#4f46e5',
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getCategories();
      setCategories(data || []);
    } catch (e) {
      console.error('Failed to load categories:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAddModal = () => {
    setFormData({ name: '', icon: '', color: '#4f46e5' });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      icon: cat.icon || '',
      color: cat.color || '#4f46e5',
    });
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await categoryService.createCategory(formData);
      showToast('Category created!', 'success');
      setIsAddModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error('Failed to create category:', err);
      alert(err.response?.data || 'Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const id = editingCategory.id || editingCategory._id;
    setSubmitting(true);
    try {
      await categoryService.updateCategory(id, formData);
      showToast('Category updated!', 'success');
      setIsEditModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error('Failed to update category:', err);
      alert(err.response?.data || 'Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoryService.deleteCategory(id);
      showToast('Category deleted', 'info');
      fetchCategories();
    } catch (e) {
      console.error('Failed to delete category', e);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 pb-12">
      <AdminHeader title="Category Administration" subtitle="Organize store departments and taxonomy" />

      <main className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        
        {/* Controls Bar */}
        <div className="flex items-center justify-between bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Store Categories</h3>
            <p className="text-xs text-slate-500">Total {categories.length} categories defined</p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-indigo-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create Category</span>
          </button>
        </div>

        {/* Categories Grid Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Icon Preview</th>
                <th className="py-4 px-6">Category Name</th>
                <th className="py-4 px-4">Brand Color</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400">Loading categories...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400">No categories found.</td>
                </tr>
              ) : (
                categories.map((cat) => {
                  const id = cat.id || cat._id;
                  return (
                    <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-6">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                          style={{ backgroundColor: cat.color || '#4f46e5' }}
                        >
                          <Tag className="w-5 h-5" />
                        </div>
                      </td>
                      <td className="py-3 px-6 font-bold text-slate-900 text-sm">
                        {cat.name}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                          <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: cat.color }} />
                          {cat.color}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(cat)}
                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                            title="Edit category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(id)}
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete category"
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
      </main>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-base">Create Category</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electronics"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Icon Key (Optional)</label>
                <input
                  type="text"
                  placeholder="phone / laptop / fashion"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Brand Color Hex</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-md transition-colors"
              >
                {submitting ? 'Saving Category...' : 'Save Category'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-base">Edit Category</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Brand Color Hex</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-md transition-colors"
              >
                {submitting ? 'Updating...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
