import { User, LogOut, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import AddressForm from "./AddressForm";
import { userAPI } from "../../config/api";
import OrderDetailsModal from "../Admin/OrderDetailsModal";
import aboutBg from "../../assets/logo.jpg";


export default function Profile() {
  const Motion = motion;
  const navigate = useNavigate();
  const { user, logout, isAdmin, refreshProfile } = useAuth();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = useCallback(async () => {
    if (!user) return;
    setOrdersLoading(true);
    try {
      const res = await userAPI.getOrders();
      // backend returns either array or { orders }
      const arr = Array.isArray(res) ? res : (res?.orders || []);
      setOrders(arr);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      // If not logged in, user will see the login prompt below or we can redirect
      // But better to show a nice UI asking to login
      return;
    }

    // load orders for the user when profile is available
    loadOrders();

  }, [user, loadOrders]);

  if (!user) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6">
      <img
        src={aboutBg}
        alt="Login Required"
        className="absolute inset-0 w-full h-full object-contain"
      />
      <div className="absolute inset-0 bg-white/60" />

      <div className="relative z-10 max-w-3xl text-center">
        <Motion.h1
          className="text-4xl md:text-6xl font-extrabold"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Welcome to <span className="font-light text-gray-500">REVE CULT</span>
        </Motion.h1>

        <Motion.p
          className="mt-4 text-xl md:text-2xl text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Please login to view your profile
        </Motion.p>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 rounded-full
                       bg-pink-600 text-white font-semibold
                       hover:bg-pink-700 transition
                       text-sm sm:text-base"
          >
            Login
          </button>
        </div>
      </div>
    </section>
  );
}


  return (
    <div className="min-h-screen px-6 py-16 max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-2xl p-8">

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            {user.avatar ? (
                <img src={user.avatar.url || user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
                <User size={32} />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
            {isAdmin && (
                <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded mt-1 inline-block">Admin</span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {user.phone && <p><b>Phone:</b> {user.phone}</p>}
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Addresses</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditingAddress(null) || setShowAddressForm(true)} className="px-4 py-2 bg-pink-600 text-white rounded">Add Address</button>
              <button onClick={() => refreshProfile()} className="px-3 py-2 border rounded">Refresh</button>
            </div>
          </div>

          {user.addresses?.length ? (
            <div className="space-y-3">
              {user.addresses.map((addr) => (
                <div key={addr._id || addr.line1} className={`p-3 border rounded ${addr.isDefault ? 'border-pink-500 bg-pink-50' : 'border-gray-100'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{addr.label || addr.name}</div>
                      <div className="text-sm text-gray-700">{addr.line1}{addr.line2 && `, ${addr.line2}`}</div>
                      <div className="text-sm text-gray-700">{addr.city}, {addr.state} {addr.zip}</div>
                      <div className="text-xs text-gray-500">{addr.country} • {addr.phone}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {!addr.isDefault && (
                        <button onClick={async () => {
                          try {
                            await userAPI.updateAddress(addr._1d, { isDefault: true });
                            await refreshProfile();
                          } catch (err) { console.error(err); alert(err.message || 'Failed'); }
                        }} className="text-sm text-pink-600">Set Default</button>
                      )}
                      <div className="flex gap-2">
                        <button onClick={() => setEditingAddress(addr) || setShowAddressForm(true)} className="text-sm text-gray-600">Edit</button>
                        <button onClick={async () => {
                          if (!window.confirm('Delete address?')) return;
                          try {
                            await userAPI.deleteAddress(addr._id);
                            await refreshProfile();
                          } catch (err) { console.error(err); alert(err.message || 'Failed'); }
                        }} className="text-sm text-red-600">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600">No addresses found. Click "Add Address" to add one.</div>
          )}
        </div>

        {/* ================= ORDERS ================= */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Orders</h3>
            <button onClick={() => loadOrders()} className="px-3 py-2 border rounded">Refresh Orders</button>
          </div>

          {ordersLoading ? (
            <div>Loading orders…</div>
          ) : orders.length ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="p-4 border rounded bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="font-medium">Order #{order.orderNumber || order._id.slice(-8)}</div>
                      <div className="text-sm text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleString() : '—'}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{(order.totals?.grandTotal ?? order.payment?.amount ?? 0).toLocaleString()}</div>
                      <div className="text-xs text-gray-500 mt-1">Tax: ₹{(order.totals?.tax ?? 0).toLocaleString()}</div>
                      <div className="text-sm mt-1">
                        <span className={`px-2 py-1 rounded text-sm ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {order.status ? (order.status.charAt(0).toUpperCase() + order.status.slice(1)) : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-700 mb-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <div>{item.product?.name || 'Unknown Product'} x{item.quantity}</div>
                        <div>₹{item.price * item.quantity}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-3">
                    <button onClick={() => setSelectedOrder(order)} className="text-blue-600 text-sm">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600">You have not placed any orders yet.</div>
          )}
        </div>

        <div className="mt-8 flex gap-4 flex-wrap">
            {isAdmin && (
                <button
                onClick={() => navigate("/admin")}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2 hover:bg-purple-700 transition"
                >
                <LayoutDashboard size={16} /> Admin Dashboard
                </button>
            )}

            <button
            onClick={() => {
                logout();
                navigate("/");
            }}
            className="px-6 py-2 bg-black text-white rounded-lg flex items-center gap-2 hover:bg-gray-800 transition"
            >
            <LogOut size={16} /> Logout
            </button>
        </div>
      </div>

      {showAddressForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-md p-6 rounded shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{editingAddress ? 'Edit Address' : 'Add Address'}</h2>
              <button onClick={() => setShowAddressForm(false)} className="text-gray-500 hover:text-gray-800">Close</button>
            </div>
            <AddressForm initial={editingAddress || undefined} onCancel={() => setShowAddressForm(false)} onSave={async (data) => {
              try {
                if (editingAddress) {
                  await userAPI.updateAddress(editingAddress._id, data);
                } else {
                  await userAPI.addAddress(data);
                }
                await refreshProfile();
                setShowAddressForm(false);
              } catch (err) { console.error(err); alert(err.message || 'Failed'); }
            }} />
          </div>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
