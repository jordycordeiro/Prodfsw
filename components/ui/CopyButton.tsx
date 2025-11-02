'use client'
import React from 'react'

type Props = {
  onClick?: () => void
  children?: React.ReactNode
  className?: string
  disabled?: boolean
}

export default function CopyButton({ onClick, children='Copiar', className, disabled }: Props){
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={
        'inline-flex items-center justify-center rounded-full px-4 py-1.5 ' +
        'bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium ' +
        'shadow-sm transition focus:outline-none focus:ring-2 focus:ring-slate-400 ' +
        'disabled:opacity-50 disabled:cursor-not-allowed ' + (className||'')
      }>
      {children}
    </button>
  )
}
