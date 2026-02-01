import React, { useState } from 'react';
import { adminAPI } from '../../config/api';

const AddCategoryForm = ({ categories = [], onCreated }) => {
  const [name, setName] = useState('');
  const [parent, setParent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError('');
    if (!name) {
      setError('Name is required');
      return;
    }
    setLoading(true);
    try {
      await adminAPI.createCategory({ name, parent: parent || undefined });
      if (onCreated) onCreated();
    } catch (err) {
      setError(err.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {error && <div className="text-red-600">{error}</div>}
      <input
        className="border p-2 rounded"
        placeholder="Category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select value={parent} onChange={(e) => setParent(e.target.value)} className="border p-2 rounded">
        <option value="">No parent</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>
      <div className="flex gap-2 justify-end">
        <button
          type="submit"
          className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default AddCategoryForm;
