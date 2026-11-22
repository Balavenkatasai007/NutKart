
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  ShoppingBasket, Search, UserRound, X, Plus, Minus, Trash2,
  Sprout, Leaf, Truck, ShieldCheck, ArrowRight, LogOut, Package
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const http = axios.create({ baseURL: API });
const money = n => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const fallbackProducts = [
  { _id:'demo1', name:'Premium Almonds', category:'Nuts', price:780, unit:'500 g', image:'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=700', description:'Crunchy premium almonds, carefully selected.' },
  { _id:'demo2', name:'Whole Cashews', category:'Nuts', price:690, unit:'500 g', image:'https://images.unsplash.com/photo-1563412885-139a6d6e6a4d?w=700', description:'Creamy whole cashews for snacks and cooking.' },
  { _id:'demo3', name:'Raw Groundnuts', category:'Pulses', price:160, unit:'1 kg', image:'https://images.pexels.com/photos/7717463/pexels-photo-7717463.jpeg?w=700', description:'Farm-fresh groundnuts with natural flavour.' },
  { _id:'demo4', name:'Green Moong Dal', category:'Pulses', price:145, unit:'1 kg', image:'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=700', description:'Clean, nutritious whole green gram.' },
  { _id:'demo5', name:'Golden Raisins', category:'Dry Fruits', price:320, unit:'500 g', image:'https://images.unsplash.com/photo-1691657917109-c6e027eac44a?w=700', description:'Naturally sweet raisins for everyday snacking.' },
  { _id:'demo6', name:'Pistachios', category:'Dry Fruits', price:850, unit:'250 g', image:'https://images.unsplash.com/photo-1723110568223-f83071ddd4e5?w=700', description:'Delicious pistachios packed with goodness.' },
  { _id:'demo7', name:'Toor Dal', category:'Pulses', price:185, unit:'1 kg', image:'https://images.unsplash.com/photo-1594900799266-0e56587ba586?w=700', description:'Everyday quality toor dal.' },
  { _id:'demo8', name:'Walnut Kernels', category:'Nuts', price:560, unit:'250 g', image:'https://images.unsplash.com/photo-1563412885-139a6d6e6a4d?w=700', description:'Rich walnut kernels, ready to enjoy.' }
];

const productImage = p => {
  const images = {
    'Raw Groundnuts': 'https://images.pexels.com/photos/7717463/pexels-photo-7717463.jpeg?w=700',
    'Golden Raisins': 'https://images.unsplash.com/photo-1691657917109-c6e027eac44a?w=700',
    'Pistachios': 'https://images.unsplash.com/photo-1723110568223-f83071ddd4e5?w=700',
    'Green Moong Dal': 'https://images.unsplash.com/photo-ecpymDlXwHE?w=700',
    'Toor Dal': 'https://images.unsplash.com/photo-1594900799266-0e56587ba586?w=700',
    'Walnut Kernels': 'https://images.unsplash.com/photo-1563412885-139a6d6e6a4d?w=700'
  };
  return images[p.name] || p.image || fallbackProducts[0].image;
};

