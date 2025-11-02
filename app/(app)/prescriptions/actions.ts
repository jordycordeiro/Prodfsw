'use server'

import { createServerClient } from '@/lib/supabase/server'

/**
 * Garante que a prescrição tem um ID válido
 */
export async function ensurePrescriptionId(slug: string) {
  try {
    const sb = createServerClient()
    const { data: { user } } = await sb.auth.getUser()
    
    if (!user?.id) {
      return { error: 'Usuário não autenticado', id: null }
    }

    const { data: prescription, error } = await sb
      .from('prescriptions')
      .select('id')
      .eq('slug', slug)
      .eq('user_id', user.id)
      .single()

    if (error || !prescription) {
      return { error: 'Prescrição não encontrada', id: null }
    }

    return { id: prescription.id, error: null }
  } catch (error: any) {
    console.error('[Prescriptions] Erro ao buscar ID:', error?.message || error)
    return { error: 'Erro ao buscar prescrição', id: null }
  }
}

/**
 * Lista todas as versões de uma prescrição
 * Retorna array direto (não objeto)
 */
export async function listPrescriptionVersions(prescriptionId: string) {
  try {
    const sb = createServerClient()

    const { data: versions, error } = await sb
      .from('prescription_versions')
      .select('*')
      .eq('prescription_id', prescriptionId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('[Prescriptions] Erro ao listar versões:', error)
      return []
    }

    return versions ?? []
  } catch (error: any) {
    console.error('[Prescriptions] Erro ao listar versões:', error?.message || error)
    return []
  }
}

/**
 * Reverte uma prescrição para uma versão anterior
 */
export async function rollbackPrescription(prescriptionId: string, versionId: string) {
  try {
    const sb = createServerClient()
    const { data: { user } } = await sb.auth.getUser()
    
    if (!user?.id) {
      return { error: 'Usuário não autenticado', success: false }
    }

    const { data: version, error: versionError } = await sb
      .from('prescription_versions')
      .select('*')
      .eq('id', versionId)
      .eq('prescription_id', prescriptionId)
      .single()

    if (versionError || !version) {
      return { error: 'Versão não encontrada', success: false }
    }

    const { error: updateError } = await sb
      .from('prescriptions')
      .update({
        title: version.title,
        label: version.label,
        cards: version.cards,
        updated_at: new Date().toISOString(),
      })
      .eq('id', prescriptionId)
      .eq('user_id', user.id)

    if (updateError) {
      return { error: updateError.message, success: false }
    }

    return { success: true, error: null }
  } catch (error: any) {
    console.error('[Prescriptions] Erro ao fazer rollback:', error?.message || error)
    return { error: 'Erro ao reverter prescrição', success: false }
  }
}

/**
 * Alias com B maiúsculo para compatibilidade
 */
export const rollBackPrescription = rollbackPrescription

/**
 * Lista todas as prescrições do usuário
 */
export async function listPrescriptions() {
  try {
    const sb = createServerClient()
    const { data: { user } } = await sb.auth.getUser()
    
    if (!user?.id) {
      return { error: 'Usuário não autenticado', data: null }
    }

    const { data: prescriptions, error } = await sb
      .from('prescriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('[Prescriptions] Erro ao listar prescrições:', error)
      return { error: error.message, data: null }
    }

    return { data: prescriptions ?? [], error: null }
  } catch (error: any) {
    console.error('[Prescriptions] Erro ao listar prescrições:', error?.message || error)
    return { error: 'Erro ao listar prescrições', data: null }
  }
}

/**
 * Busca uma prescrição específica
 */
export async function getPrescription(prescriptionId: string) {
  try {
    const sb = createServerClient()
    const { data: { user } } = await sb.auth.getUser()
    
    if (!user?.id) {
      return { error: 'Usuário não autenticado', data: null }
    }

    const { data: prescription, error } = await sb
      .from('prescriptions')
      .select('*')
      .eq('id', prescriptionId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('[Prescriptions] Erro ao buscar prescrição:', error)
      return { error: error.message, data: null }
    }

    return { data: prescription, error: null }
  } catch (error: any) {
    console.error('[Prescriptions] Erro ao buscar prescrição:', error?.message || error)
    return { error: 'Erro ao buscar prescrição', data: null }
  }
}

