import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminBar.css';

const AdminBar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || !user.isAdmin) return null;

  const isOnAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="admin-bar">
      <div className="admin-bar-inner">
        <div className="ab-left">
          <span className="ab-crown">👑</span>
          <span className="ab-text">Admin Mode</span>
          <span className="ab-name">{user.name}</span>
        </div>
        <div className="ab-right">
          {isOnAdmin ? (
            <Link to="/" className="ab-switch-btn ab-store">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Back to Store
            </Link>
          ) : (
            <Link to="/admin" className="ab-switch-btn ab-admin">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBar;
