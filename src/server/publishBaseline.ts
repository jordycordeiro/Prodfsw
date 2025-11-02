'use server'

import { getServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Publica e faz broadcast global
export async function publishBaseline(payload: any) {
  try {
    const supabase = getServiceClient()

    // Exemplo de persistência — ajuste se o schema for diferente
    const { data, error } = await supabase
      .from('templates')
      .upsert(payload)
      .select()

    if (error) throw error

    // Notifica os usuários conectados (via broadcast / inbox)
    revalidatePath('/prodoc')

    return { ok: true, data }
  } catch (err: any) {
    console.error('Erro ao publicar versão global:', err)
    return { ok: false, message: err.message }
  }
}
