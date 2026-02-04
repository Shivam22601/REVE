import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../config/api';
import { productAPI } from '../../config/api';

const AdminProductForm = ({ onClose, onCreated, product }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [features, setFeatures] = useState('');
  const [stock, setStock] = useState(0);
  const [flipkartLink, setFlipkartLink] = useState('');
  const [category, setCategory] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
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
    setFlipkartLink(product.flipkartLink || '');
    setCategory(product.category?._id || product.category || '');
    setSortOrder(product.sortOrder !== undefined ? Number(product.sortOrder) : 0);
    setFeatures(Array.isArray(product.features) ? product.features.join('\n') : (product.features || ''));
    setImages(product.images || []); // Keep existing images
    setError('');
  }, [product]);

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true
    }));
    setImages([...images, ...newFiles]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const moveImage = (index, direction) => {
    const newImages = [...images];
    if (direction === 'up' && index > 0) {
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
    } else if (direction === 'down' && index < newImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    }
    setImages(newImages);
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
    if (flipkartLink) form.append('flipkartLink', flipkartLink);
    form.append('sortOrder', String(sortOrder));
    
    // Prepare image layout and files
    const imageLayout = [];
    const newFiles = [];
    
    images.forEach((img) => {
      if (img.isNew) {
        // It's a new file
        imageLayout.push({ type: 'new', index: newFiles.length });
        newFiles.push(img.file);
      } else {
        // It's an existing image
        imageLayout.push({ type: 'existing', url: img.url, publicId: img.publicId });
      }
    });

    form.append('imageLayout', JSON.stringify(imageLayout));
    newFiles.forEach((file) => form.append('images', file));

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

          <input
            className="border p-2 rounded"
            placeholder="Flipkart Link (Optional)"
            type="url"
            value={flipkartLink}
            onChange={(e) => setFlipkartLink(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Display Order (lower shows first)"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
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

          {images.length > 0 && (
            <div className="border p-2 rounded">
              <h3 className="font-medium mb-2">Images ({images.length})</h3>
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, index) => (
                  <div key={index} className="relative group border rounded p-1">
                    <img
                      src={img.url || img.preview}
                      alt={`Image ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600 flex items-center justify-center z-10"
                      title="Remove"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-1 left-1 right-1 flex justify-between bg-black/50 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => moveImage(index, 'up')}
                        disabled={index === 0}
                        className="text-white hover:text-pink-300 disabled:opacity-30 px-1"
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(index, 'down')}
                        disabled={index === images.length - 1}
                        className="text-white hover:text-pink-300 disabled:opacity-30 px-1"
                        title="Move Down"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
