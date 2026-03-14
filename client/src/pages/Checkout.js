import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../utils/api';
import { toast } from 'react-toastify';
import './Checkout.css';

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');
const TAX_RATE = 0.18;

const STEPS = ['Delivery Address', 'Order Summary', 'Payment'];

export default function Checkout() {
  const { cart, cartTotal, cartMrp, discount, clearCartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState(
    user?.addresses?.[0] || { name: user?.name || '', phone: user?.phone || '', address: '', locality: '', city: '', state: '', pincode: '' }
  );
  const [payMethod, setPayMethod] = useState('COD');

  const shipping = cartTotal >= 499 ? 0 : 40;
  const tax = Math.round(cartTotal * TAX_RATE);
  const total = cartTotal + shipping + tax - discount;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderItems = cart.map(i => ({
        product: i.product._id, name: i.product.name,
        image: i.product.images?.[0], price: i.product.price, qty: i.qty,
        size: i.size, color: i.color,
      }));
      const { data } = await createOrder({
        orderItems, shippingAddress: address, paymentMethod: payMethod,
        itemsPrice: cartTotal, shippingPrice: shipping, taxPrice: tax,
        totalPrice: total, discountAmount: discount,
      });
      await clearCartItems();
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${data._id}`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  return (
    <div className="checkout container">
      <div className="checkout-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={`step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            <div className="step-num">{i < step ? '✓' : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        <div className="checkout-main">
          {step === 0 && (
            <div className="card checkout-card">
              <h2>Delivery Address</h2>
              {user?.addresses?.length > 0 && (
                <div className="saved-addresses">
                  <h4>Saved Addresses</h4>
                  {user.addresses.map((a, i) => (
                    <label key={i} className="saved-addr">
                      <input type="radio" name="addr" onChange={() => setAddress(a)} />
                      <div>
                        <strong>{a.name}</strong> <span className="badge badge-muted">{a.type}</span><br/>
                        <span>{a.address}, {a.city}, {a.state} - {a.pincode}</span>
                      </div>
                    </label>
                  ))}
                  <div className="addr-divider">Or enter new address:</div>
                </div>
              )}
              <div className="addr-form">
                <div className="form-row-2">
                  <div className="form-group"><label className="form-label">Full Name</label><input className="form-control" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} required /></div>
                  <div className="form-group"><label className="form-label">Phone</label><input className="form-control" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} required /></div>
                </div>
                <div className="form-group"><label className="form-label">Address (House No, Street)</label><input className="form-control" value={address.address} onChange={e => setAddress({...address, address: e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Locality / Area</label><input className="form-control" value={address.locality} onChange={e => setAddress({...address, locality: e.target.value})} /></div>
                <div className="form-row-3">
                  <div className="form-group"><label className="form-label">City</label><input className="form-control" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} required /></div>
                  <div className="form-group"><label className="form-label">State</label><input className="form-control" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} required /></div>
                  <div className="form-group"><label className="form-label">Pincode</label><input className="form-control" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} required /></div>
                </div>
                <button className="btn btn-primary" onClick={() => { if (!address.name || !address.phone || !address.address || !address.city) { toast.warning('Please fill required fields'); return; } setStep(1); }}>Continue →</button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="card checkout-card">
              <h2>Order Summary</h2>
              {cart.map(item => (
                <div key={item._id} className="checkout-item">
                  <img src={item.product?.images?.[0] || 'https://via.placeholder.com/60'} alt="" />
                  <div className="ci-details">
                    <p className="ci-n">{item.product?.name}</p>
                    <p className="ci-m">Qty: {item.qty} {item.size && `| Size: ${item.size}`} {item.color && `| Color: ${item.color}`}</p>
                  </div>
                  <span className="ci-p">{fmt((item.product?.price || 0) * item.qty)}</span>
                </div>
              ))}
              <div className="co-addr-show">
                <strong>Delivering to:</strong> {address.name}, {address.address}, {address.city}, {address.state} - {address.pincode}
                <button className="link-btn" onClick={() => setStep(0)}>Change</button>
              </div>
              <button className="btn btn-primary" onClick={() => setStep(2)}>Continue to Payment →</button>
            </div>
          )}

          {step === 2 && (
            <div className="card checkout-card">
              <h2>Payment Method</h2>
              <div className="pay-options">
                {[
                  { val: 'COD', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when delivered' },
                  { val: 'UPI', label: 'UPI', icon: '📱', desc: 'Google Pay, PhonePe, Paytm' },
                  { val: 'Card', label: 'Credit / Debit Card', icon: '💳', desc: 'All major cards accepted' },
                  { val: 'NetBanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks' },
                ].map(opt => (
                  <label key={opt.val} className={`pay-option ${payMethod === opt.val ? 'selected' : ''}`}>
                    <input type="radio" name="pay" value={opt.val} checked={payMethod === opt.val} onChange={() => setPayMethod(opt.val)} />
                    <span className="pay-icon">{opt.icon}</span>
                    <div><p className="pay-label">{opt.label}</p><p className="pay-desc">{opt.desc}</p></div>
                  </label>
                ))}
              </div>

              {(payMethod === 'UPI' || payMethod === 'Card') && (
                <div className="pay-ui-note">
                  <p>🎉 UI Demo — No real payment processed. Click "Place Order" to simulate.</p>
                </div>
              )}

              <button className="btn btn-secondary btn-lg btn-full" onClick={handlePlaceOrder} disabled={loading}>
                {loading ? 'Placing Order...' : `Place Order · ${fmt(total)}`}
              </button>
            </div>
          )}
        </div>

        <div className="checkout-sidebar card">
          <h3>Price Breakdown</h3>
          <div className="summary-row"><span>MRP Total</span><span>{fmt(cartMrp)}</span></div>
          {discount > 0 && <div className="summary-row green"><span>Discount</span><span>− {fmt(discount)}</span></div>}
          <div className="summary-row"><span>Delivery</span><span className={shipping === 0 ? 'green' : ''}>{shipping === 0 ? 'FREE' : fmt(shipping)}</span></div>
          <div className="summary-row"><span>Tax (18% GST)</span><span>{fmt(tax)}</span></div>
          <hr style={{border:'none',borderTop:'1px dashed #e0e0e0',margin:'8px 0'}}/>
          <div className="summary-row total"><span>Total</span><span>{fmt(total)}</span></div>
          {discount > 0 && <p className="summary-saving">Saving {fmt(discount)} 🎉</p>}
        </div>
      </div>
    </div>
  );
}
