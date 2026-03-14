import axios from 'axios';

const API = axios.create({ 
  baseURL: 'https://mahila-mande-lserver.onrender.com/api' 
});
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('shopkart_user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('shopkart_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const addAddress = (data) => API.post('/auth/address', data);
export const deleteAddress = (id) => API.delete(`/auth/address/${id}`);

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const getFeatured = () => API.get('/products/featured');
export const getCategories = () => API.get('/products/categories');
export const createReview = (id, data) => API.post(`/products/${id}/reviews`, data);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const getAllProductsAdmin = () => API.get('/products/admin/all');

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/myorders');
export const getOrder = (id) => API.get(`/orders/${id}`);
export const payOrder = (id, data) => API.put(`/orders/${id}/pay`, data);
export const cancelOrder = (id, data) => API.put(`/orders/${id}/cancel`, data);
export const getAllOrders = () => API.get('/orders/admin/all');
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);
export const getAdminStats = () => API.get('/orders/admin/stats');

// Cart
export const getCart = () => API.get('/cart');
export const addToCart = (data) => API.post('/cart', data);
export const updateCartItem = (itemId, data) => API.put(`/cart/${itemId}`, data);
export const removeFromCart = (itemId) => API.delete(`/cart/${itemId}`);
export const clearCart = () => API.delete('/cart');

// Wishlist
export const getWishlist = () => API.get('/wishlist');
export const toggleWishlist = (productId) => API.post(`/wishlist/${productId}`);

// Admin Users
export const getAllUsers = () => API.get('/users');
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

export default API;
