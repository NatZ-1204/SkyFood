// Simple reusable modal helpers: showAlert(message), showConfirm(message)
(function(){
  function createOverlay(){
    const ov = document.createElement('div'); ov.className = 'ui-overlay';
    return ov;
  }

  function createModal(title, bodyHtml, options){
    const modal = document.createElement('div'); modal.className = 'ui-modal';
    modal.innerHTML = `
      <div class="ui-header">${title || ''}</div>
      <div class="ui-body">${bodyHtml || ''}</div>
      <div class="ui-footer"></div>
    `;
    return modal;
  }

  function closeOverlay(ov, modal){
    // animate out
    modal.style.animation = 'modalOut 180ms ease forwards';
    setTimeout(()=>{ if (ov && ov.parentNode) ov.parentNode.removeChild(ov); }, 190);
  }

  window.showAlert = function(message, title){
    return new Promise(resolve=>{
      const ov = createOverlay();
      const modal = createModal(title || 'Info', `<div>${message}</div>`);
      const footer = modal.querySelector('.ui-footer');
      const ok = document.createElement('button'); ok.className='ui-btn primary'; ok.textContent='OK';
      ok.addEventListener('click', ()=>{ closeOverlay(ov, modal); resolve(); });
      footer.appendChild(ok);
      ov.appendChild(modal);
      document.body.appendChild(ov);
    });
  }

  window.showConfirm = function(message, title){
    return new Promise(resolve=>{
      const ov = createOverlay();
      const modal = createModal(title || 'Konfirmasi', `<div>${message}</div>`);
      const footer = modal.querySelector('.ui-footer');
      const cancel = document.createElement('button'); cancel.className='ui-btn ghost'; cancel.textContent='Batal';
      const ok = document.createElement('button'); ok.className='ui-btn primary'; ok.textContent='Lanjutkan';
      cancel.addEventListener('click', ()=>{ closeOverlay(ov, modal); resolve(false); });
      ok.addEventListener('click', ()=>{ closeOverlay(ov, modal); resolve(true); });
      footer.appendChild(cancel); footer.appendChild(ok);
      ov.appendChild(modal);
      document.body.appendChild(ov);
    });
  }

  // Pulse the cart badge in navbar to draw attention when items are added
  window.pulseCartBadge = function(){
    try{
      const btn = document.querySelector('.navbar-glass .cart');
      if (!btn) return;
      btn.classList.remove('pulse');
      // trigger reflow to restart animation
      void btn.offsetWidth;
      btn.classList.add('pulse');
      // cleanup after animation
      setTimeout(()=>{ try{ btn.classList.remove('pulse'); }catch(e){} }, 700);
    }catch(e){ /* ignore */ }
  }
})();
