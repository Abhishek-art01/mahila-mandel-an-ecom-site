import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeatured, getCategories } from '../utils/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const BANNERS = [
  { title: 'New Collection', sub: 'Festive Jewellery Sale', tag: 'Up to 80% Off', cat: 'Jewellery', bg: '#e3f2fd', accent: '#1565c0', emoji: '💎' },
  { title: 'Ethnic Wear', sub: 'Sarees & Suits', tag: 'Starting ₹499', cat: 'Clothing', bg: '#fce4ec', accent: '#880e4f', emoji: '👗' },
  { title: 'Designer Bags', sub: 'Premium Collection', tag: 'Min 40% Off', cat: 'Bags', bg: '#e8f5e9', accent: '#1b5e20', emoji: '👜' },
];

const CAT_ICONS = {
  'Jewellery': '💎', 'Clothing': '👗', 'Bags': '👜',
  'Footwear': '👠', 'Accessories': '🧣', 'Beauty': '💄',
  'Home Decor': '🏠', 'Electronics': '📱',
};

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banner, setBanner] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [f, c] = await Promise.all([getFeatured(), getCategories()]);
        setFeatured(Array.isArray(f.data) ? f.data : []);
        setCategories(Array.isArray(c.data) ? c.data : []);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally { setLoading(false); }
    };
    load();
    const t = setInterval(() => setBanner(p => (p + 1) % BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const b = BANNERS[banner];

  return (
    <div className="home">
      {/* Hero Banner */}
      <div className="hero" style={{ background: b.bg }}>
        <div className="hero-content">
          <span className="hero-tag" style={{ color: b.accent }}>{b.tag}</span>
          <h1 className="hero-title" style={{ color: b.accent }}>{b.title}</h1>
          <p className="hero-sub">{b.sub}</p>
          <Link to={`/products?category=${b.cat}`} className="btn btn-primary hero-cta">Shop Now</Link>
        </div>
        <div className="hero-emoji">{b.emoji}</div>
        <div className="hero-dots">
          {BANNERS.map((_, i) => (
            <button key={i} className={`hero-dot ${i === banner ? 'active' : ''}`} onClick={() => setBanner(i)} />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="container">
        <section className="section">
          <h2 className="section-title">Shop by Category</h2>
          <div className="cats-grid">
            {categories.map(cat => (
              <Link key={cat} to={`/products?category=${cat}`} className="cat-card">
                <div className="cat-icon">{CAT_ICONS[cat] || '🛍️'}</div>
                <span>{cat}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Deals banner strip */}
        <div className="deals-strip">
          {[
            { icon: '🚚', title: 'Free Delivery', sub: 'On orders above ₹499' },
            { icon: '↩️', title: 'Easy Returns', sub: '10-day hassle-free return' },
            { icon: '🔒', title: 'Secure Payment', sub: 'SSL encrypted checkout' },
            { icon: '✅', title: '100% Authentic', sub: 'All products verified' },
          ].map(d => (
            <div key={d.title} className="deal-item">
              <span className="deal-icon">{d.icon}</span>
              <div><p className="deal-title">{d.title}</p><p className="deal-sub">{d.sub}</p></div>
            </div>
          ))}
        </div>

        {/* Featured */}
        <section className="section">
          <div className="section-head">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products" className="see-all">See All →</Link>
          </div>
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </section>

        {/* Promo Banners */}
        <div className="promo-grid">
          <Link to="/products?category=Jewellery" className="promo-card promo-1">
            <div><h3>Bridal Jewellery</h3><p>Starting ₹299</p></div>
            <span>💍</span>
          </Link>
          <Link to="/products?category=Clothing" className="promo-card promo-2">
            <div><h3>Ethnic Wear</h3><p>Up to 70% off</p></div>
            <span>👘</span>
          </Link>
          <Link to="/products?category=Bags" className="promo-card promo-3">
            <div><h3>Trendy Bags</h3><p>Min 40% off</p></div>
            <span>👛</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <h3>ShopKart</h3>
            <p>Your one-stop destination for women's fashion & accessories.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/products">All Products</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/profile">My Account</Link>
          </div>
          <div className="footer-col">
            <h4>Categories</h4>
            {categories.slice(0, 5).map(c => <Link key={c} to={`/products?category=${c}`}>{c}</Link>)}
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <button className="footer-link-btn">Help Center</button>
            <button className="footer-link-btn">Track Order</button>
            <button className="footer-link-btn">Return Policy</button>
            <button className="footer-link-btn">Contact Us</button>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 ShopKart. All rights reserved. | Made with ❤️ in India</p>
        </div>
      </footer>
    </div>
  );
}
