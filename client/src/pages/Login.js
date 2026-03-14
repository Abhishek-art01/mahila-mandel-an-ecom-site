import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [errors, setErrors] = useState({});
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const validate = () => {
    const e = {};
    if (tab === 'register' && !form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handle = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (tab === 'login') await login(form.email, form.password);
      else await register(form.name, form.email, form.password, form.phone);
      navigate(from, { replace: true });
    } catch {}
  };

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(err => ({ ...err, [k]: '' })); };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">Shop<span>Kart</span></Link>
          <p>{tab === 'login' ? 'Log in to your account' : 'Create a new account'}</p>
        </div>

        <div className="auth-tabs">
          <button className={tab === 'login' ? 'active' : ''} onClick={() => { setTab('login'); setErrors({}); }}>Login</button>
          <button className={tab === 'register' ? 'active' : ''} onClick={() => { setTab('register'); setErrors({}); }}>Register</button>
        </div>

        <form onSubmit={handle} className="auth-form">
          {tab === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className={`form-control ${errors.name ? 'error' : ''}`} placeholder="Priya Sharma" value={form.name} onChange={e => set('name', e.target.value)} />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className={`form-control ${errors.email ? 'error' : ''}`} placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          {tab === 'register' && (
            <div className="form-group">
              <label className="form-label">Phone (optional)</label>
              <input className="form-control" placeholder="9876543210" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className={`form-control ${errors.password ? 'error' : ''}`} placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Please wait...' : tab === 'login' ? 'Login' : 'Create Account'}
          </button>

          {tab === 'login' && (
            <p className="auth-demo">
              <strong>Demo:</strong> admin@shopkart.com / admin123 (Admin)<br/>
              priya@example.com / user123 (User)
            </p>
          )}
        </form>

        <p className="auth-switch">
          {tab === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setErrors({}); }}>
            {tab === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
