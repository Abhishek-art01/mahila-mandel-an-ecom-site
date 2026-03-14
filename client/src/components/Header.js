import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [search, setSearch] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/products?keyword=${encodeURIComponent(search.trim())}`); setSearch(''); }
  };

  return (
    <header className="header">
      <div className="header-inner container">
        <Link to="/" className="header-logo">
          <span className="logo-shop">Shop</span><span className="logo-kart">Kart</span>
        </Link>

        <form className={`header-search ${showMobileSearch ? 'mobile-show' : ''}`} onSubmit={handleSearch}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for products, brands and more"
            className="search-input"
          />
          <button type="submit" className="search-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
        </form>

        <nav className="header-nav">
          <button className="search-mobile-btn hide-desktop" onClick={() => setShowMobileSearch(p => !p)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>

          {user ? (
            <div className="nav-user" ref={menuRef}>
              <button className="nav-item user-btn" onClick={() => setShowMenu(p => !p)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="hide-mobile">{user.name.split(' ')[0]}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="hide-mobile"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              {showMenu && (
                <div className="dropdown">
                  <Link to="/profile" className="dropdown-item" onClick={() => setShowMenu(false)}>My Profile</Link>
                  <Link to="/orders" className="dropdown-item" onClick={() => setShowMenu(false)}>My Orders</Link>
                  <Link to="/wishlist" className="dropdown-item" onClick={() => setShowMenu(false)}>Wishlist</Link>
                  {user.isAdmin && <Link to="/admin" className="dropdown-item admin-link" onClick={() => setShowMenu(false)}>Admin Dashboard</Link>}
                  <div className="dropdown-divider"/>
                  <button className="dropdown-item text-danger" onClick={() => { logout(); setShowMenu(false); navigate('/'); }}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-item nav-login">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>Login</span>
            </Link>
          )}

          <Link to="/wishlist" className="nav-item hide-mobile">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span>Wishlist</span>
          </Link>

          <Link to="/cart" className="nav-item cart-nav">
            <div className="cart-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount > 9 ? '9+' : cartCount}</span>}
            </div>
            <span className="hide-mobile">Cart</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
