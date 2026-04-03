// ============================================================
// rosèlu — Search & Admin Fix
// Add this to your existing roselu.js at the bottom
// ============================================================

// ── SEARCH ────────────────────────────────────────────────
const Search = {
  init() {
    // Add search overlay to body if not exists
    if (!document.getElementById('search-overlay')) {
      document.body.insertAdjacentHTML('beforeend', `
        <div id="search-overlay" style="display:none;position:fixed;inset:0;z-index:150;background:rgba(83,36,38,0.6);backdrop-filter:blur(4px);" onclick="Search.close()">
        </div>
        <div id="search-panel" style="display:none;position:fixed;top:0;left:0;right:0;z-index:151;background:var(--bg);padding:2rem;box-shadow:0 10px 40px rgba(83,36,38,0.15);">
          <div style="max-width:600px;margin:0 auto;">
            <div style="display:flex;align-items:center;gap:12px;background:var(--surface-low);border-radius:999px;padding:12px 20px;margin-bottom:1.5rem;">
              <span class="material-symbols-outlined" style="color:var(--on-surface-muted);">search</span>
              <input id="search-input" type="text" placeholder="Search frames, styles, colours..." 
                style="flex:1;background:transparent;border:none;outline:none;font-size:16px;color:var(--on-surface);font-family:'Plus Jakarta Sans',sans-serif;"
                oninput="Search.query(this.value)"
                onkeydown="if(event.key==='Escape')Search.close()"/>
              <button onclick="Search.close()" style="background:none;border:none;cursor:pointer;color:var(--on-surface-muted);">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <div id="search-results" style="max-height:60vh;overflow-y:auto;"></div>
          </div>
        </div>
      `);
    }
  },

  open() {
    this.init();
    document.getElementById('search-overlay').style.display = 'block';
    document.getElementById('search-panel').style.display = 'block';
    setTimeout(() => document.getElementById('search-input').focus(), 100);
    this.query(''); // show all products initially
  },

  close() {
    const overlay = document.getElementById('search-overlay');
    const panel = document.getElementById('search-panel');
    if (overlay) overlay.style.display = 'none';
    if (panel) panel.style.display = 'none';
  },

  query(val) {
    const results = document.getElementById('search-results');
    if (!results) return;

    const q = val.toLowerCase().trim();
    const filtered = q === '' ? PRODUCTS : PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.sub.toLowerCase().includes(q) ||
      p.cat.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      results.innerHTML = `
        <div style="text-align:center;padding:2rem;color:var(--on-surface-muted);">
          <span class="material-symbols-outlined" style="font-size:3rem;opacity:0.3;display:block;margin-bottom:1rem;">search_off</span>
          <p style="font-size:14px;">No frames found for "<strong>${val}</strong>"</p>
        </div>`;
      return;
    }

    results.innerHTML = `
      <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.15em;font-weight:700;color:var(--on-surface-muted);margin-bottom:1rem;">
        ${filtered.length} result${filtered.length !== 1 ? 's' : ''}
      </p>
      ${filtered.map(p => `
        <a href="product.html" onclick="Search.close()" style="display:flex;gap:14px;align-items:center;padding:12px;border-radius:12px;text-decoration:none;transition:background 0.15s;" 
           onmouseover="this.style.background='var(--surface-low)'" 
           onmouseout="this.style.background='transparent'">
          <img src="${p.img}" style="width:56px;height:64px;object-fit:cover;border-radius:8px;flex-shrink:0;" alt="${p.name}"/>
          <div style="flex:1;">
            <p style="font-family:'Noto Serif',serif;font-weight:700;font-size:15px;color:var(--on-surface);margin:0 0 2px;">${p.name}</p>
            <p style="font-size:12px;color:var(--on-surface-muted);margin:0 0 6px;">${p.sub}</p>
            <p style="font-size:13px;font-weight:700;color:var(--primary);margin:0;">KSh ${p.price.toLocaleString()}</p>
          </div>
          ${p.stock <= 2 ? `<span style="font-size:10px;font-weight:700;background:var(--primary);color:var(--on-primary);padding:3px 10px;border-radius:999px;">Only ${p.stock} left</span>` : ''}
          <div style="display:flex;gap:6px;">
            <button onclick="event.preventDefault();Cart.add(${p.id});Search.close();" 
              style="background:var(--primary);color:var(--on-primary);border:none;border-radius:999px;padding:6px 14px;font-size:11px;font-weight:700;cursor:pointer;text-transform:uppercase;letter-spacing:0.05em;">
              Add to Cart
            </button>
          </div>
        </a>
      `).join('')}`;
  }
};

// ── FIX SEARCH ICONS IN NAV ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Make all search icons open the search panel
  document.querySelectorAll('.material-symbols-outlined').forEach(el => {
    if (el.textContent.trim() === 'search') {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => Search.open());
    }
  });

  // Fix admin link in footer
  document.querySelectorAll('a[href="admin.html"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'admin.html';
    });
  });

  // Also add keyboard shortcut Cmd+K for search
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      Search.open();
    }
  });
});