const copy = {
  en: {
    navHome:'Home', navShop:'Shop', navFarmers:'For Farmers', navAbout:'About',
    login:'Login', heroTag:'FRESH FROM FARMERS',
    heroTitle:'Good food begins with good roots.',
    heroText:'Shop quality nuts, dry fruits and pulses sourced with care and brought closer to your home.',
    shopNow:'Shop products', joinFarmer:'Sell with us',
    categories:'Shop by category', categoriesText:'Everyday goodness, sourced closer to you.',
    featured:'Popular products', featuredText:'A few customer favourites from our marketplace.',
    add:'Add to cart', farmerTitle:'Are you a farmer?',
    farmerText:'Reach more customers and showcase your harvest on NutKart.',
    registerFarmer:'Register as farmer', why:'Why choose NutKart?',
    direct:'Direct sourcing', quality:'Quality products',
    delivery:'Convenient delivery', secure:'Secure checkout',
    cart:'Your cart', empty:'Your cart is empty.', total:'Total',
    checkout:'Proceed to checkout', continue:'Continue shopping',
    account:'My account', logout:'Logout', name:'Full name',
    email:'Email address', password:'Password', address:'Delivery address',
    create:'Create account', product:'Product name', price:'Price (₹)',
    unit:'Unit / pack size', category:'Category', image:'Image URL',
    description:'Description', save:'Save product',
    orderSuccess:'Order placed successfully!', payment:'Pay online (test mode)',
    cod:'Place demo order (pay later)', search:'Search products...',
    all:'All', signIn:'Sign in', register:'Register',
    farmerForm:'Farmer registration', checkoutTitle:'Checkout',
    orderHistory:'Order history'
  },
  te: {
    navHome:'హోమ్', navShop:'ఉత్పత్తులు', navFarmers:'రైతుల కోసం',
    navAbout:'మా గురించి', login:'లాగిన్',
    heroTag:'రైతుల నుంచి నేరుగా',
    heroTitle:'మంచి ఆహారం మంచి మూలాల నుంచి.',
    heroText:'నాణ్యమైన గింజలు, డ్రై ఫ్రూట్స్, పప్పులను సులభంగా మీ ఇంటికి తెచ్చుకోండి.',
    shopNow:'ఉత్పత్తులు చూడండి', joinFarmer:'మాతో అమ్మండి',
    categories:'వర్గాల వారీగా కొనండి',
    categoriesText:'మీకు దగ్గరగా సేకరించిన నాణ్యమైన ఉత్పత్తులు.',
    featured:'ప్రజాదరణ పొందిన ఉత్పత్తులు',
    featuredText:'మా మార్కెట్‌లో వినియోగదారుల ఇష్టాలు.',
    add:'కార్ట్‌లో వేయండి', farmerTitle:'మీరు రైతా?',
    farmerText:'NutKart ద్వారా మరింత మంది వినియోగదారులకు చేరుకోండి.',
    registerFarmer:'రైతుగా నమోదు', why:'NutKart ఎందుకు?',
    direct:'నేరుగా సేకరణ', quality:'నాణ్యమైన ఉత్పత్తులు',
    delivery:'సులభమైన డెలివరీ', secure:'సురక్షిత చెల్లింపు',
    cart:'మీ కార్ట్', empty:'మీ కార్ట్ ఖాళీగా ఉంది.',
    total:'మొత్తం', checkout:'చెల్లింపుకు వెళ్లండి',
    continue:'కొనసాగించండి', account:'నా ఖాతా',
    logout:'లాగ్ అవుట్', name:'పూర్తి పేరు',
    email:'ఇమెయిల్', password:'పాస్‌వర్డ్',
    address:'డెలివరీ చిరునామా', create:'ఖాతా సృష్టించండి',
    product:'ఉత్పత్తి పేరు', price:'ధర (₹)',
    unit:'పరిమాణం', category:'వర్గం', image:'చిత్రం URL',
    description:'వివరణ', save:'ఉత్పత్తిని సేవ్ చేయండి',
    orderSuccess:'ఆర్డర్ విజయవంతంగా నమోదు అయింది!',
    payment:'ఆన్‌లైన్ చెల్లింపు (టెస్ట్)', cod:'డెమో ఆర్డర్ చేయండి',
    search:'ఉత్పత్తులను వెతకండి...', all:'అన్నీ',
    signIn:'లాగిన్', register:'నమోదు',
    farmerForm:'రైతు నమోదు', checkoutTitle:'చెల్లింపు',
    orderHistory:'ఆర్డర్ చరిత్ర'
  }
};

