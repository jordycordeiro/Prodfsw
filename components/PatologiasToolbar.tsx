'use client'
import React from 'react'
import Toolbar from '@/components/ui/Toolbar'
import ToolbarButton from '@/components/ui/ToolbarButton'

type Props = {
  editing: boolean
  onCopy: () => void
  onToggleEdit: () => void
  onSave: () => void
  onSync: () => void
  onReset: () => void
  onDuplicate: () => void
}

export default function PatologiasToolbar({
  editing, onCopy, onToggleEdit, onSave, onSync, onReset, onDuplicate
}: Props){
  return (
    <Toolbar>
      <ToolbarButton icon="copy" onClick={onCopy}>Copiar prescrição</ToolbarButton>
      <ToolbarButton icon="edit" variant="warning" onClick={onToggleEdit}>
        {editing ? 'Finalizar edição' : 'Editar prescrição'}
      </ToolbarButton>
      <ToolbarButton icon="save" variant="primary" onClick={onSave}>Salvar</ToolbarButton>
      <ToolbarButton icon="sync" variant="outline" onClick={onSync}>Sincronizar</ToolbarButton>
      <ToolbarButton icon="reset" variant="outline" onClick={onReset}>Reset</ToolbarButton>
      <ToolbarButton icon="duplicate" variant="outline" onClick={onDuplicate}>Duplicar quadro</ToolbarButton>
    </Toolbar>
  )
}