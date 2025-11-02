'use server'

import { createServerClient } from '@/lib/supabase/server'

type InboxItem = {
  id: string
  title: string
  body: string | null
  createdAt: string
  read?: boolean
  read_at?: string | null
  applied?: boolean
  applied_at?: string | null
  status?: string
}

/**
 * Retorna até 50 mensagens da tabela `user_inbox`,
 * ordenadas por data de criação (mais recentes primeiro).
 * Fallback: retorna [] se ocorrer erro (evita quebrar a UI).
 */
export async function getInbox(): Promise<InboxItem[]> {
  try {
    const sb = createServerClient()

    // Busca direta na tabela (sem RPC)
    const { data, error } = await sb
      .from('user_inbox')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    // Normaliza o formato para a UI
    return (data ?? []).map((r: any) => ({
      id: r.id,
      title: r.title ?? '(sem título)',
      body: r.body ?? null,
      createdAt: r.created_at,
      read: r.read ?? false,
      read_at: r.read_at ?? null,
      applied: r.applied ?? false,
      applied_at: r.applied_at ?? null,
      status: r.status ?? (r.read ? 'read' : 'unread'),
    }))
  } catch (e: any) {
    console.error('[Inbox] Falha ao buscar no Supabase:', e?.message || e)
    return []
  }
}

/**
 * Aplica atualizações pendentes do inbox
 */
export async function applyInbox(inboxId: string) {
  try {
    const sb = createServerClient()

    // Busca o item do inbox
    const { data: inboxItem, error: fetchError } = await sb
      .from('user_inbox')
      .select('*')
      .eq('id', inboxId)
      .single()

    if (fetchError || !inboxItem) {
      return { error: 'Item não encontrado', success: false }
    }

    // Aqui você implementa a lógica de aplicar a atualização
    // Por exemplo, atualizar uma prescrição baseada no payload do inbox

    // Marca como lido/aplicado
    const { error: updateError } = await sb
      .from('user_inbox')
      .update({ applied: true, applied_at: new Date().toISOString() })
      .eq('id', inboxId)

    if (updateError) {
      return { error: updateError.message, success: false }
    }

    return { success: true, error: null }
  } catch (error: any) {
    console.error('[Inbox] Erro ao aplicar inbox:', error?.message || error)
    return { error: 'Erro ao aplicar atualização', success: false }
  }
}

/**
 * Marca uma notificação como lida
 */
export async function markInboxRead(inboxId: string) {
  try {
    const sb = createServerClient()

    const { error } = await sb
      .from('user_inbox')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('id', inboxId)

    if (error) {
      return { error: error.message, success: false }
    }

    return { success: true, error: null }
  } catch (error: any) {
    console.error('[Inbox] Erro ao marcar como lido:', error?.message || error)
    return { error: 'Erro ao marcar notificação', success: false }
  }
}

/**
 * Alias para compatibilidade
 */
export async function markInboxAsRead(inboxId: string) {
  return markInboxRead(inboxId)
}

/**
 * Marca TODAS as notificações como lidas
 */
export async function markInboxAllRead() {
  try {
    const sb = createServerClient()

    const { error } = await sb
      .from('user_inbox')
      .update({ read: true, read_at: new Date().toISOString() })
      .is('read', null)

    if (error) {
      return { error: error.message, success: false }
    }

    return { success: true, error: null }
  } catch (error: any) {
    console.error('[Inbox] Erro ao marcar todas como lidas:', error?.message || error)
    return { error: 'Erro ao marcar notificações', success: false }
  }
}

/**
 * Reverte uma prescrição para a versão anterior (rollback)
 */
export async function rollbackPrescription(prescriptionId: string, versionId: string) {
  try {
    const sb = createServerClient()

    // Busca a versão específica
    const { data: version, error: versionError } = await sb
      .from('prescription_versions')
      .select('*')
      .eq('id', versionId)
      .eq('prescription_id', prescriptionId)
      .single()

    if (versionError || !version) {
      return { error: 'Versão não encontrada', success: false }
    }

    // Atualiza a prescrição com os dados da versão
    const { error: updateError } = await sb
      .from('prescriptions')
      .update({
        title: version.title,
        label: version.label,
        cards: version.cards,
        updated_at: new Date().toISOString(),
      })
      .eq('id', prescriptionId)

    if (updateError) {
      return { error: updateError.message, success: false }
    }

    return { success: true, error: null }
  } catch (error: any) {
    console.error('[Inbox] Erro ao fazer rollback:', error?.message || error)
    return { error: 'Erro ao reverter prescrição', success: false }
  }
}

/**
 * Remove uma notificação do inbox
 */
export async function deleteInboxItem(inboxId: string) {
  try {
    const sb = createServerClient()

    const { error } = await sb
      .from('user_inbox')
      .delete()
      .eq('id', inboxId)

    if (error) {
      return { error: error.message, success: false }
    }

    return { success: true, error: null }
  } catch (error: any) {
    console.error('[Inbox] Erro ao deletar inbox:', error?.message || error)
    return { error: 'Erro ao remover notificação', success: false }
  }
}