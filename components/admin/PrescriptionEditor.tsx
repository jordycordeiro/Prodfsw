'use client';

import { useEffect, useState } from 'react';
import type { Prescription } from '@/lib/types-admin';
import { upsertPrescription, publishToAllUsers } from '@/app/(app)/prescriptions/actions';

export default function PrescriptionEditor({ initial, onClose }:{ initial?: Prescription|null, onClose:()=>void }) {
  const [data, setData] = useState<Prescription>(initial ?? {
    id: 'p' + Math.random().toString(36).slice(2,9),
    title: '',
    section: 'USO ORAL',
    content: '',
    authorId: 'admin',
    updatedAt: new Date().toISOString(),
    isPublished: false,
  } as any);
  const [superMode, setSuperMode] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem('prodoc-superadmin') === '1';
    setSuperMode(v);
    const h = (e: any) => setSuperMode(!!e?.detail?.enabled);
    window.addEventListener('prodoc:superadmin', h as any);
    return () => window.removeEventListener('prodoc:superadmin', h as any);
  }, []);

  async function save() {
    if (superMode) {
      await publishToAllUsers({ ...data, isPublished: true });
      alert('Publicado como padrão global (todos os usuários).');
    } else {
      await upsertPrescription(data);
      alert('Salvo — usuários receberão no sino como um novo card.');
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex">
      <div className="ml-auto h-full w-full max-w-2xl bg-white p-4 overflow-auto">
        <div className="section-header">
          <h3 className="section-title">{data.title || 'Nova Prescrição'}</h3>
          <button className="btn btn-danger" onClick={onClose}><i className="fas fa-times"></i> Fechar</button>
        </div>
        <div className="form-group">
          <label>Título</label>
          <input value={data.title} onChange={e => setData({ ...data, title: e.target.value })} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Seção</label>
            <select value={data.section} onChange={e => setData({ ...data, section: e.target.value as any })}>
              {['USO ORAL','USO EV','USO IM','USO SC','TÓPICO','INALATÓRIO','OUTROS'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <input readOnly value={superMode ? 'Publicação Global (Super Admin)' : 'Atualização Pessoal (Notificação)'} />
          </div>
        </div>
        <div className="form-group">
          <label>Conteúdo</label>
          <textarea value={data.content} onChange={e => setData({ ...data, content: e.target.value })} />
        </div>
        <div className="editor-toolbar">
          <button className="btn btn-primary" onClick={save}>
            <i className="fas fa-save"></i> {superMode ? 'Salvar e Publicar p/ Todos' : 'Salvar (enviar notificação)'}
          </button>
        </div>
      </div>
    </div>
  );
}
