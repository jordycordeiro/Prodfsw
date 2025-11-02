'use client';

import React, { useState } from 'react';
import { useProdocStore } from './useProdocStore';

type SimpleModel = {
  id: string;
  title?: string;
  content?: string;
  selected?: boolean;
};

export default function Medicacoes() {
  const store: any = useProdocStore() ?? {};
  const state: any = store.state ?? {};
  const models: SimpleModel[] = (state.medicacoes ?? []) as SimpleModel[];

  const [editing, setEditing] = useState(false);

  const doCopy = async (text: string) => {
    if (typeof store.copyToClipboard === 'function') {
      store.copyToClipboard(text);
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  const copySelecionados = () => {
    const marcados = models.filter(m => m.selected);
    const alvo = marcados.length ? marcados : models;
    const texto = alvo
      .map(m => (m.title ? `# ${m.title}\n${m.content ?? ''}` : (m.content ?? '')))
      .join('\n\n');
    doCopy(texto);
  };

  const salvar = () => state?.persist?.flush?.();
  const sincronizar = () => state?.sync?.('medicacoes');

  const handleAdd = () => {
    if (typeof store.addModel === 'function') store.addModel('medicacoes');
    else state?.addModel?.('medicacoes');
  };

  const handleDelete = (id: string) => {
    if (typeof store.removeModel === 'function') return store.removeModel('medicacoes', id);
    if (typeof store.deleteModel === 'function') return store.deleteModel('medicacoes', id);
    if (state?.removeModel) return state.removeModel('medicacoes', id);
    if (state?.deleteModel) return state.deleteModel('medicacoes', id);
  };

  return (
    <section className="bg-white border rounded-2xl shadow-soft p-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {/* 1º: Copiar (destacado) */}
        <button type="button" className="btn btn-brand" onClick={copySelecionados}>
          Copiar selecionados
        </button>

        {/* 2º: Editar */}
        <button type="button" className="btn" onClick={() => setEditing(v => !v)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
            </svg>
        </button>

        {/* 3º: Adicionar (apenas em edição) */}
        {editing && (
          <button type="button" className="btn" onClick={handleAdd}>
            + Adicionar bloco
          </button>
        )}

        {/* 4º e 5º: Ações neutras */}
        {editing && (<button type="button" className="btn" onClick={() => { salvar(); setEditing(false); }}>
          Salvar
        </button>)}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {models.map((m) => (
          <div key={m.id} className="rounded-2xl border shadow-soft bg-white overflow-hidden">
            {/* Header azul */}
            <div
              className="px-4 py-2.5 text-white flex items-center justify-between rounded-t-2xl"
              style={{ background: 'var(--prodoc-blue, #0a70c7)' }}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!m.selected}
                  onChange={() => store.toggleSelect?.('medicacoes', m.id)}
                  className="h-4 w-4 rounded border-white/40 bg-white/10"
                  style={{ accentColor: 'var(--prodoc-blue, #0a70c7)' }}
                />

                {!editing ? (
                  <div className="font-semibold tracking-wide">{m.title || 'Sem título'}</div>
                ) : (
                  <input
                    value={m.title ?? ''}
                    onChange={(e) => store.updateModel?.('medicacoes', m.id, { title: e.currentTarget.value })}
                    className="bg-white/10 text-white placeholder-white/70 border border-white/30 focus:border-white/60 focus:ring-white/50 rounded-md px-3 py-1.5"
                    placeholder="Título"
                  />
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Copiar conteúdo do card */}
                <button
                  type="button"
                  onClick={() => doCopy(m?.content ?? '')}
                  aria-label="Copiar"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 ring-1 ring-white/20 backdrop-blur-sm transition-all"
                  title="Copiar"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <rect x="2" y="2" width="13" height="13" rx="2" />
                  </svg>
                </button>

                {/* Excluir — só em edição */}
                {editing && (
                  <button
                    type="button"
                    onClick={() => handleDelete(m.id)}
                    aria-label="Excluir"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 ring-1 ring-white/20 backdrop-blur-sm transition-all"
                    title="Excluir"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" /><path d="M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-4 bg-blue-50 border-t border-blue-200 rounded-b-2xl">
              <textarea
                className={`w-full min-h-[120px] resize-y rounded-md outline-none ${'bg-blue-50'}`}
                value={m.content ?? ''}
                readOnly={!editing}
                aria-readonly={!editing}
                onChange={(e) => editing && store.updateModel?.('medicacoes', m.id, { content: e.currentTarget.value })}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
