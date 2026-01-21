// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  let token = localStorage.getItem('accessToken');
  const isFormData = options.body instanceof FormData;
  const defaultHeaders = isFormData ? {} : { 'Content-Type': 'application/json' };

  const makeConfig = (t) => ({
    headers: {
      ...defaultHeaders,
      ...(t && { Authorization: `Bearer ${t}` }),
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  });

  // Prepare body for JSON (but keep FormData untouched)
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    options.body = JSON.stringify(options.body);
  }

  let config = makeConfig(token);

  try {
    let response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    let data = await response.json().catch(() => ({}));

    if (response.ok) return data;

    // If unauthorized, try refreshing token once and retry the original request
    if (response.status === 401) {
      try {
        const rt = localStorage.getItem('refreshToken');
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: rt ? { Authorization: `Bearer ${rt}` } : {}
        });
        const refreshData = await refreshRes.json().catch(() => ({}));
        if (refreshRes.ok && refreshData.accessToken) {
          localStorage.setItem('accessToken', refreshData.accessToken);
          if (refreshData.refreshToken) {
            localStorage.setItem('refreshToken', refreshData.refreshToken);
          }
          token = refreshData.accessToken;
          config = makeConfig(token);
          // retry original request once
          response = await fetch(`${API_BASE_URL}${endpoint}`, config);
          const retryData = await response.json().catch(() => ({}));
          if (response.ok) return retryData;
          throw new Error(retryData.message || 'Request failed');
        }
        // refresh failed => clear tokens and propagate a session-expired style error
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw new Error(refreshData.message || 'Session expired');
      } catch (refreshErr) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        console.error('Refresh failed:', refreshErr);
        throw refreshErr;
      }
    }

    throw new Error(data.message || 'Request failed');
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (data) => apiCall('/auth/register', { method: 'POST', body: data }),
  login: (data) => apiCall('/auth/login', { method: 'POST', body: data }),
  logout: () => apiCall('/auth/logout', { method: 'POST' }),
  refresh: () => apiCall('/auth/refresh', { method: 'POST' }),
  verifyEmail: (token) => apiCall(`/auth/verify-email?token=${token}`),
  forgotPassword: (email) => apiCall('/auth/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (token, password) => apiCall('/auth/reset-password', { method: 'POST', body: { token, password } }),
  googleLogin: (token) => apiCall('/auth/google', { method: 'POST', body: { token } }),
};

// User API
export const userAPI = {
  getProfile: () => apiCall('/users/me'),
  updateProfile: (data) => apiCall('/users/me', { method: 'PUT', body: data }),
  // Address management
  addAddress: (data) => apiCall('/users/addresses', { method: 'POST', body: data }),
  updateAddress: (id, data) => apiCall(`/users/addresses/${id}`, { method: 'PUT', body: data }),
  deleteAddress: (id) => apiCall(`/users/addresses/${id}`, { method: 'DELETE' }),
  // Orders for current user
  getOrders: () => apiCall('/users/orders'),
  cancelOrder: (id) => apiCall(`/users/orders/${id}/cancel`, { method: 'PATCH' }),
};

// Product API
export const productAPI = {
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/products?${query}`);
  },
  getProduct: (id) => apiCall(`/products/${id}`),
  getCategories: () => apiCall('/products/categories'),
  addReview: (productId, reviewData) => apiCall(`/products/${productId}/reviews`, { method: 'POST', body: reviewData }),
};

// Cart API
export const cartAPI = {
  getCart: () => apiCall('/cart'),
  addToCart: (productId, quantity = 1) => apiCall('/cart', { method: 'POST', body: { productId, quantity } }),
  updateCartItem: (itemId, quantity) => apiCall(`/cart/${itemId}`, { method: 'PUT', body: { quantity } }),
  removeFromCart: (itemId) => apiCall(`/cart/${itemId}`, { method: 'DELETE' }),
  clearCart: () => apiCall('/cart', { method: 'DELETE' }),
};

// Order API
export const orderAPI = {
  createOrder: (data) => apiCall('/orders', { method: 'POST', body: data }),
  getOrders: () => apiCall('/orders'),
  getOrder: (id) => apiCall(`/orders/${id}`),
};

// Admin API
export const adminAPI = {
  dashboard: () => apiCall('/admin/dashboard'),
  getUsers: () => apiCall('/admin/users'),
  blockUser: (id, block) => apiCall(`/admin/users/${id}/block`, { method: 'PATCH', body: { block } }),
  updateUserProfile: (id, formData) => apiCall(`/admin/users/${id}/profile`, {
    method: 'PUT',
    body: formData,
    headers: {},
  }),
  getOrders: () => apiCall('/admin/orders'),
  updateOrderStatus: (id, status) => apiCall(`/admin/orders/${id}/status`, { method: 'PATCH', body: { status } }),
  updateOrderDetails: (id, data) => apiCall(`/admin/orders/${id}/details`, { method: 'PATCH', body: data }),
  updateOrderAddress: (id, data) => apiCall(`/admin/orders/${id}/address`, { method: 'PATCH', body: data }),
  getProducts: () => apiCall('/admin/products'),
  createProduct: (formData) => apiCall('/admin/products', {
    method: 'POST',
    body: formData,
    headers: {},
  }),
  updateProduct: (id, formData) => apiCall(`/admin/products/${id}`, {
    method: 'PUT',
    body: formData,
    headers: {},
  }),
  deleteProduct: (id) => apiCall(`/admin/products/${id}`, { method: 'DELETE' }),
  // Category management
  getCategories: () => apiCall('/products/categories'),
  createCategory: (data) => apiCall('/admin/categories', { method: 'POST', body: data }),
    updateCategory: (id, data) => apiCall(`/products/categories/${id}`, { method: 'PUT', body: data }),
  deleteCategory: (id) => apiCall(`/products/categories/${id}`, { method: 'DELETE' }),
};
