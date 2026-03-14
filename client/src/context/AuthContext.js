import { createContext, useContext, useState, useCallback } from 'react';
import { loginUser, registerUser, getProfile } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('shopkart_user') || 'null'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveUser = (u) => {
    setUser(u);
    localStorage.setItem('shopkart_user', JSON.stringify(u));
  };

  const login = async (email, password) => {
    setLoading(true); setError(null);
    try {
      const { data } = await loginUser({ email, password });
      saveUser(data);
      return data;
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed');
      throw e;
    } finally { setLoading(false); }
  };

  const register = async (name, email, password, phone) => {
    setLoading(true); setError(null);
    try {
      const { data } = await registerUser({ name, email, password, phone });
      saveUser(data);
      return data;
    } catch (e) {
      setError(e.response?.data?.message || 'Registration failed');
      throw e;
    } finally { setLoading(false); }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopkart_user');
  };

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await getProfile();
      saveUser({ ...user, ...data });
    } catch {}
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, refreshProfile, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
