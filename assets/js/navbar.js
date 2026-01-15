// Shared Navbar component
(function(){
  function isInPages(){ return location.pathname.includes('/pages/'); }
  function resolveIndexPath(){ return isInPages() ? '../index.html' : './index.html'; }
  function resolveCartPath(){ return isInPages() ? './cart.html' : 'pages/cart.html'; }

    const navbarHtml = (page) => `
    <nav class="navbar navbar-expand-lg navbar-light fixed-top navbar-glass">
      <div class="container-fluid navbar-grid">
        <div class="left-area d-flex align-items-center">
          ${page === 'index' ? `<a class="navbar-brand fw-bold text-primary" href="${resolveIndexPath()}">SkyFood</a>` : `<button id="back-btn" class="btn btn-light me-2">←</button><span id="page-title" class="fw-bold ms-1">SkyFood</span>`}
        </div>

        <form class="d-flex search-form" id="nav-search-form" role="search" action="${resolveIndexPath()}" method="GET">
          <input class="form-control search-box" id="nav-search-box" name="q" type="search" placeholder="Cari makanan..." aria-label="Search">
          <button class="btn btn-outline-primary search-btn ms-2" type="submit" aria-label="Cari">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2"/>
              <path d="M20 20 L17 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </form>

        <div class="d-flex align-items-center">
          <a href="${resolveCartPath()}" id="cart-link" class="btn btn-primary cart">🛒 <span id="cart-count">0</span></a>
        </div>
      </div>
    </nav>
  `;

  function insertNavbar(el){
    const page = el.getAttribute('data-page') || 'index';
    el.innerHTML = navbarHtml(page);

    // wire search persistence
    const searchBox = el.querySelector('#nav-search-box');
    const form = el.querySelector('#nav-search-form');
    // initialize search value: prefer URL 'q', then sessionStorage
    const params = new URLSearchParams(location.search);
    const qparam = params.get('q');
    const saved = sessionStorage.getItem('searchQuery');
    if (qparam) searchBox.value = qparam;
    else if (saved) searchBox.value = saved;

    form.addEventListener('submit', (ev)=>{
      ev.preventDefault();
      const q = searchBox.value.trim();
      try{ sessionStorage.setItem('searchQuery', q); }catch(e){}
      // navigate to index with query param
      const index = resolveIndexPath();
      if (q) location.href = index + '?q=' + encodeURIComponent(q);
      else location.href = index;
    });

    // cart count
    const cartCountEl = el.querySelector('#cart-count');
    function updateCount(){ if (cartCountEl) cartCountEl.textContent = Number(localStorage.getItem('cartCount')||0); }
    updateCount();
    window.addEventListener('storage', updateCount);

    // cart link behavior: only store returnTo when coming from a detail page
    const cartLink = el.querySelector('#cart-link');
    if (cartLink && page === 'detail'){
      cartLink.addEventListener('click', ()=>{
        try{ sessionStorage.setItem('returnTo', location.href); }catch(e){}
      });
    }

    // back button behavior
    const backBtn = el.querySelector('#back-btn');
    if (backBtn){
      if (page === 'detail'){
        // Always go back to the dashboard from a product detail
        backBtn.addEventListener('click', ()=>{ location.href = resolveIndexPath(); });
      } else if (page === 'cart'){
        // If we came to cart from a specific product detail, return there; otherwise always go to dashboard
        backBtn.addEventListener('click', ()=>{
          const ret = sessionStorage.getItem('returnTo');
          if (ret){
            try{ sessionStorage.setItem('playDetailEnter','1'); }catch(e){}
            sessionStorage.removeItem('returnTo');
            location.href = ret;
            return;
          }
          location.href = resolveIndexPath();
        });
      } else {
        backBtn.addEventListener('click', ()=>{ if (history.length > 1) history.back(); else location.href = resolveIndexPath(); });
      }
    }
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('[data-insert-navbar]').forEach(insertNavbar);
  });
})();
