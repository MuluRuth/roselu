// ============================================================
// rosèlu — Shared Store Logic
// Cart, Wishlist, Dark Mode, WhatsApp
// ============================================================

const PRODUCTS = [
  { id:1, name:"Mombasa Rose",    sub:"1970s Acetate Revival",      price:4500, cat:"vintage", badge:"New Arrival",  badge_color:"tertiary", img:"https://lh3.googleusercontent.com/aida-public/AB6AXuAjpoef8Bq8DD3wf_EOmu6d4KO2WeALgIdpmPzCXTDNNF-CyKJype1ZJE48OFwwLARISLeYJblGl740er4hT2cATfTJ8bgcY9dD17AVw6rdebQCH3_zJXndHXFWoxYxPGUfg1LnW1IgGt8L9VEqbmEu_ohtK681po5jXXLew_t2d0aGJ9Ctpt-RCVgVb2sPvTEvwmIPgBWkgMWQE_eic96fwcOBTMNB1GU9VDn2A86_VU6LwCZGVIoxjqD58x5XqvYEHn88dCyt_EBL", stock:3 },
  { id:2, name:"Lilac Nights",    sub:"Cat-eye Geometric",          price:5200, cat:"modern",  badge:null,            badge_color:"",         img:"https://lh3.googleusercontent.com/aida-public/AB6AXuB_RRzqJEdJ9oVU6UsGplCl-WcrliOpvnjOp0A8_iSOdJyF7qrPAeUXkXfvuInm6hsTWZwoVMjfnaDCCwQyp6ng5B-xVKXevahfpltUBoXDMdib90aQ6OABYkfZ2SyFduVkHbPrqcyij20wTy9wa3jrs-vOLH1dtAxXvdD-PLs7e6UUE00zVHUdzoDwotpKRRR1A_qGB1Ve6Gj5FdIsGbxbpxskPlQrTmqM0Z5mCrSKPeqtwf8ZvldWt4R8n4jZreIwODDuI4omoA4w", stock:7 },
  { id:3, name:"Kilimani Retro",  sub:"Translucent Frameless",      price:3800, cat:"vintage", badge:"Archive Piece", badge_color:"primary",  img:"https://lh3.googleusercontent.com/aida-public/AB6AXuBXhxB4RolgZxz1BjJqnOOR1zv9GgE8hovJkJMzaYZsp6j_-74Ak92tFIStx4qm-pTHB3qNzr90xSjx6h6BvO4QVyxrPYncv0ZnYwnXf284Jug8pJeabGza58vbXumsj2AebMHGouzVDhFLaMJ-UXs9Y4R0d4F4wpspG5jdDrV49xAmotfbF2icTcbxCYymR-zUxzaZFIAzqGpi-WND2Ce2Ct08Nc9udr0GjrU-7Px2DqrLHU-0xuvec_mVaGE3l6iPgIrw1XGYILTm", stock:2 },
  { id:4, name:"Sunset Valley",   sub:"Gold-rimmed Gradient",       price:6000, cat:"vintage", badge:null,            badge_color:"",         img:"https://lh3.googleusercontent.com/aida-public/AB6AXuBz13QtHXxRZD7OaqkUGEVbSHdluwXS0OLuROCRu2_7Vo_7wldgvC1xeMJZFUOGnZWo4aA3m6Oyj2CK9wplCmXyBMF3NnHK9HOM1hnMCgc_xN0zDTO9kYY9vfhQbSuvARqOWXko45OISGpoMI44F4FMWMUJszD_lyHTwHPWJPOiFdzIWw_c4cM_S9DiYV-pkZuZwcOH0gTtBmdnHpDohAbtOdZxAIcxLucJ7oYtc3jWnFDFAmZUcXUkM_qGoIy6RsEvtwjCj0yvgEUJ", stock:5 },
  { id:5, name:"Diani Candy",     sub:"Chunky Resin Pink",          price:4200, cat:"modern",  badge:null,            badge_color:"",         img:"https://lh3.googleusercontent.com/aida-public/AB6AXuADDLtKUFfX7xdGt2ps1G818Clx3DI7sWqOyFMgREMmT215p-WLQ7Us2_rv-aO-iEWX7cGDREwquHhqL1c3aWIFw3yatwhyel2Wa8aPWjppPJcQaMvcai6NAOf4MluKZWecqYM8MdaYvMI0KwWP9l2A2qQKuIfpIoSJmPQTh2UF1KFyfw468rV5pbZv17DGVdGC6caOfI0pwmnqkoORaYzeCJG_QIoUb8Ciik3GDUJTwHsNd4Zrkm9C1YQsmiBtD9FDf_i7i2EuNUFB", stock:1 },
  { id:6, name:"Amethyst Muse",   sub:"Deep Purple Aviator",        price:5500, cat:"vintage", badge:null,            badge_color:"",         img:"https://lh3.googleusercontent.com/aida-public/AB6AXuD5XfMohLWKW2sBzkJXvRyTgz96tFptzM8d-L3QtKmTiRuwt6MWHfaYToxesvTITamiiDfa2CvkmtNHhHx91ZokUJgi9kfDHw1SyNtCaUgi-UPdEF8YuLtnhImXYzt8kVeAyI-ZCc8Dwag01dvbIHuV8c1zmMk6FB0QK3X7wSEfSTw5gywrRMIQSeA0oXmQJVF5DCoDSQy68vntdDf9IWYO4KFAwMI7P7rNEX_LV-WXQHApTz-to4W-KLJdCqMZ8UN64cqvf29_-d1A", stock:4 },
  { id:7, name:"Blossom Pink",    sub:"Vintage Series · Pink",      price:14500,cat:"vintage", badge:"Rare Find",     badge_color:"tertiary", img:"https://lh3.googleusercontent.com/aida-public/AB6AXuDMnpYEG0EvCbYDS5aeHiA1XcZDkhgevN6XJeF06uaZf6uBHIHbT0uGd6dn6cY6e36T4qHwad7EGbGQZZRIWNT2qwwMJNKZxGAUSfd3mBT-6ZhKH3q6nF3sAAEeJ3xnLJC5QSvZqmsrCHArfL_TabN3H12UhsL7_xvv94g4XBQNN3vVK_Pkq0ef_txUw3lgXk91Y5NlmyWhxigNK9rBCV3MnugifFImJMmuo7VX4aN2-0nePbs-niq6KTzaAOuexugMgzyIF9jNMMl0", stock:1 },
  { id:8, name:"Matrix Muse",     sub:"90s Minimalist Metal",       price:3800, cat:"modern",  badge:"Rare",          badge_color:"primary",  img:"https://lh3.googleusercontent.com/aida-public/AB6AXuCn0m5URBAtK6I_Q3Xnwqu8_pSshb39vZo5yahjokuGI1xPdUWsnO6PLC1HKRqPyn77tW5491oFIjD3CIJhtw8Hc0-b1Bvxe9ETpAAsP_wbZ7TS23SkaMv1JmsE1ZX2-o_ulFcQTa-hJEsIcTcNQj04SMQv2-YnZC3tievG_CeISsMBZoy58UZRKK9XhRZuuQ9dTD3DJEoYmeHJ4Ot2eT0v0QXh7ujj1r8ymwmyQW64brg3HVL57iTbx3jEftP1-ozGLVw_y_rxdGeQ", stock:6 },
];