/**
 * Atualiza ou cria uma prescrição
 */
export async function upsertPrescription(prescription: {
  id?: string
  slug: string
  title: string
  label?: string
  cards: any
  is_personal?: boolean
}) {
  try {
    const sb = createServerClient()
    const { data: { user } } = await sb.auth.getUser()
    
    if (!user?.id) {
      return { error: 'Usuário não autenticado', success: false }
    }

    const payload = {
      user_id: user.id,
      slug: prescription.slug,
      title: prescription.title,
      label: prescription.label ?? prescription.title,
      cards: prescription.cards,
      is_personal: prescription.is_personal ?? false,
      updated_at: new Date().toISOString(),
    }

    const { error } = await sb
      .from('prescriptions')
      .upsert(prescription.id ? { ...payload, id: prescription.id } : payload)

    if (error) {
      console.error('[Prescriptions] Erro ao salvar prescrição:', error)
      return { error: error.message, success: false }
    }

    return { success: true, error: null }
  } catch (error: any) {
    console.error('[Prescriptions] Erro ao salvar prescrição:', error?.message || error)
    return { error: 'Erro ao salvar prescrição', success: false }
  }
}

/**
 * Publica atualização para todos os usuários (ADMIN)
 */
export async function publishToAllUsers(template: {
  slug: string
  title: string
  label?: string
  cards: any
}) {
  try {
    const sb = createServerClient()
    const { data: { user } } = await sb.auth.getUser()
    
    if (!user?.id) {
      return { error: 'Usuário não autenticado', success: false }
    }

    const { error: templateError } = await sb
      .from('templates')
      .upsert({
        slug: template.slug,
        title: template.title,
        label: template.label ?? template.title,
        cards: template.cards,
        updated_at: new Date().toISOString(),
      })

    if (templateError) {
      return { error: templateError.message, success: false }
    }

    const { error: broadcastError } = await sb
      .from('broadcasts')
      .insert({
        type: 'template_updated',
        payload: { slug: template.slug, title: template.title },
      })

    if (broadcastError) {
      return { error: broadcastError.message, success: false }
    }

    return { success: true, error: null }
  } catch (error: any) {
    console.error('[Prescriptions] Erro ao publicar:', error?.message || error)
    return { error: 'Erro ao publicar atualização', success: false }
  }
}

/**
 * Transmite atualização para todos os usuários
 */
export async function broadcastUpdateToAll(update: {
  type: string
  payload: any
}) {
  try {
    const sb = createServerClient()

    const { error } = await sb
      .from('broadcasts')
      .insert({
        type: update.type,
        payload: update.payload,
      })

    if (error) {
      return { error: error.message, success: false }
    }

    return { success: true, error: null }
  } catch (error: any) {
    console.error('[Prescriptions] Erro ao transmitir:', error?.message || error)
    return { error: 'Erro ao transmitir atualização', success: false }
  }
}

/**
 * Lista inbox de atualizações
 */
export async function listInbox() {
  try {
    const sb = createServerClient()
    const { data: { user } } = await sb.auth.getUser()
    
    if (!user?.id) {
      return { error: 'Usuário não autenticado', data: null }
    }

    const { data: inbox, error } = await sb
      .from('user_inbox')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return { error: error.message, data: null }
    }

    return { data: inbox ?? [], error: null }
  } catch (error: any) {
    console.error('[Prescriptions] Erro ao listar inbox:', error?.message || error)
    return { error: 'Erro ao listar inbox', data: null }
  }
}

/**
 * Marca inbox como lido
 */
export async function markInboxRead(inboxId: string) {
  try {
    const sb = createServerClient()
    const { data: { user } } = await sb.auth.getUser()
    
    if (!user?.id) {
      return { error: 'Usuário não autenticado', success: false }
    }

    const { error } = await sb
      .from('user_inbox')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('id', inboxId)
      .eq('user_id', user.id)

    if (error) {
      return { error: error.message, success: false }
    }

    return { success: true, error: null }
  } catch (error: any) {
    console.error('[Prescriptions] Erro ao marcar inbox:', error?.message || error)
    return { error: 'Erro ao marcar inbox', success: false }
  }
}