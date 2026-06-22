/* =========  State  ========= */
let cart = [];
let products = [];
let jobs = [];
let selectedEmoji = '📦';
let selectedPlan = 2;

const sampleProducts = [
  { id: 1, name: 'iPhone 15 Pro Max 256GB', price: 950000, oldPrice: 1100000, emoji: '📱', seller: 'TechZone NG', rating: 4.8, reviews: 234, badges: ['hot'], category: 'electronics', desc: 'Brand new iPhone 15 Pro Max. Fast performance, premium build.' },
  { id: 2, name: 'MacBook Air M3 Chip', price: 1250000, oldPrice: 0, emoji: '💻', seller: 'AppleHub Lagos', rating: 4.9, reviews: 89, badges: ['new'], category: 'electronics', desc: 'Lightweight, powerful and efficient. Perfect for work & school.' },
  { id: 3, name: 'Samsung 4K Smart TV 55"', price: 380000, oldPrice: 450000, emoji: '📺', seller: 'ElectroMart', rating: 4.6, reviews: 156, badges: ['sale'], category: 'electronics', desc: 'Crystal-clear 4K picture with smart apps built in.' },
  { id: 4, name: 'Sony WH-1000XM5 Headphones', price: 145000, oldPrice: 0, emoji: '🎧', seller: 'SoundCity', rating: 4.7, reviews: 312, badges: [], category: 'electronics', desc: 'Industry-leading noise cancellation and premium comfort.' },
  { id: 5, name: 'Nike Air Force 1 White', price: 55000, oldPrice: 70000, emoji: '👟', seller: 'SneakerHub NG', rating: 4.5, reviews: 445, badges: ['sale'], category: 'fashion', desc: 'Classic everyday sneakers with durable leather finish.' },
  { id: 6, name: 'DSLR Camera Canon EOS R50', price: 420000, oldPrice: 0, emoji: '📷', seller: 'PhotoPro NG', rating: 4.8, reviews: 67, badges: ['new'], category: 'electronics', desc: 'Capture stunning photos and smooth 4K video.' },
  { id: 7, name: 'Leather Office Chair', price: 85000, oldPrice: 110000, emoji: '🪑', seller: 'FurniturePlus', rating: 4.4, reviews: 188, badges: ['sale'], category: 'home-living', desc: 'Comfortable ergonomic chair for long work sessions.' },
  { id: 8, name: "Men's Agbada Suit Set", price: 35000, oldPrice: 0, emoji: '👘', seller: 'FashionHaus NG', rating: 4.6, reviews: 92, badges: ['hot'], category: 'fashion', desc: 'Elegant traditional wear, tailored for special occasions.' },
  { id: 9, name: 'Portable Solar Generator', price: 220000, oldPrice: 280000, emoji: '⚡', seller: 'GreenPower NG', rating: 4.7, reviews: 143, badges: ['hot'], category: 'electronics', desc: 'Reliable backup power for home and small business.' },
  { id: 10, name: 'Gas Cooker 4-Burner', price: 68000, oldPrice: 80000, emoji: '🍳', seller: 'KitchenWorld', rating: 4.5, reviews: 267, badges: ['sale'], category: 'home-living', desc: 'Fast cooking with durable burners and easy cleaning.' },
];

const sampleJobs = [
  { id: 1, title: 'Senior Software Engineer', company: 'Flutterwave', location: 'Lagos', type: 'Full-time', salary: '₦800K–₦1.2M', skills: ['React', 'Node.js', 'AWS'], logo: '💳', date: '2 days ago' },
  { id: 2, title: 'Digital Marketing Manager', company: 'Dangote Group', location: 'Abuja', type: 'Full-time', salary: '₦450K–₦650K', skills: ['SEO', 'Meta Ads', 'Analytics'], logo: '🏭', date: '1 day ago' },
  { id: 3, title: 'Petroleum Engineer', company: 'Shell Nigeria', location: 'Port Harcourt', type: 'Full-time', salary: '₦1.5M–₦2M', skills: ['Reservoir Eng', 'AutoCAD'], logo: '🛢️', date: '3 days ago' },
  { id: 4, title: 'UX/UI Designer', company: 'Paystack', location: 'Lagos (Remote)', type: 'Remote', salary: '₦500K–₦750K', skills: ['Figma', 'Prototyping'], logo: '💠', date: 'Today' },
  { id: 5, title: 'Financial Analyst', company: 'Zenith Bank', location: 'Lagos', type: 'Full-time', salary: '₦350K–₦500K', skills: ['Excel', 'SAP'], logo: '🏦', date: '5 days ago' },
  { id: 6, title: 'Civil Engineer (Site)', company: 'Julius Berger', location: 'Abuja', type: 'Contract', salary: '₦600K–₦900K', skills: ['AutoCAD', 'Civil 3D'], logo: '🏗️', date: '1 week ago' },
];