// ── DARK MODE ──────────────────────────────────────────────
const DarkMode = {
  init() {
    const saved = localStorage.getItem('roselu-dark');
    if (saved === 'true') document.documentElement.classList.add('dark');
    this.updateIcon();
  },
  toggle() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('roselu-dark', document.documentElement.classList.contains('dark'));
    this.updateIcon();
  },
  updateIcon() {
    const isDark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.dark-toggle-icon').forEach(el => {
      el.textContent = isDark ? 'light_mode' : 'dark_mode';
    });
  }
};

// ── CART ──────────────────────────────────────────────────
const Cart = {
  get() { return JSON.parse(localStorage.getItem('roselu-cart') || '[]'); },
  save(cart) { localStorage.setItem('roselu-cart', JSON.stringify(cart)); this.updateBadge(); },
  add(productId) {
    const cart = this.get();
    const existing = cart.find(i => i.id === productId);
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    if (existing) { if (existing.qty < product.stock) existing.qty++; }
    else cart.push({ id: productId, qty: 1 });
    this.save(cart);
    this.showToast(product.name);
    this.renderDrawer();
  },
  remove(productId) {
    const cart = this.get().filter(i => i.id !== productId);
    this.save(cart);
    this.renderDrawer();
  },
  updateQty(productId, qty) {
    const cart = this.get();
    const item = cart.find(i => i.id === productId);
    if (item) { item.qty = Math.max(1, qty); this.save(cart); this.renderDrawer(); }
  },
  total() { return this.get().reduce((s, i) => { const p = PRODUCTS.find(x => x.id === i.id); return s + (p ? p.price * i.qty : 0); }, 0); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  updateBadge() {
    const count = this.count();
    document.querySelectorAll('.cart-badge').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  },
  showToast(name) {
    let t = document.getElementById('cart-toast');
    if (!t) { t = document.createElement('div'); t.id = 'cart-toast'; t.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-on-surface text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl flex items-center gap-2 transition-all'; document.body.appendChild(t); }
    t.innerHTML = `<span class="material-symbols-outlined text-sm" style="font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24">check_circle</span> ${name} added to cart`;
    t.style.opacity = '1'; t.style.transform = 'translate(-50%, 0)';
    clearTimeout(t._timer);
    t._timer = setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translate(-50%, 12px)'; }, 2500);
  },
  openDrawer() { document.getElementById('cart-drawer')?.classList.add('open'); document.getElementById('drawer-overlay')?.classList.add('show'); },
  closeDrawer() { document.getElementById('cart-drawer')?.classList.remove('open'); document.getElementById('drawer-overlay')?.classList.remove('show'); },
  renderDrawer() {
    const drawer = document.getElementById('cart-items');
    if (!drawer) return;
    const cart = this.get();
    if (cart.length === 0) {
      drawer.innerHTML = `<div class="flex flex-col items-center justify-center h-64 text-on-surface-variant"><span class="material-symbols-outlined text-5xl mb-4 opacity-30">shopping_bag</span><p class="text-sm font-bold uppercase tracking-widest opacity-50">Your cart is empty</p><a href="catalog.html" class="mt-4 text-xs text-primary font-bold uppercase tracking-widest border-b border-primary pb-1">Browse Collection</a></div>`;
    } else {
      drawer.innerHTML = cart.map(item => {
        const p = PRODUCTS.find(x => x.id === item.id);
        if (!p) return '';
        return `<div class="flex gap-4 py-4 border-b border-outline-variant/20">
          <img src="${p.img}" class="w-20 h-24 object-cover rounded-xl flex-shrink-0" alt="${p.name}"/>
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-on-surface text-sm mb-1 truncate">${p.name}</h4>
            <p class="text-xs text-on-surface-variant mb-3">${p.sub}</p>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 bg-surface-container-low rounded-full px-2 py-1">
                <button onclick="Cart.updateQty(${p.id}, ${item.qty - 1})" class="w-6 h-6 flex items-center justify-center hover:text-primary transition-colors font-bold text-lg leading-none">−</button>
                <span class="text-sm font-bold w-4 text-center">${item.qty}</span>
                <button onclick="Cart.updateQty(${p.id}, ${item.qty + 1})" class="w-6 h-6 flex items-center justify-center hover:text-primary transition-colors font-bold text-lg leading-none">+</button>
              </div>
              <span class="font-bold text-primary text-sm">KSh ${(p.price * item.qty).toLocaleString()}</span>
            </div>
          </div>
          <button onclick="Cart.remove(${p.id})" class="text-on-surface-variant hover:text-primary transition-colors self-start mt-1"><span class="material-symbols-outlined text-sm">close</span></button>
        </div>`;
      }).join('');
    }
    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.textContent = 'KSh ' + this.total().toLocaleString();
    this.updateBadge();
  }
};

// ── WISHLIST ──────────────────────────────────────────────
const Wishlist = {
  get() { return JSON.parse(localStorage.getItem('roselu-wishlist') || '[]'); },
  save(list) { localStorage.setItem('roselu-wishlist', JSON.stringify(list)); this.updateBadge(); },
  toggle(productId) {
    const list = this.get();
    const idx = list.indexOf(productId);
    if (idx > -1) { list.splice(idx, 1); } else { list.push(productId); }
    this.save(list);
    this.updateHearts();
  },
  has(productId) { return this.get().includes(productId); },
  count() { return this.get().length; },
  updateBadge() {
    const count = this.count();
    document.querySelectorAll('.wishlist-badge').forEach(el => {
      el.textContent = count; el.style.display = count > 0 ? 'flex' : 'none';
    });
  },
  updateHearts() {
    document.querySelectorAll('[data-wishlist-id]').forEach(btn => {
      const id = parseInt(btn.dataset.wishlistId);
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) icon.style.fontVariationSettings = this.has(id) ? "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24" : "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24";
      btn.style.color = this.has(id) ? '#bd0050' : '';
    });
  }
};

// ── WHATSAPP ──────────────────────────────────────────────
const WhatsApp = {
  PHONE: '254700000000', // Replace with real rosèlu WhatsApp number
  order(productName, price) {
    const msg = encodeURIComponent(`Hi rosèlu! 👓\n\nI'd like to order:\n*${productName}* — KSh ${price.toLocaleString()}\n\nPlease confirm availability and delivery details. Asante!`);
    window.open(`https://wa.me/${this.PHONE}?text=${msg}`, '_blank');
  },
  cartOrder(items) {
    const lines = items.map(i => { const p = PRODUCTS.find(x => x.id === i.id); return p ? `• ${p.name} x${i.qty} — KSh ${(p.price*i.qty).toLocaleString()}` : ''; }).filter(Boolean).join('\n');
    const total = Cart.total();
    const msg = encodeURIComponent(`Hi rosèlu! 👓\n\nI'd like to order:\n${lines}\n\n*Total: KSh ${total.toLocaleString()}*\n\nPlease confirm and arrange Bodaboda delivery. Asante!`);
    window.open(`https://wa.me/${this.PHONE}?text=${msg}`, '_blank');
  }
};

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  DarkMode.init();
  Cart.updateBadge();
  Wishlist.updateBadge();
  Wishlist.updateHearts();
  Cart.renderDrawer();
});