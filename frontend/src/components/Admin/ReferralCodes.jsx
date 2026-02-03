import React, { useEffect, useState } from 'react'
import { adminAPI } from '../../config/api'

const ReferralCodes = () => {
  const [codes, setCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 5,
    maxUses: '',
    expiresAt: '',
    description: ''
  })

  useEffect(() => {
    fetchCodes()
  }, [])

  const fetchCodes = async () => {
    try {
      const data = await adminAPI.getReferralCodes()
      setCodes(data)
    } catch (error) {
      console.error('Failed to fetch codes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await adminAPI.createReferralCode({
        ...formData,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
        expiresAt: formData.expiresAt || undefined
      })
      setShowCreateForm(false)
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: 5,
        maxUses: '',
        expiresAt: '',
        description: ''
      })
      fetchCodes()
    } catch (error) {
      console.error('Failed to create referral code:', error)
      alert('Failed to create referral code')
    }
  }

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const openCreateForm = () => {
    setFormData({
      code: generateCode(),
      discountType: 'percentage',
      discountValue: 5,
      maxUses: '',
      expiresAt: '',
      description: ''
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this referral code?')) return
    try {
      await adminAPI.deleteReferralCode(id)
      fetchCodes()
    } catch (error) {
      console.error('Failed to delete referral code:', error)
      alert('Failed to delete referral code')
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Referral Codes</h1>
        <button
          onClick={openCreateForm}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Create Code
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Create Referral Code</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="flex-1 p-2 border rounded"
                  required
                />
                <button
                  type="button"
                  onClick={() => setFormData({...formData, code: generateCode()})}
                  className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  title="Generate new code"
                >
                  🔄
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Discount Type</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Discount Value ({formData.discountType === 'percentage' ? '%' : '$'})
              </label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({...formData, discountValue: parseFloat(e.target.value)})}
                className="w-full p-2 border rounded"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Max Uses (leave empty for unlimited)</label>
              <input
                type="number"
                value={formData.maxUses}
                onChange={(e) => setFormData({...formData, maxUses: e.target.value})}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Expires At (optional)</label>
              <input
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Discount</th>
              <th className="px-4 py-3 text-left">Uses</th>
              <th className="px-4 py-3 text-left">Expires</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((code) => (
              <tr key={code._id} className="border-t">
                <td className="px-4 py-3 font-mono">{code.code}</td>
                <td className="px-4 py-3">
                  {code.discountType === 'percentage' ? `${code.discountValue}%` : `₹${code.discountValue}`}
                </td>
                <td className="px-4 py-3">
                  {code.usedCount}/{code.maxUses || '∞'}
                </td>
                <td className="px-4 py-3">
                  {code.expiresAt ? new Date(code.expiresAt).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    code.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {code.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(code._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ReferralCodes