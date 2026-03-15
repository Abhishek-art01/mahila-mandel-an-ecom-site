import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart as apiAdd, updateCartItem, removeFromCart as apiRemove, clearCart as apiClear } from '../utils/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();
const safeArr = (d) => Array.isArray(d) ? d : [];

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchCart();
    else setCart([]);
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await getCart();
      setCart(safeArr(data));
    } catch { setCart([]); }
  };

  const addItem = async (productId, qty = 1, size = '', color = '') => {
    if (!user) { toast.info('Please login to add items'); return; }
    setLoading(true);
    try {
      const { data } = await apiAdd({ productId, qty, size, color });
      setCart(safeArr(data));
      toast.success('Added to cart!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to add');
    } finally { setLoading(false); }
  };

  const updateItem = async (itemId, qty) => {
    try {
      const { data } = await updateCartItem(itemId, { qty });
      setCart(safeArr(data));
    } catch {}
  };

  const removeItem = async (itemId) => {
    try {
      const { data } = await apiRemove(itemId);
      setCart(safeArr(data));
      toast.info('Removed from cart');
    } catch {}
  };

  const clearCartItems = async () => {
    try { await apiClear(); setCart([]); } catch {}
  };

  const cartCount = cart.reduce((s, i) => s + (i.qty || 0), 0);
  const cartTotal = cart.reduce((s, i) => s + (i.product?.price || 0) * (i.qty || 0), 0);
  const cartMrp = cart.reduce((s, i) => s + (i.product?.mrp || 0) * (i.qty || 0), 0);
  const discount = cartMrp - cartTotal;

  return (
    <CartContext.Provider value={{ cart, loading, cartCount, cartTotal, cartMrp, discount, addItem, updateItem, removeItem, clearCartItems, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
