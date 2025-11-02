'use client';
/**
 * Esvazia APENAS o rótulo da opção "Escuro" nos <select> (sem mexer no store).
 * Compatível com Next 14 (sem top-level await).
 */
(function () {
  if (typeof window === 'undefined') return;

  function strip(root) {
    try {
      const opts = (root || document).querySelectorAll('option');
      opts.forEach((o) => {
        try {
          const val = (o.value || '').toLowerCase().trim();
          if (val === 'escuro') {
            if (o.textContent !== '') o.textContent = '';
            if ('label' in o && o.label !== '') o.label = '';
          }
        } catch {}
      });
    } catch {}
  }

  function run() {
    strip(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }

  try {
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.addedNodes && m.addedNodes.length) {
          m.addedNodes.forEach((n) => {
            if (n && n.nodeType === 1) strip(n);
          });
        }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  } catch {}
})();

export {};
