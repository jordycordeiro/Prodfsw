'use client';
// utils/useCopyToast.ts - helper padronizado para o toast "Copiado"
export function useCopyToast(copyFn?: (t: string) => Promise<any> | void) {
  const showToast = () => {
    try { document.dispatchEvent(new CustomEvent('prodoc:copied', { detail: { message: 'Copiado' } })); } catch {}
    const wrap = document.createElement('div');
    wrap.style.cssText = [
      'position:fixed','right:16px','bottom:16px','z-index:2147483647',
      'background:#ffffff','color:#111827','padding:10px 14px',
      'border-radius:14px','box-shadow:0 12px 40px rgba(2,6,23,.15),0 4px 12px rgba(2,6,23,.08)',
      'font-size:15px','font-weight:500','opacity:0','transform:translateY(8px)',
      'transition:all .18s ease','pointer-events:none','display:flex','align-items:center','gap:10px'
    ].join(';');
    const dot = document.createElement('span');
    dot.style.cssText = 'width:10px;height:10px;background:#10b981;border-radius:9999px;display:inline-block;flex:0 0 10px;';
    const text = document.createElement('span');
    text.textContent = 'Copiado';
    wrap.appendChild(dot); wrap.appendChild(text);
    document.body.appendChild(wrap);
    requestAnimationFrame(() => { wrap.style.opacity='1'; wrap.style.transform='translateY(0)'; });
    setTimeout(()=>{ wrap.style.opacity='0'; wrap.style.transform='translateY(8px)'; setTimeout(()=>wrap.remove(), 180); }, 1400);
  };
  return async (text: string) => {
    try {
      if (typeof copyFn === 'function') await copyFn(text);
      else if (navigator?.clipboard?.writeText) await navigator.clipboard.writeText(text);
      showToast();
    } catch {}
  };
}
