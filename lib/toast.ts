// lib/toast.ts
let host: HTMLDivElement | null = null;

function ensureHost() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;
  if (host && document.body.contains(host)) return host;
  host = document.createElement('div');
  host.id = 'prodoc-toast-host';
  Object.assign(host.style, {
    position: 'fixed',
    right: '24px',
    bottom: '24px',
    zIndex: '9999',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    pointerEvents: 'none'
  } as CSSStyleDeclaration);
  document.body.appendChild(host);
  return host;
}

export function toast(message: string, opts: { type?: 'info'|'success'|'error', durationMs?: number } = {}) {
  const { type = 'success', durationMs = 2200 } = opts;
  const h = ensureHost();
  if (!h) return;

  const card = document.createElement('div');
  const bg = type === 'error' ? '#ef4444' : type === 'info' ? '#0b76d1' : '#10b981';
  const shadow = '0 10px 30px rgba(0,0,0,.12)';
  Object.assign(card.style, {
    pointerEvents: 'auto',
    background: '#fff',
    color: '#0f172a',
    borderRadius: '14px',
    padding: '10px 14px',
    minWidth: '160px',
    boxShadow: shadow,
    border: '1px solid #e6eef8',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transform: 'translateY(20px)',
    opacity: '0',
    transition: 'transform .18s ease, opacity .18s ease'
  } as CSSStyleDeclaration);

  const badge = document.createElement('span');
  Object.assign(badge.style, {
    display: 'inline-block',
    width: '10px', height: '10px', borderRadius: '999px',
    background: bg, flexShrink: '0'
  } as CSSStyleDeclaration);

  const text = document.createElement('div');
  text.textContent = message;
  Object.assign(text.style, { fontWeight: '600' } as CSSStyleDeclaration);

  card.appendChild(badge);
  card.appendChild(text);
  h.appendChild(card);

  requestAnimationFrame(()=>{
    card.style.transform = 'translateY(0)';
    card.style.opacity = '1';
  });

  const remove = () => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(()=>{ try{ h.removeChild(card); }catch{} }, 200);
  };

  setTimeout(remove, durationMs);
  return remove;
}
export default toast;