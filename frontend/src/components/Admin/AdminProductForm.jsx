import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../config/api';
import { productAPI } from '../../config/api';

const AdminProductForm = ({ onClose, onCreated, product }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [features, setFeatures] = useState('');
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await productAPI.getCategories();
        setCategories(data);
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!product) return;
    setName(product.name || '');
    setPrice(product.price !== undefined ? String(product.price) : '');
    setStock(product.stock !== undefined ? Number(product.stock) : 0);
    setCategory(product.category?._id || product.category || '');
    setFeatures(Array.isArray(product.features) ? product.features.join('\n') : (product.features || ''));
    setImages([]);
    setError('');
  }, [product]);

  const handleFiles = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !price) {
      setError('Name and price are required');
      return;
    }

    const form = new FormData();
    form.append('name', name);
    form.append('price', price);
    if (features) form.append('features', features);
    form.append('stock', String(stock));
    if (category) form.append('category', category);
    images.forEach((file) => form.append('images', file));

    setLoading(true);
    try {
      if (product?._id) {
        await adminAPI.updateProduct(product._id, form);
      } else {
        await adminAPI.createProduct(form);
      }
      if (onCreated) onCreated();
    } catch (err) {
      setError(err.message || (product?._id ? 'Failed to update product' : 'Failed to create product'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-2xl p-6 rounded shadow max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{product?._id ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">Close</button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {error && <div className="text-red-600">{error}</div>}

          <input
            className="border p-2 rounded"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <textarea
            className="border p-2 rounded"
            placeholder="Features (one per line or comma separated)"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />

          <select
            className="border p-2 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          <input
            type="file"
            multiple
            onChange={handleFiles}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-pink-600 text-white py-2 rounded hover:bg-pink-700 disabled:opacity-50"
          >
            {loading ? (product?._id ? 'Saving...' : 'Creating...') : (product?._id ? 'Save Changes' : 'Create Product')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;
