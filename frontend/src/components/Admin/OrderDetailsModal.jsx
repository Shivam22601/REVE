import React, { useEffect, useState } from 'react'
import { adminAPI } from '../../config/api'
import toast from 'react-hot-toast'

const OrderDetailsModal = ({ order, onClose, onUpdate, isAdmin = false }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const [editedOrder, setEditedOrder] = useState({
    orderNumber: order?.orderNumber || '',
    totals: {
      subtotal: order?.totals?.subtotal || 0,
      tax: order?.totals?.tax || 0,
      shipping: order?.totals?.shipping || 0,
      discount: order?.totals?.discount || 0,
      grandTotal: order?.totals?.grandTotal || 0
    }
  })

  useEffect(() => {
    setEditedOrder({
      orderNumber: order?.orderNumber || '',
      totals: {
        subtotal: order?.totals?.subtotal || 0,
        tax: order?.totals?.tax || 0,
        shipping: order?.totals?.shipping || 0,
        discount: order?.totals?.discount || 0,
        grandTotal: order?.totals?.grandTotal || 0
      }
    })
  }, [order])

  useEffect(() => {
    if (isAdmin && isEditing) {
      const { subtotal, tax, shipping, discount } = editedOrder.totals
      setEditedOrder(prev => ({
        ...prev,
        totals: {
          ...prev.totals,
          grandTotal: subtotal + tax + shipping - discount
        }
      }))
    }
  }, [
    editedOrder.totals.subtotal,
    editedOrder.totals.tax,
    editedOrder.totals.shipping,
    editedOrder.totals.discount,
    isEditing,
    isAdmin
  ])

  if (!isAdmin || !order) return null

  const handleInputChange = (field, value) => {
    if (field.startsWith('totals.')) {
      const key = field.split('.')[1]
      setEditedOrder(prev => ({
        ...prev,
        totals: { ...prev.totals, [key]: Number(value) || 0 }
      }))
    } else {
      setEditedOrder(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const updated = await adminAPI.updateOrderDetails(order._id, editedOrder)
      onUpdate?.(updated)
      setIsEditing(false)
    } catch {
      toast.error('Failed to update order')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!window.confirm('Cancel this order?')) return
    try {
      setCancelling(true)
      await adminAPI.updateOrderStatus(order._id, 'cancelled')
      onUpdate()
      onClose()
    } catch {
      toast.error('Failed to cancel order')
    } finally {
      setCancelling(false)
    }
  }

  const statusStyle =
    order.status === 'delivered'
      ? 'bg-green-100 text-green-700'
      : order.status === 'cancelled'
      ? 'bg-red-100 text-red-700'
      : order.status === 'returned'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-yellow-100 text-yellow-700'

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Order Details</h2>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-black">&times;</button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

          {/* Order Info */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm border-b pb-1">Order Info</h3>
            <p className="text-sm"><b>ID:</b> {order._id}</p>

            <div className="text-sm">
              <b>Order Number:</b>
              {isEditing ? (
                <input
                  value={editedOrder.orderNumber}
                  onChange={e => handleInputChange('orderNumber', e.target.value)}
                  className="ml-2 border px-2 py-1 rounded w-32"
                />
              ) : (
                <span className="ml-2">{order.orderNumber || 'N/A'}</span>
              )}
            </div>

            <p className="text-sm"><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</p>

            <span className={`inline-block text-xs px-3 py-1 rounded ${statusStyle}`}>
              {order.status.toUpperCase()}
            </span>
          </div>

          {/* User Info */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm border-b pb-1">Customer</h3>
            <p className="text-sm"><b>Name:</b> {order.user?.name}</p>
            <p className="text-sm"><b>Email:</b> {order.user?.email}</p>
          </div>

          {/* Address */}
          <div className="space-y-2 text-sm">
            <h3 className="font-medium border-b pb-1">Shipping Address</h3>
            {order.shippingAddress ? (
              <>
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.line1}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.country}</p>
                <p><b>Phone:</b> {order.shippingAddress.phone}</p>
              </>
            ) : (
              <p className="text-gray-500">No address</p>
            )}
          </div>

          {/* Payment */}
          <div className="space-y-2 text-sm">
            <h3 className="font-medium border-b pb-1">Payment</h3>
            <p><b>Method:</b> {order.payment?.provider}</p>
            <p><b>Status:</b> {order.payment?.status}</p>
            <p><b>Amount:</b> ₹{(order.payment?.amount || 0).toFixed(2)}</p>
          </div>
        </div>

        {/* Items */}
        <div className="px-6">
          <h3 className="font-medium text-sm border-b pb-2 mb-3">Items</h3>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Product</th>
                <th className="p-2">Price</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td className="p-2">{item.product?.name || 'Unknown Product'}</td>
                  <td className="p-2 text-center">₹{(item.price || 0).toFixed(2)}</td>
                  <td className="p-2 text-center">{item.quantity}</td>
                  <td className="p-2 text-center">₹{((item.price || 0) * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end px-6 mt-6">
          <div className="w-72 text-sm space-y-2 bg-gray-50 p-4 rounded">
            {['subtotal', 'tax', 'shipping', 'discount'].map(key => (
              <div key={key} className="flex justify-between">
                <span className="capitalize">{key}</span>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedOrder.totals[key]}
                    onChange={e => handleInputChange(`totals.${key}`, e.target.value)}
                    className="w-20 text-right border px-1 rounded"
                  />
                ) : (
                  <span>₹{(order.totals?.[key] || 0).toFixed(2)}</span>
                )}
              </div>
            ))}

            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Grand Total</span>
              <span>₹{(isEditing ? editedOrder.totals.grandTotal : order.totals?.grandTotal || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t mt-6">
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-500 text-white rounded">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <>
              <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">
                Close
              </button>
              <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-green-600 text-white rounded">
                Edit
              </button>
              {order.status !== 'cancelled' && order.status !== 'delivered' && order.status !== 'returned' && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsModal
