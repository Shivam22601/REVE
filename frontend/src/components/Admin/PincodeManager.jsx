import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../config/api';
import { Trash2, Plus, MapPin } from 'lucide-react';

const PincodeManager = () => {
  const [pincodes, setPincodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    city: '',
    state: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPincodes();
  }, []);

  const fetchPincodes = async () => {
    try {
      const data = await adminAPI.getPincodes();
      setPincodes(data);
    } catch (error) {
      console.error('Failed to fetch pincodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.code || formData.code.length < 6) {
      setError('Invalid pincode');
      return;
    }
    setError('');
    try {
      await adminAPI.addPincode(formData);
      setShowCreateForm(false);
      setFormData({ code: '', city: '', state: '' });
      fetchPincodes();
    } catch (error) {
      console.error('Failed to add pincode:', error);
      setError(error.message || 'Failed to add pincode');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this pincode?')) return;
    try {
      await adminAPI.deletePincode(id);
      fetchPincodes();
    } catch (error) {
      console.error('Failed to delete pincode:', error);
      alert('Failed to delete pincode');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="w-6 h-6" /> Serviceable Pincodes
        </h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-pink-600 text-white rounded flex items-center gap-2 hover:bg-pink-700"
        >
          <Plus className="w-4 h-4" /> Add Pincode
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Add Serviceable Pincode</h2>
          <form onSubmit={handleCreate} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1">Pincode *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                className="w-full px-3 py-2 border rounded"
                placeholder="110001"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="New Delhi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Delhi"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
              >
                Save Pincode
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 border-b">Pincode</th>
              <th className="p-4 border-b">City</th>
              <th className="p-4 border-b">State</th>
              <th className="p-4 border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pincodes.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No pincodes found. Delivery is not restricted.
                </td>
              </tr>
            ) : (
              pincodes.map((pin) => (
                <tr key={pin._id} className="hover:bg-gray-50">
                  <td className="p-4 border-b font-medium">{pin.code}</td>
                  <td className="p-4 border-b">{pin.city || '-'}</td>
                  <td className="p-4 border-b">{pin.state || '-'}</td>
                  <td className="p-4 border-b text-right">
                    <button
                      onClick={() => handleDelete(pin._id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PincodeManager;
