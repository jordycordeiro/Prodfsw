'use client'

import React from 'react'

export type AdminSwitchProps = {
  onSaveDraft?: () => void | Promise<void>
  onPublish?: () => void | Promise<void>
}

export function AdminSwitch({ onSaveDraft, onPublish }: AdminSwitchProps){
  return (
    <div className="sticky top-0 z-20 mb-3">
      <div className="title-bar rounded-2xl px-3 py-2 flex items-center gap-2">
        <span className="font-semibold">Modo Administrador</span>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="btn"
            onClick={() => { try { onSaveDraft?.() } catch {} }}
            title="Salvar rascunho do modelo padrão"
          >Salvar rascunho</button>

          <button
            type="button"
            className="btn-chip"
            onClick={() => { try { onPublish?.() } catch {} }}
            title="Publicar atualização para novos usuários (vai para o sino dos atuais)"
          >Publicar</button>
        </div>
      </div>
    </div>
  )
}
