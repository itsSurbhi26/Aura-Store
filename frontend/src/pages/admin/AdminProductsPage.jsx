import React, { useState, useEffect } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import { getImageUrl } from '../../utils/imageHelper';
import { useCart } from '../../context/CartContext';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  X,
  Search,
  CheckCircle2,
  Upload
} from 'lucide-react';

const AdminProductsPage = () => {
  const { showToast } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    richDescription: '',
    brand: '',
    price: 0,
    category: '',
    countInStock: 10,
    rating: 4.5,
    numReviews: 0,
    isFeatured: false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories(),
      ]);
      setProducts(prods || []);
      setCategories(cats || []);
    } catch (e) {
      console.error('Failed to load products/categories:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const handleOpenAddModal = async () => {
    let latestCats = categories;
    try {
      const cats = await categoryService.getCategories();
      if (Array.isArray(cats) && cats.length > 0) {
        latestCats = cats;
        setCategories(cats);
      }
    } catch (e) {
      console.error('Failed to reload categories', e);
    }

    const defaultCatId = latestCats[0] ? (latestCats[0].id || latestCats[0]._id) : '';

    setFormData({
      name: '',
      description: '',
      richDescription: '',
      brand: '',
      price: 0,
      category: defaultCatId,
      countInStock: 10,
      rating: 4.5,
      numReviews: 0,
      isFeatured: false,
    });
    setImageFile(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || '',
      description: prod.description || '',
      richDescription: prod.richDescription || '',
      brand: prod.brand || '',
      price: prod.price || 0,
      category: prod.category?.id || prod.category?._id || prod.category || '',
      countInStock: prod.countInStock || 0,
      rating: prod.rating || 0,
      numReviews: prod.numReviews || 0,
      isFeatured: prod.isFeatured || false,
      image: prod.image || '',
    });
    setIsEditModalOpen(true);
  };

  const handleOpenGalleryModal = (prod) => {
    setEditingProduct(prod);
    setGalleryFiles([]);
    setIsGalleryModalOpen(true);
  };

  // Handle Add Product Submit (Multipart FormData)
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
      alert('Please select a category');
      return;
    }
    if (!imageFile) {
      alert('Please select a main product image');
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('description', formData.description);
      fd.append('richDescription', formData.richDescription);
      fd.append('brand', formData.brand);
      fd.append('price', formData.price);
      fd.append('category', formData.category);
      fd.append('countInStock', formData.countInStock);
      fd.append('rating', formData.rating);
      fd.append('numReviews', formData.numReviews);
      fd.append('isFeatured', formData.isFeatured);
      fd.append('image', imageFile);

      await productService.createProduct(fd);
      showToast('Product created successfully!', 'success');
      setIsAddModalOpen(false);
      fetchProductsAndCategories();
    } catch (err) {
      console.error('Failed to create product:', err);
      alert(err.response?.data?.message || err.response?.data || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Edit Product Submit (JSON update)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const prodId = editingProduct.id || editingProduct._id;
    setSubmitting(true);
    try {
      await productService.updateProduct(prodId, formData);
      showToast('Product updated successfully!', 'success');
      setIsEditModalOpen(false);
      fetchProductsAndCategories();
    } catch (err) {
      console.error('Failed to update product:', err);
      alert(err.response?.data || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Upload Gallery Images (Multipart FormData)
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if (galleryFiles.length === 0) return;
    const prodId = editingProduct.id || editingProduct._id;

    setSubmitting(true);
    try {
      const fd = new FormData();
      Array.from(galleryFiles).forEach((file) => {
        fd.append('images', file);
      });

      await productService.uploadGalleryImages(prodId, fd);
      showToast('Gallery images updated!', 'success');
      setIsGalleryModalOpen(false);
      fetchProductsAndCategories();
    } catch (err) {
      console.error('Failed to upload gallery:', err);
      alert(err.response?.data || 'Failed to upload images');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      showToast('Product deleted', 'info');
      fetchProductsAndCategories();
    } catch (e) {
      console.error('Failed to delete product', e);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 pb-12">
      <AdminHeader title="Product Administration" subtitle="Manage store inventory and catalog" />

      <main className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 text-slate-800 text-xs rounded-xl border border-transparent focus:border-indigo-400 focus:bg-white outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={handleOpenAddModal}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-indigo-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Product Data Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Stock</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">Loading products...</td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">No products found.</td>
                  </tr>
                ) : (
                  filteredProducts.map((prod) => {
                    const id = prod.id || prod._id;
                    const catName = prod.category?.name || 'Uncategorized';

                    return (
                      <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={getImageUrl(prod.image)}
                              alt={prod.name}
                              className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border"
                            />
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1">{prod.name}</p>
                              <p className="text-[11px] text-slate-400">{prod.brand || 'No brand'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                            {catName}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          ${parseFloat(prod.price || 0).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          <span className={prod.countInStock > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                            {prod.countInStock} units
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {prod.isFeatured ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                              <Sparkles className="w-3 h-3" /> Featured
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Standard</span>
                          )}
                        </td>
                        <td className="py-3 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenGalleryModal(prod)}
                              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                              title="Upload Gallery Images"
                            >
                              <ImageIcon className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleOpenEditModal(prod)}
                              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(id)}
                              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                              title="Delete product"
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

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-lg">Add New Product</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="">
                      {categories.length === 0 ? '-- No Categories Available --' : 'Select Category'}
                    </option>
                    {categories.map((c) => {
                      const catId = c.id || c._id;
                      return (
                        <option key={catId} value={catId}>
                          {c.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Count In Stock (0 - 255) *</label>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    required
                    value={formData.countInStock}
                    onChange={(e) => setFormData({ ...formData, countInStock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Main Product Image File *</label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Short Description *</label>
                <textarea
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
                <label htmlFor="isFeatured" className="font-semibold text-slate-700 cursor-pointer">
                  Feature this product on homepage spotlight
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-md transition-colors"
              >
                {submitting ? 'Saving Product...' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-lg">Edit Product Details</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:ring-2 focus:ring-indigo-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c._id} value={c.id || c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Stock (0-255)</label>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={formData.countInStock}
                    onChange={(e) => setFormData({ ...formData, countInStock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Short Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeaturedEdit"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
                <label htmlFor="isFeaturedEdit" className="font-semibold text-slate-700 cursor-pointer">
                  Feature on homepage spotlight
                </label>
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

      {/* Gallery Images Upload Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-base">Upload Product Gallery</h3>
              <button onClick={() => setIsGalleryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGallerySubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Select Gallery Files (Max 10)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setGalleryFiles(e.target.files)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || galleryFiles.length === 0}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-md transition-colors disabled:opacity-50"
              >
                {submitting ? 'Uploading Images...' : 'Upload Gallery Images'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
