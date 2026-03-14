import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');
const discount = (p, m) => Math.round(((m - p) / m) * 100);

const Stars = ({ rating, count }) => (
  <div className="pc-rating">
    <span className="pc-stars">{rating?.toFixed(1)} ★</span>
    {count > 0 && <span className="pc-reviews">({count.toLocaleString()})</span>}
  </div>
);

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const { toggle, isInWishlist } = useWishlist();
  const liked = isInWishlist(product._id);
  const disc = discount(product.price, product.mrp);

  return (
    <div className="pc">
      <button className="pc-wish" onClick={(e) => { e.preventDefault(); toggle(product._id); }} aria-label="Wishlist">
        <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? '#e53935' : 'none'} stroke={liked ? '#e53935' : '#999'} strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      <Link to={`/products/${product._id}`} className="pc-link">
        <div className="pc-img-wrap">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
            alt={product.name}
            className="pc-img"
            loading="lazy"
          />
          {disc > 0 && <span className="pc-disc">{disc}% off</span>}
        </div>

        <div className="pc-body">
          <p className="pc-brand">{product.brand}</p>
          <p className="pc-name">{product.name}</p>

          {product.numReviews > 0 && <Stars rating={product.ratings} count={product.numReviews} />}

          <div className="pc-prices">
            <span className="pc-price">{fmt(product.price)}</span>
            {product.mrp > product.price && <span className="pc-mrp">{fmt(product.mrp)}</span>}
          </div>

          {product.stock === 0 && <span className="pc-oos">Out of Stock</span>}
          {product.stock > 0 && product.stock <= 5 && <span className="pc-low">Only {product.stock} left!</span>}
        </div>
      </Link>

      <button
        className="pc-add"
        onClick={() => addItem(product._id, 1)}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductCard;
