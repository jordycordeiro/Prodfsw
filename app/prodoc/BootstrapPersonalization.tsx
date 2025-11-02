// app/prodoc/BootstrapPersonalization.tsx
'use client'

import { useEffect } from 'react'
import { useBaselineBootstrap } from '@/components/utils/useBaselineBootstrap'
import { installPersonalizationGuard } from '@/components/utils/personalization-enhancer'

export default function BootstrapPersonalization({ children }: { children: React.ReactNode }){
  useBaselineBootstrap()
  useEffect(() => { try { installPersonalizationGuard() } catch {} }, [])
  return <>{children}</>
}
