import React, { useEffect, useState } from 'react'
import { adminAPI } from '../../config/api'
import toast from 'react-hot-toast'

const ReturnRequests = () => {
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReturn, setSelectedReturn] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchReturns()
  }, [])

  const fetchReturns = async () => {
    try {
      const data = await adminAPI.getReturnRequests()
      setReturns(Array.isArray(data) ? data : (data?.returns || []))
    } catch (error) {
      console.error('Failed to fetch returns:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (returnId, status, refundAmount = 0, adminNotes = '') => {
    try {
      setActionLoading(true)
      await adminAPI.updateReturnStatus(returnId, { status, refundAmount, adminNotes })
      await fetchReturns()
      setSelectedReturn(null)
    } catch (error) {
      toast.error('Failed to update return status')
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700'
      case 'rejected': return 'bg-red-100 text-red-700'
      case 'completed': return 'bg-blue-100 text-blue-700'
      default: return 'bg-yellow-100 text-yellow-700'
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Return Requests</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Order #</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Items</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {returns.map((returnReq) => (
              <tr key={returnReq._id} className="border-t">
                <td className="px-4 py-3">{returnReq.order?.orderNumber || returnReq.order?._id?.slice(-8) || '—'}</td>
                <td className="px-4 py-3">{returnReq.user?.name || returnReq.user?.email || '—'}</td>
                <td className="px-4 py-3">
                  {(returnReq.items || []).map((item, idx) => (
                    <div key={idx} className="text-sm">
                      {item.product?.name || 'Unknown Product'} (x{item.quantity}) - {item.reason}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(returnReq.status)}`}>
                    {returnReq.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(returnReq.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {returnReq.status === 'pending' && (
                    <div className="space-x-2">
                      <button
                        onClick={() => setSelectedReturn(returnReq)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                      >
                        Review
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedReturn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Review Return Request</h2>

            <div className="mb-4">
              <h3 className="font-semibold">Order: {selectedReturn.order?.orderNumber || selectedReturn.order?._id?.slice(-8) || '—'}</h3>
              <p>Customer: {selectedReturn.user?.name || selectedReturn.user?.email || '—'}</p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Items to Return:</h4>
              {(selectedReturn.items || []).map((item, idx) => (
                <div key={idx} className="border p-3 rounded mb-2">
                  <p><strong>Product:</strong> {item.product?.name || 'Unknown Product'}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>Reason:</strong> {item.reason}</p>
                  {item.description && <p><strong>Description:</strong> {item.description}</p>}
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleStatusUpdate(selectedReturn._id, 'approved')}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedReturn._id, 'rejected')}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Reject
              </button>
              <button
                onClick={() => setSelectedReturn(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReturnRequests