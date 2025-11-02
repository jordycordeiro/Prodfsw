export default function toast(msg: string){
  if (typeof document === 'undefined') return;
  const old = document.querySelector('.toast') as HTMLElement | null;
  if (old) old.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 2200);
}
