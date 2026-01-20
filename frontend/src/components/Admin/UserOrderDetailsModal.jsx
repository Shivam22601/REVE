import React, { useState } from 'react'
import { userAPI } from '../../config/api' // adjust if needed

const UserOrderDetailsModal = ({ order, onClose, onUpdate }) => {
  const [cancelling, setCancelling] = useState(false)

  if (!order) return null

  const canCancel =
    order.status !== 'cancelled' && order.status !== 'delivered'

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
      alert('Unable to cancel order. Please try again.')
    } finally {
      setCancelling(false)
    }
  }

  const statusStyle =
    order.status === 'delivered'
      ? 'bg-green-100 text-green-700'
      : order.status === 'cancelled'
      ? 'bg-red-100 text-red-700'
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
            <p><b>Amount:</b> ₹{order.payment?.amount}</p>
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
                  <td className="p-2 text-center">₹{item.price}</td>
                  <td className="p-2 text-center">{item.quantity}</td>
                  <td className="p-2 text-center">
                    ₹{item.price * item.quantity}
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
              <span>₹{order.totals?.subtotal || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{order.totals?.tax || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{order.totals?.shipping || 0}</span>
            </div>
            {order.totals?.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{order.totals.discount}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Grand Total</span>
              <span>₹{order.totals?.grandTotal || 0}</span>
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
      </div>
    </div>
  )
}

export default UserOrderDetailsModal
