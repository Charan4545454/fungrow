// Lightweight interactions for Teenlancer
document.addEventListener('DOMContentLoaded', () => {
  // Nav toggles (both pages)
  function wireNav(toggleId, linksId) {
    const btn = document.getElementById(toggleId);
    const links = document.getElementById(linksId);
    if (!btn || !links) return;
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      links.classList.toggle('show');
    });
  }
  wireNav('nav-toggle', 'nav-links');
  wireNav('nav-toggle-2', 'nav-links-2');

  // Year filler
  const y = new Date().getFullYear();
  const yEl = document.getElementById('year');
  const y2El = document.getElementById('year-2');
  if (yEl) yEl.textContent = y;
  if (y2El) y2El.textContent = y;

  // Animated metric counters
  document.querySelectorAll('.metric .metric-value').forEach(el => {
    const raw = el.dataset.value || el.textContent;
    if (!raw) return;
    let target = parseInt(raw.toString().replace(/\D/g,''),10) || 0;
    let prefix = el.textContent.trim().startsWith('₹') ? '₹' : (raw.toString().includes('₹') ? '₹' : '');
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();
    function tick(now){
      const t = Math.min(1, (now - startTime) / duration);
      const eased = t*(2-t); // easeOutQuad
      const value = Math.floor(eased * target);
      el.textContent = prefix + value.toLocaleString();
      if (t < 1) requestAnimationFrame(tick);
      else {
        // append plus if applicable
        if (target >= 1000 && prefix === '') el.textContent = el.textContent + '+';
        if (prefix === '₹' && target >= 100000) el.textContent = '₹' + (target/100000).toFixed(1) + 'L+';
      }
    }
    requestAnimationFrame(tick);
  });

  // Tabs for categories
  const tabs = document.querySelectorAll('.tab');
  const grid = document.getElementById('category-grid');
  if (tabs && grid) {
    tabs.forEach(tab => tab.addEventListener('click', (e) => {
      tabs.forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      document.querySelectorAll('#category-grid .cat-card').forEach(card=>{
        if (filter === 'all' || card.dataset.cat === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }));
  }

  // Timeline tabs
  document.querySelectorAll('.timeline-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.timeline-tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const step = btn.dataset.step;
      document.querySelectorAll('.timeline-panel').forEach(p => {
        p.classList.toggle('active', p.dataset.step === step);
      });
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (q && a) {
      q.addEventListener('click', () => {
        const expanded = q.getAttribute('aria-expanded') === 'true';
        q.setAttribute('aria-expanded', String(!expanded));
        if (expanded) {
          a.hidden = true;
        } else {
          a.hidden = false;
        }
      });
    }
  });

  // Modals (join & post)
  function wireModal(openSelector, modalId) {
    document.querySelectorAll(openSelector).forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.setAttribute('aria-hidden','false');
        modal.querySelector('.modal-close')?.focus();
        // trap focus basic:
        modal.addEventListener('keydown', ev => {
          if (ev.key === 'Escape') closeModal(modal);
        }, { once: true });
      });
    });
  }
  function closeModal(modal) {
    modal.setAttribute('aria-hidden','true');
  }
  // Wire join teen modal
  const joinBtn = document.getElementById('join-teen-btn');
  const joinCta = document.getElementById('join-cta');
  if (joinBtn) joinBtn.addEventListener('click', ()=>openJoin());
  if (joinCta) joinCta.addEventListener('click', ()=>openJoin());
  function openJoin(){ const m = document.getElementById('join-modal'); if (m) m.setAttribute('aria-hidden','false'); }
  // Join modal close
  document.querySelectorAll('#join-modal .modal-close').forEach(b => b.addEventListener('click', () => closeModal(document.getElementById('join-modal'))));
  // Wire post project buttons
  const postBtns = [document.getElementById('post-project-btn'), document.getElementById('post-project-top'), document.getElementById('post-project-cta'), document.getElementById('post-cta')];
  postBtns.forEach(b => { if (b) b.addEventListener('click', ()=> {
    const modal = document.getElementById('post-modal') || document.getElementById('post-modal-2');
    if (modal) modal.setAttribute('aria-hidden','false');
  })});
  document.querySelectorAll('#post-modal .modal-close, #post-modal-2 .modal-close').forEach(b=>b.addEventListener('click', (e)=>{
    const modal = e.target.closest('.modal'); if (modal) closeModal(modal);
  }));

  // Basic form handlers (simulate)
  document.querySelectorAll('#join-form, #post-form, #post-form-2').forEach(form=>{
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const modal = form.closest('.modal');
      // Show a subtle confirmation (could be replaced with real API)
      alert('Thanks — your submission is received (demo).');
      if (modal) closeModal(modal);
      form.reset();
    });
  });

  // Calculator logic
  const hoursRange = document.getElementById('hoursRange');
  const rateRange = document.getElementById('rateRange');
  const hoursVal = document.getElementById('hoursVal');
  const rateVal = document.getElementById('rateVal');
  const calcAmount = document.getElementById('calcAmount');
  function updateCalc(){
    const hours = parseInt(hoursRange?.value || 0,10);
    const rate = parseInt(rateRange?.value || 0,10);
    if (hoursVal) hoursVal.textContent = hours;
    if (rateVal) rateVal.textContent = rate;
    const monthly = hours * rate * 4;
    if (calcAmount) calcAmount.textContent = '₹' + monthly.toLocaleString();
  }
  if (hoursRange) hoursRange.addEventListener('input', updateCalc);
  if (rateRange) rateRange.addEventListener('input', updateCalc);
  updateCalc();

  // Save calc (demo)
  const saveCalc = document.getElementById('save-calc');
  if (saveCalc) saveCalc.addEventListener('click', () => {
    alert('Estimate saved to your profile (demo).');
  });

  // Simple accessibility: close modals on background click
  document.querySelectorAll('.modal').forEach(mod => {
    mod.addEventListener('click', (e) => {
      if (e.target === mod) closeModal(mod);
    });
  });

  // Lightweight on-scroll reveal for glass cards
  const revealEls = document.querySelectorAll('.glass, .cat-card, .feature');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.transition = 'transform 700ms cubic-bezier(.2,.9,.2,1), opacity 700ms';
        e.target.style.transform = 'translateY(0)';
        e.target.style.opacity = '1';
        obs.unobserve(e.target);
      } else {
        e.target.style.transform = 'translateY(8px)';
        e.target.style.opacity = '0';
      }
    });
  }, { threshold: 0.08 });
  revealEls.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; obs.observe(el); });

  // Simple page switch for nav anchor smooth behavior
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      // allow default for same-page anchors (smooth)
      e.preventDefault();
      const id = a.getAttribute('href').substring(1);
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });

});
