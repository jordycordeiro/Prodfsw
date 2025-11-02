
'use client';

import * as React from 'react';
import { publishBroadcast } from '@/src/server/actions/publish';

export default function BroadcastPanel() {
  const [kind, setKind] = React.useState<'template'|'medication'|'observation'|'exam'|'message'>('template');
  const [title, setTitle] = React.useState('Novo template padrão');
  const [payload, setPayload] = React.useState('{}');
  const [versionTag, setVersionTag] = React.useState<string>('v1');

  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  async function onPublish() {
    setBusy(true);
    setMsg(null);
    try {
      const id = await publishBroadcast({
        kind,
        title,
        payload: JSON.parse(payload),
        versionTag
      });
      setMsg(`Publicado! ID: ${id}`);
    } catch (e:any) {
      setMsg(e.message || 'Erro ao publicar');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-4 rounded-2xl border border-neutral-700 bg-neutral-900/40 space-y-3">
      <h3 className="text-lg font-semibold">Broadcast (enviar padrão para usuários)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm opacity-80">Tipo</span>
          <select className="px-3 py-2 rounded-xl bg-neutral-800" value={kind} onChange={e => setKind(e.target.value as any)}>
            <option value="template">Template</option>
            <option value="medication">Medicação</option>
            <option value="observation">Observação</option>
            <option value="exam">Exame</option>
            <option value="message">Mensagem</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm opacity-80">Título</span>
          <input className="px-3 py-2 rounded-xl bg-neutral-800" value={title} onChange={e => setTitle(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-sm opacity-80">Payload (JSON)</span>
          <textarea className="px-3 py-2 rounded-xl bg-neutral-800 min-h-[180px]" value={payload} onChange={e => setPayload(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm opacity-80">Versão</span>
          <input className="px-3 py-2 rounded-xl bg-neutral-800" value={versionTag} onChange={e => setVersionTag(e.target.value)} />
        </label>
      </div>
      <button onClick={onPublish} disabled={busy} className="btn btn-chip">
        {busy ? 'Publicando...' : 'Publicar para usuários'}
      </button>
      {msg && <div className="text-sm opacity-75">{msg}</div>}
    </div>
  );
}
