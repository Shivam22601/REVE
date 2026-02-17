import React, { useState } from 'react'
import { userAPI, orderAPI } from '../../config/api' // adjust if needed
import toast from 'react-hot-toast'

const UserOrderDetailsModal = ({ order, onClose, onUpdate }) => {
  const [cancelling, setCancelling] = useState(false)
  const [returning, setReturning] = useState(false)
  const [showReturnForm, setShowReturnForm] = useState(false)
  const [returnItems, setReturnItems] = useState([])

  if (!order) return null

  const canCancel =
    order.status !== 'cancelled' && order.status !== 'delivered' && order.status !== 'returned'

  const canReturn = () => {
    if (order.status !== 'delivered') return false
    
    // Check if within 7 days of delivery
    const deliveryDate = new Date(order.updatedAt || order.createdAt)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    return deliveryDate >= sevenDaysAgo
  }

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this order?'
    )
    if (!confirmCancel) return

    try {
      setCancelling(true)
      await userAPI.cancelOrder(order._id)
      onUpdate?.()
      onClose()
    } catch (err) {
      toast.error('Unable to cancel order. Please try again.')
    } finally {
      setCancelling(false)
    }
  }

  const handleReturnRequest = async () => {
    if (!returnItems.length) {
      toast.error('Please select items to return')
      return
    }

    // Filter out items with undefined productId
    const validReturnItems = returnItems.filter(item => item.productId && item.productId !== 'undefined')

    if (!validReturnItems.length) {
      toast.error('No valid items selected for return')
      return
    }

    try {
      setReturning(true)
      await orderAPI.requestReturn(order._id, { items: validReturnItems })
      toast.success('Return request submitted successfully')
      onUpdate?.()
      onClose()
    } catch (err) {
      toast.error('Unable to submit return request. Please try again.')
    } finally {
      setReturning(false)
    }
  }

  const handleItemReturnChange = (productId, checked, reason = '', description = '') => {
    if (!productId || productId === 'undefined') {
      toast.error('Cannot process return for this item - product information is missing')
      return
    }

    if (checked) {
      const item = order.items.find(i => (i.product?._id || i.product) === productId)
      if (!item) {
        toast.error('Item not found in order')
        return
      }
      setReturnItems([...returnItems, {
        productId,
        quantity: item.quantity,
        reason,
        description
      }])
    } else {
      setReturnItems(returnItems.filter(i => i.productId !== productId))
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
          <div>
            <h2 className="text-lg font-semibold">Order Details</h2>
            <span className={`inline-block mt-1 text-xs px-3 py-1 rounded ${statusStyle}`}>
              {order.status.toUpperCase()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black"
          >
            &times;
          </button>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

          {/* Order Info */}
          <div className="space-y-2 text-sm">
            <h3 className="font-medium border-b pb-1">Order Info</h3>
            <p><b>Order ID:</b> {order._id}</p>
            <p><b>Order No:</b> {order.orderNumber || 'N/A'}</p>
            <p><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</p>
          </div>

          {/* User Info */}
          <div className="space-y-2 text-sm">
            <h3 className="font-medium border-b pb-1">Customer</h3>
            <p><b>Name:</b> {order.user?.name}</p>
            <p><b>Email:</b> {order.user?.email}</p>
          </div>

          {/* Shipping */}
          <div className="space-y-2 text-sm">
            <h3 className="font-medium border-b pb-1">Shipping Address</h3>
            {order.shippingAddress ? (
              <>
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.line1}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zip}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p><b>Phone:</b> {order.shippingAddress.phone}</p>
              </>
            ) : (
              <p className="text-gray-500">No address provided</p>
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
          <h3 className="font-medium border-b pb-2 mb-3">Items</h3>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-center">Price</th>
                <th className="p-2 text-center">Qty</th>
                <th className="p-2 text-center">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      {item.product?.images?.[0]?.url && (
                        <img
                          src={item.product.images[0].url}
                          alt=""
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <span>{item.product?.name || 'Unknown Product'}</span>
                    </div>
                  </td>
                  <td className="p-2 text-center">₹{(item.price || 0).toFixed(2)}</td>
                  <td className="p-2 text-center">{item.quantity}</td>
                  <td className="p-2 text-center">
                    ₹{((item.price || 0) * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end px-6 mt-6">
          <div className="w-72 bg-gray-50 p-4 rounded text-sm space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{(order.totals?.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{(order.totals?.tax || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{(order.totals?.shipping || 0).toFixed(2)}</span>
            </div>
            {order.totals?.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{(order.totals.discount || 0).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Grand Total</span>
              <span>₹{(order.totals?.grandTotal || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>

          {canReturn() && (
            <button
              onClick={() => setShowReturnForm(true)}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Request Return
            </button>
          )}

          {canCancel && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>

        {/* Return Form Modal */}
        {showReturnForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-bold mb-4">Request Return</h2>
              <p className="text-sm text-gray-600 mb-4">
                Select the items you want to return and provide a reason.
              </p>

              <div className="space-y-4 mb-6">
                {order.items.map((item, idx) => {
                  const productId = item.product?._id || item.product;
                  const productName = item.product?.name || 'Unknown Product';
                  
                  return (
                    <div key={productId || idx} className="border p-4 rounded">
                      <div className="flex items-center gap-3 mb-2">
                        <input
                          type="checkbox"
                          id={`return-${productId || idx}`}
                          onChange={(e) => handleItemReturnChange(
                            productId,
                            e.target.checked,
                            'defective',
                            ''
                          )}
                          className="w-4 h-4"
                        />
                        <label htmlFor={`return-${productId || idx}`} className="font-medium">
                          {productName} (x{item.quantity})
                        </label>
                      </div>

                      {returnItems.find(r => r.productId === productId) && (
                        <div className="ml-7 space-y-2">
                          <select
                            value={returnItems.find(r => r.productId === productId)?.reason || 'defective'}
                            onChange={(e) => {
                              const updated = returnItems.map(r =>
                                r.productId === productId
                                  ? { ...r, reason: e.target.value }
                                  : r
                              )
                              setReturnItems(updated)
                            }}
                            className="w-full p-2 border rounded"
                          >
                            <option value="defective">Defective Product</option>
                            <option value="wrong_item">Wrong Item</option>
                            <option value="not_as_described">Not as Described</option>
                            <option value="changed_mind">Changed Mind</option>
                            <option value="other">Other</option>
                          </select>
                          <textarea
                            placeholder="Additional description (optional)"
                            value={returnItems.find(r => r.productId === productId)?.description || ''}
                            onChange={(e) => {
                              const updated = returnItems.map(r =>
                                r.productId === productId
                                  ? { ...r, description: e.target.value }
                                  : r
                              )
                              setReturnItems(updated)
                            }}
                            className="w-full p-2 border rounded"
                            rows="2"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowReturnForm(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReturnRequest}
                  disabled={returning || !returnItems.length}
                  className="px-4 py-2 bg-orange-600 text-white rounded disabled:opacity-50"
                >
                  {returning ? 'Submitting...' : 'Submit Return Request'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserOrderDetailsModal
