'use client';

import { useEffect, useState } from 'react';
import type { InboxItem } from '@/lib/types-admin';
import { listInbox, markInboxRead } from '@/app/(app)/prescriptions/actions';

export default function NotificationsBell() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [open, setOpen] = useState(false);

  async function load() {
    const res = await listInbox();
    setItems(res as any);
  }

  useEffect(() => { load(); }, []);

  const unread = items.filter(i => !i.read).length;

  async function markRead(id: string) {
    await markInboxRead(id);
    await load();
  }

  return (
    <div className="relative">
      <button className="btn btn-primary" onClick={() => setOpen(v => !v)}>
        <i className="fas fa-bell"></i>{unread ? ` ${unread}` : ''}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded shadow-lg z-50 p-3 max-h-96 overflow-auto">
          <div className="flex items-center justify-between mb-2">
            <strong>Notificações</strong>
            <button className="btn btn-warning" onClick={load}>Atualizar</button>
          </div>
          {items.length === 0 && <div className="text-sm text-gray-500">Sem novidades.</div>}
          {items.map(it => (
            <div key={it.id} className="border-b py-2">
              <div className="font-medium">{it.title}</div>
              <div className="text-sm text-gray-600">{it.message}</div>
              <div className="text-xs text-gray-400">{new Date(it.created_at).toLocaleString()}</div>
              <div className="mt-1 flex gap-2">
                {!it.read && <button className="action-btn action-view" onClick={() => markRead(it.id)}>Marcar lida</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
