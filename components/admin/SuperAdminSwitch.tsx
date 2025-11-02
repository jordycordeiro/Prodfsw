'use client';

import { useEffect, useState } from 'react';

export default function SuperAdminSwitch() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem('prodoc-superadmin') === '1';
    setEnabled(v);
  }, []);

  useEffect(() => {
    localStorage.setItem('prodoc-superadmin', enabled ? '1' : '0');
    const ev = new CustomEvent('prodoc:superadmin', { detail: { enabled } });
    window.dispatchEvent(ev);
  }, [enabled]);

  return (
    <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
      <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} />
      Modo Super Administrador
    </label>
  );
}