export default function App() {
  const [lang, setLang] = useState('en');
  const t = copy[lang];
  const [products, setProducts] = useState(fallbackProducts);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState({});
  const [drawer, setDrawer] = useState(false);
  const [modal, setModal] = useState('');
  const [authMode, setAuthMode] = useState('login');

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nutkartUser'));
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('nutkartToken'));
  const [notice, setNotice] = useState('');
  const [orders, setOrders] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    http.get('/products')
      .then(r => {
        if (r.data?.length) setProducts(r.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (token) {
      http.get('/orders/mine', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => setOrders(r.data)).catch(() => {});
    }
  }, [token]);

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  const visible = useMemo(
    () => products.filter(p =>
      (category === 'All' || p.category === category) &&
      p.name.toLowerCase().includes(query.toLowerCase())
    ),
    [products, category, query]
  );

  const cartItems = Object.values(cart).filter(x => x.quantity > 0);
  const count = cartItems.reduce((s, p) => s + p.quantity, 0);
  const total = cartItems.reduce((s, p) => s + p.price * p.quantity, 0);

  const add = p => setCart(old => ({
    ...old,
    [p._id]: {
      ...p,
      quantity: (old[p._id]?.quantity || 0) + 1
    }
  }));

  const change = (id, n) => setCart(old => {
    const next = { ...old };
    if (n <= 0) delete next[id];
    else next[id] = { ...next[id], quantity: n };
    return next;
  });

  const message = s => {
    setNotice(s);
    setTimeout(() => setNotice(''), 3200);
  };

  const authHeaders = () => ({
    Authorization: `Bearer ${token}`
  });

  async function submitAuth(e) {
    e.preventDefault();
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());

    try {
      const { data: result } = await http.post(`/auth/${authMode}`, data);
      const u = result.user;

      setUser(u);
      setToken(result.token);
      localStorage.setItem('nutkartUser', JSON.stringify(u));
      localStorage.setItem('nutkartToken', result.token);
      setModal('');
      message(`Welcome, ${u.name}!`);
    } catch (err) {
      message(err.response?.data?.message || 'Could not sign in. Check your details and backend.');
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nutkartUser');
    localStorage.removeItem('nutkartToken');
    setOrders([]);
    message('Logged out.');
  }

  async function submitFarmer(e) {
    e.preventDefault();

    if (!token) {
      setAuthMode('register');
      setModal('auth');
      message('Create an account first, then register as a farmer.');
      return;
    }

    const f = new FormData(e.currentTarget);
    const data = Object.fromEntries(f.entries());
    setBusy(true);

    try {
      await http.post('/products', data, { headers: authHeaders() });
      const r = await http.get('/products');
      setProducts(r.data);
      setModal('');
      message('Product added to marketplace.');
    } catch (err) {
      message(err.response?.data?.message || 'Could not add product. Farmer account required.');
    } finally {
      setBusy(false);
    }
  }

  async function placeOrder() {
    if (!token) {
      setModal('auth');
      message('Please log in before checkout.');
      return;
    }

    if (!cartItems.length) return;

    setBusy(true);

    try {
      const { data } = await http.post('/orders', {
        items: cartItems.map(p => ({
          product: p._id,
          quantity: p.quantity
        })),
        address: document.getElementById('deliveryAddress')?.value || ''
      }, { headers: authHeaders() });

      setCart({});
      setModal('');
      setOrders(old => [data, ...old]);
      message(t.orderSuccess);
    } catch (err) {
      message(err.response?.data?.message || 'Order could not be placed.');
    } finally {
      setBusy(false);
    }
  }

  async function payOnline() {
    if (!token) {
      setModal('auth');
      return;
    }

    setBusy(true);

    try {
      const { data: order } = await http.post('/payments/create-order', {
        items: cartItems.map(p => ({
          product: p._id,
          quantity: p.quantity
        }))
      }, { headers: authHeaders() });

      if (!window.Razorpay) {
        message('Razorpay checkout did not load. Try demo order.');
        setBusy(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'NutKart',
        description: 'NutKart purchase',
        order_id: order.id,
        handler: async response => {
          try {
            await http.post('/payments/verify', {
              ...response,
              items: cartItems.map(p => ({
                product: p._id,
                quantity: p.quantity
              })),
              address: document.getElementById('deliveryAddress')?.value || ''
            }, { headers: authHeaders() });

            setCart({});
            setModal('');
            message('Payment successful. Order confirmed!');
          } catch {
            message('Payment verification failed.');
          }
        },
        modal: {
          ondismiss: () => message('Payment window closed.')
        },
        theme: { color: '#286b39' }
      });

      rzp.open();
    } catch (err) {
      message(err.response?.data?.message || 'Payment setup failed. Configure Razorpay test keys.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <a className="brand" href="#home">
          <span className="brand-mark"><Sprout size={25}/></span>
          <span>Nut<span>Kart</span><small>FROM FARM TO HOME</small></span>
        </a>

        <nav>
          <a href="#home">{t.navHome}</a>
          <a href="#shop">{t.navShop}</a>
          <a href="#farmers">{t.navFarmers}</a>
          <a href="#about">{t.navAbout}</a>
        </nav>

        <div className="header-actions">
          <select value={lang} onChange={e => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="te">తెలుగు</option>
          </select>

          {user
            ? <button className="user-chip" onClick={() => setModal('account')}>
                <UserRound size={17}/>{user.name.split(' ')[0]}
              </button>
            : <button className="login-btn" onClick={() => {
                setAuthMode('login');
                setModal('auth');
              }}>{t.login}</button>
          }

          <button className="cart-btn" onClick={() => setDrawer(true)}>
            <ShoppingBasket size={20}/><b>{count}</b>
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <span className="eyebrow"><Leaf size={15}/>{t.heroTag}</span>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroText}</p>
            <div className="hero-ctas">
              <a className="btn-primary" href="#shop">{t.shopNow}<ArrowRight size={17}/></a>
              <a className="btn-outline" href="#farmers">{t.joinFarmer}</a>
            </div>
            <div className="hero-proof">
              <span>✓ Carefully selected</span>
              <span>✓ Farmer-focused</span>
            </div>
          </div>

          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=1000" alt="Assorted nuts and dry fruits"/>
            <div className="image-note">
              <Sprout/>
              <span><b>Goodness in every handful</b><small>Simple food. Honest sourcing.</small></span>
            </div>
          </div>
        </section>

        <section className="category-band">
          <div>
            <span className="eyebrow">EXPLORE NUTKART</span>
            <h2>{t.categories}</h2>
            <p>{t.categoriesText}</p>
          </div>
          <div className="category-pills">
            {categories.filter(c => c !== 'All').map(c => (
              <button key={c} onClick={() => {
                setCategory(c);
                document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
              }}>
                {c}<ArrowRight size={15}/>
              </button>
            ))}
          </div>
        </section>

        <section className="shop-section" id="shop">
          <div className="section-head">
            <div>
              <span className="eyebrow">OUR MARKETPLACE</span>
              <h2>{t.featured}</h2>
              <p>{t.featuredText}</p>
            </div>

            <div className="shop-tools">
              <div className="search-box">
                <Search size={18}/>
                <input placeholder={t.search} value={query} onChange={e => setQuery(e.target.value)}/>
              </div>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                {categories.map(c => <option key={c} value={c}>{c === 'All' ? t.all : c}</option>)}
              </select>
            </div>
          </div>

          <div className="product-grid">
            {visible.map(p => (
              <article className="product-card" key={p._id}>
                <div className="product-photo">
                  <img
                    src={productImage(p)}
                    alt={p.name}
                    onError={e => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackProducts[0].image;
                    }}
                  />
                  <span>{p.category}</span>
                </div>
                <div className="product-info">
                  <h3>{p.name}</h3>
                  <p>{p.description || 'Quality produce selected for your home.'}</p>
                  <div className="product-buy">
                    <div><b>{money(p.price)}</b><small> / {p.unit || 'pack'}</small></div>
                    <button onClick={() => {
                      add(p);
                      message(`${p.name} added to cart`);
                    }}><Plus size={16}/>{t.add}</button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {!visible.length && <p className="empty-results">No products found. Try another search.</p>}
        </section>

        <section className="farmer-banner" id="farmers">
          <div className="farmer-art">
            <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900" alt="Green farm field"/>
          </div>
          <div>
            <span className="eyebrow light">GROW WITH NUTKART</span>
            <h2>{t.farmerTitle}</h2>
            <p>{t.farmerText}</p>
            <button className="btn-gold" onClick={() => setModal('farmer')}>
              {t.registerFarmer}<ArrowRight size={17}/>
            </button>
          </div>
        </section>

        <section className="benefits-section" id="about">
          <div className="section-head centered">
            <div>
              <span className="eyebrow">THE NUTKART PROMISE</span>
              <h2>{t.why}</h2>
            </div>
          </div>

          <div className="benefit-grid">
            <div><Sprout/><h3>{t.direct}</h3><p>Bringing farmers and customers closer.</p></div>
            <div><ShieldCheck/><h3>{t.quality}</h3><p>Thoughtfully selected everyday essentials.</p></div>
            <div><Truck/><h3>{t.delivery}</h3><p>A simple way to shop from home.</p></div>
            <div><ShoppingBasket/><h3>{t.secure}</h3><p>Checkout designed for a smooth experience.</p></div>
          </div>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#home">
          <span className="brand-mark"><Sprout/></span>
          <span>Nut<span>Kart</span><small>FROM FARM TO HOME</small></span>
        </a>
        <p>Connecting farms, families and fresh food.</p>
        <small>© {new Date().getFullYear()} NutKart Demo. Built for learning.</small>
      </footer>

      {notice && <div className="toast">{notice}</div>}

      {drawer && (
        <div className="overlay" onMouseDown={e => {
          if (e.target === e.currentTarget) setDrawer(false);
        }}>
          <aside className="cart-drawer">
            <div className="drawer-head">
              <h2>{t.cart} ({count})</h2>
              <button onClick={() => setDrawer(false)}><X/></button>
            </div>

            {!cartItems.length
              ? <div className="cart-empty">
                  <ShoppingBasket size={42}/>
                  <p>{t.empty}</p>
                  <button className="btn-primary" onClick={() => setDrawer(false)}>{t.continue}</button>
                </div>
              : <>
                  <div className="cart-lines">
                    {cartItems.map(p => (
                      <div className="cart-line" key={p._id}>
                        <img src={productImage(p)} alt={p.name}/>
                        <div className="line-info">
                          <b>{p.name}</b>
                          <small>{money(p.price)} / {p.unit}</small>
                          <div className="qty">
                            <button onClick={() => change(p._id, p.quantity - 1)}><Minus size={14}/></button>
                            <span>{p.quantity}</span>
                            <button onClick={() => change(p._id, p.quantity + 1)}><Plus size={14}/></button>
                            <button className="remove" onClick={() => change(p._id, 0)}><Trash2 size={15}/></button>
                          </div>
                        </div>
                        <b>{money(p.price * p.quantity)}</b>
                      </div>
                    ))}
                  </div>
                  <div className="cart-total"><span>{t.total}</span><b>{money(total)}</b></div>
                  <button className="btn-primary full" onClick={() => {
                    setDrawer(false);
                    setModal('checkout');
                  }}>{t.checkout}<ArrowRight size={17}/></button>
                </>
            }
          </aside>
        </div>
      )}

      {modal && (
        <div className="overlay modal-overlay" onMouseDown={e => {
          if (e.target === e.currentTarget) setModal('');
        }}>
          <section className="modal">
            <button className="modal-close" onClick={() => setModal('')}><X/></button>

            {modal === 'auth' && <>
              <span className="eyebrow">WELCOME TO NUTKART</span>
              <h2>{authMode === 'login' ? t.signIn : t.create}</h2>
              <div className="mode-switch">
                <button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>{t.login}</button>
                <button className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')}>{t.register}</button>
              </div>
              <form onSubmit={submitAuth} className="form-stack">
                {authMode === 'register' && <label>{t.name}<input name="name" required minLength="2"/></label>}
                <label>{t.email}<input name="email" type="email" required/></label>
                <label>{t.password}<input name="password" type="password" required minLength="8"/></label>
                {authMode === 'register' && <label>Account type<select name="role"><option value="customer">Customer</option><option value="farmer">Farmer</option></select></label>}
                <button className="btn-primary full" disabled={busy}>{busy ? 'Please wait...' : authMode === 'login' ? t.signIn : t.create}</button>
              </form>
            </>}

            {modal === 'farmer' && <>
              <span className="eyebrow">JOIN OUR FARMER COMMUNITY</span>
              <h2>{t.farmerForm}</h2>
              <p className="modal-sub">Create a farmer account or sign in with your existing farmer account to list produce.</p>
              <button className="btn-primary full" onClick={() => {
                setAuthMode('register');
                setModal('auth');
              }}>{t.create}</button>
              <button className="btn-outline full" onClick={() => {
                setAuthMode('login');
                setModal('auth');
              }}>{t.login}</button>
            </>}

            {modal === 'checkout' && <>
              <span className="eyebrow">ALMOST THERE</span>
              <h2>{t.checkoutTitle}</h2>
              <div className="checkout-summary"><span>{count} items</span><b>{money(total)}</b></div>
              <label className="address-label">{t.address}<textarea id="deliveryAddress" rows="3" placeholder="House / street / city / PIN code"/></label>
              <button className="btn-primary full" disabled={busy} onClick={placeOrder}>{busy ? 'Please wait...' : t.cod}</button>
              <button className="btn-outline full" disabled={busy} onClick={payOnline}>{t.payment}</button>
              <small className="fine-print">Online payment requires Razorpay test keys in the backend configuration.</small>
            </>}

            {modal === 'account' && <>
              <span className="eyebrow">YOUR NUTKART</span>
              <h2>{user?.name}</h2>
              <p>{user?.email}</p>
              <p className="role-label">Account: {user?.role}</p>

              {user?.role === 'farmer' && (
                <form className="form-stack farmer-product-form" onSubmit={submitFarmer}>
                  <h3>List a product</h3>
                  <label>{t.product}<input name="name" required/></label>
                  <label>{t.category}<select name="category"><option>Nuts</option><option>Dry Fruits</option><option>Pulses</option><option>Groundnuts</option></select></label>
                  <label>{t.price}<input name="price" type="number" min="1" required/></label>
                  <label>{t.unit}<input name="unit" placeholder="1 kg" required/></label>
                  <label>{t.image}<input name="image" type="url"/></label>
                  <label>{t.description}<textarea name="description"/></label>
                  <button className="btn-primary full" disabled={busy}>{t.save}</button>
                </form>
              )}

              {orders.length > 0 && <>
                <h3>{t.orderHistory}</h3>
                {orders.map(o => (
                  <div className="order-row" key={o._id}>
                    <Package size={17}/>
                    <span>Order {o._id.slice(-6)} · {o.status}</span>
                    <b>{money(o.total)}</b>
                  </div>
                ))}
              </>}

              <button className="btn-outline full" onClick={logout}><LogOut size={16}/>{t.logout}</button>
            </>}
          </section>
        </div>
      )}
    </div>
  );
}