/* =========  Routing / Navigation  ========= */
function showSection(name) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(name + '-section');
  if (el) el.classList.add('active');
  if (name === 'seller') {
    const isMobile = window.innerWidth <= 640;
    const qa = document.getElementById('mobileQuickActions');
    if (qa) qa.style.display = isMobile ? 'block' : 'none';
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setActiveNav(section) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (!section) return;
  const target = document.querySelector(`.nav-item[data-nav="${section}"]`);
  if (target) target.classList.add('active');
}

function go(route) {
  if (route.startsWith('category:')) {
    const cat = route.split(':')[1];
    setActiveNav(cat === 'all' ? 'home' : cat);
    filterCategory(cat);
    showSection('home');
    return;
  }
  if (route.startsWith('product:')) {
    const id = route.split(':')[1];
    openProductPageById(id);
    return;
  }
  if (route === 'advertise') { showModal('advertiseModal'); return; }
  if (route === 'login') { showModal('loginModal'); return; }
  if (route === 'register') { showModal('registerModal'); return; }
  setActiveNav(route);
  showSection(route);
}

function setMbbActive(el) {
  document.querySelectorAll('.mbb-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
}

function scrollToProducts() {
  document.getElementById('productsSection')?.scrollIntoView({ behavior: 'smooth' });
}

/* =========  Drawer  ========= */
function openDrawer() {
  document.getElementById('mobileDrawer').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  document.getElementById('mobileDrawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* =========  Modals  ========= */
function showModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}
document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', function (e) {
    if (e.target === this) {
      this.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});

function switchTab(el, tabId) {
  const modal = el.closest('.modal');
  modal.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  modal.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

/* =========  Toast  ========= */
function showToast(msg, icon = '✅') {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  document.getElementById('toastIcon').textContent = icon;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* =========  Helpers  ========= */
function esc(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
function formatNaira(n) {
  return '₦' + Number(n || 0).toLocaleString();
}
function getAllProducts() { return [...sampleProducts, ...products]; }
function getAllJobs() { return [...sampleJobs, ...jobs]; }

/* =========  Product rendering + category filtering  ========= */
let currentCategory = 'all';

function filterCategory(cat) {
  currentCategory = cat || 'all';
  renderProducts();
  showToast(currentCategory === 'all' ? 'Showing all products' : `Showing ${currentCategory}`, '🧭');
}

function doSearch() {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const cat = document.getElementById('searchCategory')?.value || 'all';
  if (!q) { showToast('Type something to search', '🔍'); return; }
  currentCategory = cat === 'jobs' ? 'all' : cat;
  renderProducts(q);
  showToast(`Searching "${q}"`, '🔍');
}

function renderProducts(searchQuery = '') {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const all = getAllProducts();
  let list = all;
  if (currentCategory && currentCategory !== 'all') {
    list = list.filter(p => (p.category || 'other') === currentCategory);
  }
  if (searchQuery) {
    list = list.filter(p =>
      (p.name || '').toLowerCase().includes(searchQuery) ||
      (p.seller || '').toLowerCase().includes(searchQuery) ||
      (p.desc || '').toLowerCase().includes(searchQuery)
    );
  }
  if (!list.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;background:#fff;padding:16px;border-radius:12px;box-shadow:var(--shadow-sm);color:var(--gray-600)">No products found.</div>`;
    return;
  }
  grid.innerHTML = list.map(p => {
    const badges = (p.badges || []).map(b => `<span class="badge badge-${b}">${esc(b.toUpperCase())}</span>`).join('');
    const oldPrice = p.oldPrice ? `<div class="product-old-price">${formatNaira(p.oldPrice)}</div>` : '';
    return `
      <div class="product-card" onclick="go('product:${p.id}')">
        <div class="product-img">
          <div class="product-badges">${badges}</div>
          <button class="wishlist-btn" onclick="event.stopPropagation();showToast('Added to wishlist ❤️','❤️')">♡</button>
          <span>${esc(p.emoji || '📦')}</span>
        </div>
        <div class="product-info">
          <div class="product-name">${esc(p.name)}</div>
          <div class="product-seller">by ${esc(p.seller || 'Corazon Seller')}</div>
          <div class="product-rating">
            <span class="star">★★★★★</span>
            <span style="font-weight:600">${esc(p.rating || 4.5)}</span>
            <span style="color:var(--gray-400)">(${esc(p.reviews || 0)})</span>
          </div>
          <div class="product-price-row">
            <div>
              <div class="product-price">${formatNaira(p.price)}</div>
              ${oldPrice}
            </div>
            <button class="add-cart-btn" onclick="event.stopPropagation();addToCart('${esc(p.name)}',${Number(p.price)},'${esc(p.emoji || '📦')}')">+ Cart</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* =========  Sponsored ads rendering  ========= */
function renderSponsoredAds() {
  const grid = document.getElementById('adProductsGrid');
  if (!grid) return;
  const fixedAds = [
    { name: 'Premium Rice 50kg Bag', price: 45000, emoji: '🌾', seller: 'FarmFresh Ltd', hot: false },
    { name: 'Health Supplement Pack', price: 12500, emoji: '💊', seller: 'VitalCare NG', hot: false },
    { name: 'Solar Panel 400W Kit', price: 180000, emoji: '⚡', seller: 'SunPower NG', hot: true },
    { name: 'Block & Cement Package', price: 250000, emoji: '🏗️', seller: 'BuildMart NG', hot: false },
  ];
  const userAds = products.filter(p => p.advertise).slice(0, 4).map(p => ({
    name: p.name, price: p.price, emoji: p.emoji || '📦', seller: 'Your Store', hot: true,
  }));
  const list = [...userAds, ...fixedAds];
  grid.innerHTML = list.map(ad => `
    <div class="ad-product-card" onclick="showToast('Sponsored ad clicked','📢')">
      <div class="ad-product-badge">${ad.hot ? '🔥 Hot Ad' : '📢 Ad'}</div>
      <div class="ad-product-icon">${esc(ad.emoji)}</div>
      <div class="ad-product-name">${esc(ad.name)}</div>
      <div class="ad-product-price">${formatNaira(ad.price)}</div>
      <div class="ad-product-seller">by ${esc(ad.seller)}</div>
      <button class="btn btn-primary btn-sm" style="margin-top:10px;width:100%" onclick="event.stopPropagation();addToCart('${esc(ad.name)}',${Number(ad.price)},'${esc(ad.emoji)}')">Add to Cart</button>
    </div>
  `).join('');
}

/* =========  Product detail page  ========= */
function openProductPageById(id) {
  const p = getAllProducts().find(x => String(x.id) === String(id));
  if (!p) { showToast('Product not found', '⚠️'); return; }
  renderProductPage(p);
  showSection('product');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderProductPage(p) {
  const el = document.getElementById('productPage');
  if (!el) return;
  el.innerHTML = `
    <div style="background:#fff;border-radius:16px;box-shadow:var(--shadow-sm);padding:18px;border:1.5px solid var(--gold-border)">
      <div class="product-page-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start">
        <div style="background:var(--primary-light);border-radius:12px;min-height:240px;display:flex;align-items:center;justify-content:center;font-size:96px;border:2px solid var(--gold-border)">
          ${esc(p.emoji || '📦')}
        </div>
        <div>
          <h1 style="font-family:'Syne',sans-serif;font-size:22px;font-weight:800;margin-bottom:8px;color:var(--secondary)">${esc(p.name)}</h1>
          <div style="color:var(--gray-600);font-size:13px;margin-bottom:10px">
            Sold by <b style="color:var(--primary-dark)">${esc(p.seller || 'Corazon Seller')}</b>
          </div>
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:12px">
            <span class="star">★★★★★</span>
            <span style="font-weight:700">${esc(p.rating || 4.5)}</span>
            <span style="color:var(--gray-400)">(${esc(p.reviews || 0)} reviews)</span>
          </div>
          <div style="font-family:'Syne',sans-serif;font-size:28px;font-weight:900;color:var(--primary);margin-bottom:10px">
            ${formatNaira(p.price)}
          </div>
          ${p.oldPrice ? `<div style="color:var(--gray-400);text-decoration:line-through;margin-bottom:12px">${formatNaira(p.oldPrice)}</div>` : ''}
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn btn-primary" onclick="addToCart('${esc(p.name)}',${Number(p.price)},'${esc(p.emoji || '📦')}')">🛒 Add to Cart</button>
            <button class="btn btn-outline" onclick="showToast('Added to wishlist ❤️','❤️')">♡ Wishlist</button>
          </div>
        </div>
      </div>
      <div style="margin-top:18px;padding-top:18px;border-top:1px solid var(--gold-border)">
        <h3 style="font-family:'Syne',sans-serif;font-size:16px;font-weight:800;margin-bottom:8px;color:var(--primary-dark)">Description</h3>
        <p style="color:var(--gray-600);line-height:1.7;font-size:14px;margin:0">
          ${esc(p.desc || 'Verified seller. Buyer protection on all orders. Free returns within 7 days.')}
        </p>
      </div>
    </div>
  `;
  const grid = el.querySelector('.product-page-grid');
  if (grid) grid.style.gridTemplateColumns = window.innerWidth <= 640 ? '1fr' : '1fr 1fr';
}

window.addEventListener('resize', () => {
  const grid = document.querySelector('#productPage .product-page-grid');
  if (grid) grid.style.gridTemplateColumns = window.innerWidth <= 640 ? '1fr' : '1fr 1fr';
  const qa = document.getElementById('mobileQuickActions');
  const sellerActive = document.getElementById('seller-section')?.classList.contains('active');
  if (qa && sellerActive) qa.style.display = (window.innerWidth <= 640) ? 'block' : 'none';
});

/* =========  Jobs rendering + search  ========= */
function renderJobs(containerId, count) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const all = getAllJobs();
  const list = count ? all.slice(0, count) : all;
  el.innerHTML = list.map(j => `
    <div class="job-card">
      <div class="job-header">
        <div class="job-logo">${esc(j.logo || '🏢')}</div>
        <div>
          <div class="job-title">${esc(j.title)}</div>
          <div class="job-company">🏢 ${esc(j.company)} · 📍 ${esc(j.location)}</div>
        </div>
      </div>
      <div class="job-tags">
        <span class="job-tag">⏱ ${esc(j.type)}</span>
        ${(j.skills || []).map(s => `<span class="job-tag">${esc(s)}</span>`).join('')}
      </div>
      <div class="job-footer">
        <span class="job-salary">${esc(j.salary || 'Competitive')}</span>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span class="job-date">📅 ${esc(j.date || 'Today')}</span>
          <button class="btn btn-green btn-sm" onclick="showToast('Application sent to ${esc(j.company)}!','💼')">Apply</button>
        </div>
      </div>
    </div>
  `).join('');
}

function searchJobs() {
  const q = document.getElementById('jobSearchInput')?.value.trim().toLowerCase();
  if (!q) { showToast('Type a job keyword', '🔍'); return; }
  const all = getAllJobs().filter(j =>
    (j.title || '').toLowerCase().includes(q) ||
    (j.company || '').toLowerCase().includes(q) ||
    (j.location || '').toLowerCase().includes(q) ||
    (j.skills || []).join(' ').toLowerCase().includes(q)
  );
  const el = document.getElementById('allJobsGrid');
  if (!el) return;
  if (!all.length) {
    el.innerHTML = `<div style="grid-column:1/-1;background:#fff;padding:16px;border-radius:12px;box-shadow:var(--shadow-sm);color:var(--gray-600)">No jobs found.</div>`;
    return;
  }
  el.innerHTML = all.map(j => `
    <div class="job-card">
      <div class="job-header">
        <div class="job-logo">${esc(j.logo || '🏢')}</div>
        <div>
          <div class="job-title">${esc(j.title)}</div>
          <div class="job-company">🏢 ${esc(j.company)} · 📍 ${esc(j.location)}</div>
        </div>
      </div>
      <div class="job-tags">
        <span class="job-tag">⏱ ${esc(j.type)}</span>
        ${(j.skills || []).map(s => `<span class="job-tag">${esc(s)}</span>`).join('')}
      </div>
      <div class="job-footer">
        <span class="job-salary">${esc(j.salary || 'Competitive')}</span>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span class="job-date">📅 ${esc(j.date || 'Today')}</span>
          <button class="btn btn-green btn-sm" onclick="showToast('Application sent to ${esc(j.company)}!','💼')">Apply</button>
        </div>
      </div>
    </div>
  `).join('');
  showToast(`Jobs found: ${all.length}`, '✅');
}

/* =========  Seller table  ========= */
function renderSellerTable() {
  const tbody = document.getElementById('sellerProductsTable');
  if (!tbody) return;
  const list = products.length > 0 ? products : sampleProducts.slice(0, 4);
  tbody.innerHTML = list.map(p => `
    <tr>
      <td><span style="font-size:16px;margin-right:5px">${esc(p.emoji || '📦')}</span>${esc(p.name)}</td>
      <td style="font-weight:700;color:var(--primary);white-space:nowrap">${formatNaira(p.price)}</td>
      <td>${esc(p.stock || Math.floor(Math.random() * 50 + 5))}</td>
      <td><span class="status-badge ${Math.random() > .3 ? 'status-active' : 'status-pending'}">${Math.random() > .3 ? 'Active' : 'Pending'}</span></td>
      <td style="white-space:nowrap">
        <button class="btn btn-outline btn-sm" style="margin-right:4px" onclick="showModal('addProductModal')">Edit</button>
        <button class="btn btn-sm" style="background:var(--red);color:#fff" onclick="showToast('Removed (demo)','🗑️')">✕</button>
      </td>
    </tr>
  `).join('');
}

/* =========  Cart  ========= */
function addToCart(name, price, emoji) {
  const ex = cart.find(i => i.name === name);
  if (ex) ex.qty++;
  else cart.push({ name, price, emoji, qty: 1 });
  updateCart();
  showToast(`${name} added to cart!`, '🛒');
}

function updateCart() {
  const count = cart.reduce((a, i) => a + i.qty, 0);
  document.getElementById('cartCount').textContent = count;
  const mbbBadge = document.getElementById('mbbCartCount');
  if (mbbBadge) {
    mbbBadge.textContent = count;
    mbbBadge.style.display = count > 0 ? 'flex' : 'none';
  }
  const itemsEl = document.getElementById('cartItems');
  const emptyEl = document.getElementById('cartEmpty');
  const footerEl = document.getElementById('cartFooter');
  if (!cart.length) {
    emptyEl.style.display = 'block';
    itemsEl.innerHTML = '';
    footerEl.style.display = 'none';
    return;
  }
  emptyEl.style.display = 'none';
  footerEl.style.display = 'block';
  itemsEl.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-icon">${esc(item.emoji || '📦')}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${esc(item.name)}</div>
        <div class="cart-item-price">${formatNaira(item.price)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${idx},-1)">−</button>
          <span style="font-weight:700;font-size:14px;min-width:22px;text-align:center">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${idx},1)">+</button>
          <button onclick="removeFromCart(${idx})"
            style="background:none;border:none;color:var(--red);cursor:pointer;font-size:12px;margin-left:8px;padding:4px">
            Remove
          </button>
        </div>
      </div>
      <div style="font-weight:700;font-size:13px;color:var(--primary-dark);flex-shrink:0">
        ${formatNaira(item.price * item.qty)}
      </div>
    </div>
  `).join('');
  const total = cart.reduce((a, i) => a + i.price * i.qty, 0);
  document.getElementById('cartSubtotal').textContent = formatNaira(total);
  document.getElementById('cartTotal').textContent = formatNaira(total);
}

function changeQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateCart();
}
function removeFromCart(idx) {
  cart.splice(idx, 1);
  updateCart();
}
function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}
function checkout() {
  showToast('Redirecting to checkout... 🔒', '🔒');
  setTimeout(() => {
    cart = [];
    updateCart();
    toggleCart();
    showModal('loginModal');
  }, 1200);
}

/* =========  Auth demo  ========= */
function handleLogin() {
  closeModal('loginModal');
  showToast('Signed in! Welcome back 👋', '✅');
}
function handleRegister(role) {
  closeModal('registerModal');
  showToast(`${role} account created! Welcome to Corazon Marketplace 🎉`, '🎉');
  if (role === 'Seller') setTimeout(() => go('seller'), 500);
}

/* =========  Add product + emoji + ads  ========= */
function selectEmoji(el, emoji) {
  selectedEmoji = emoji;
  document.querySelectorAll('#emojiPicker span').forEach(s => s.style.background = '');
  el.style.background = 'var(--primary-light)';
}

function submitProduct() {
  const name = document.getElementById('pName').value.trim();
  const cat = document.getElementById('pCat').value;
  const price = Number(document.getElementById('pPrice').value);
  const oldPrice = Number(document.getElementById('pOldPrice').value) || 0;
  const stock = Number(document.getElementById('pStock').value) || 10;
  const desc = document.getElementById('pDesc').value.trim();
  const advertise = document.getElementById('pAdvertise').checked;
  if (!name || !cat || !price || !desc) {
    showToast('Please fill required fields!', '⚠️');
    return;
  }
  products.push({
    id: Date.now(), name, category: cat, price, oldPrice, stock, desc,
    emoji: selectedEmoji, seller: 'My Store', rating: 4.5, reviews: 0,
    badges: ['new'], advertise
  });
  closeModal('addProductModal');
  renderProducts();
  renderSellerTable();
  renderSponsoredAds();
  showToast(advertise ? 'Product listed & advertised! 📢' : `"${name}" listed successfully! 📦`, '🚀');
  ['pName', 'pPrice', 'pOldPrice', 'pStock', 'pDesc'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('pCat').value = '';
  document.getElementById('pAdvertise').checked = false;
}

function selectPlan(n) {
  selectedPlan = n;
  [1, 2, 3].forEach(i => {
    const el = document.getElementById('plan' + i);
    if (!el) return;
    if (i === 2) return;
    el.style.borderColor = i === n ? 'var(--primary)' : 'var(--gold-border)';
    el.style.background = i === n ? 'var(--primary-light)' : '';
  });
  showToast(`Selected plan ${n}`, '📢');
}

function submitAd() {
  closeModal('advertiseModal');
  showToast("Ad submitted! We'll contact you shortly 📢", '📢');
}

/* =========  Post job  ========= */
function submitJob() {
  const title = document.getElementById('jTitle').value.trim();
  const company = document.getElementById('jCompany').value.trim();
  const location = document.getElementById('jLocation').value.trim();
  const type = document.getElementById('jType').value;
  const salMin = document.getElementById('jSalMin').value;
  const salMax = document.getElementById('jSalMax').value;
  const desc = document.getElementById('jDesc').value.trim();
  const skills = document.getElementById('jSkills').value.split(',').map(s => s.trim()).filter(Boolean);
  if (!title || !company || !location || !desc) {
    showToast('Please fill required fields!', '⚠️');
    return;
  }
  jobs.push({
    id: Date.now(), title, company, location, type,
    salary: (salMin && salMax) ? `₦${Number(salMin).toLocaleString()}–₦${Number(salMax).toLocaleString()}` : 'Competitive',
    skills, logo: '🏢', date: 'Just now', desc
  });
  closeModal('postJobModal');
  renderJobs('allJobsGrid');
  renderJobs('homeJobsGrid', 3);
  showToast(`Job "${title}" posted! 💼`, '💼');
  ['jTitle', 'jCompany', 'jLocation', 'jSalMin', 'jSalMax', 'jDesc', 'jSkills'].forEach(id => document.getElementById(id).value = '');
}

/* =========  Product image preview  ========= */
function previewProductImg(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById('productImgPreview');
      if (preview) preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

/* =========  Init  ========= */
(function init() {
  currentCategory = 'all';
  renderSponsoredAds();
  renderProducts();
  renderJobs('homeJobsGrid', 3);
  renderJobs('allJobsGrid');
  renderSellerTable();
  const last = document.querySelectorAll('#emojiPicker span');
  if (last && last.length) last[last.length - 1].style.background = 'var(--primary-light)';
})();