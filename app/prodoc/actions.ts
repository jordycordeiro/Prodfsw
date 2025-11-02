
'use server';

import { createServerClient } from '@/lib/supabaseServer';
import { ensureUserForkBySlug, ensureUserForkByTitle, getTemplateIdBySlug, getTemplateIdByTitle } from '@/lib/templates';
import type { PageContent } from '@/types/prodoc';

/** Salva edição do usuário (copy-on-write) resolvendo template por SLUG */
export async function saveUserEditBySlug({
  userId,
  slug,
  content,
  css,
}: {
  userId: string;
  slug: string;
  content: PageContent;
  css?: string;
}) {
  const supabase = createServerClient();

  // 1) garantir fork
  await ensureUserForkBySlug(userId, slug);

  // 2) obter templateId
  const templateId = await getTemplateIdBySlug(slug);

  // 3) update no fork
  const { data, error } = await supabase
    .from('user_pages')
    .update({ content, css: css ?? null, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('source_template_id', templateId)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

/** Variante por TITLE */
export async function saveUserEditByTitle({
  userId,
  title,
  content,
  css,
}: {
  userId: string;
  title: string;
  content: PageContent;
  css?: string;
}) {
  const supabase = createServerClient();

  // 1) garantir fork
  await ensureUserForkByTitle(userId, title);

  // 2) obter templateId
  const templateId = await getTemplateIdByTitle(title);

  // 3) update no fork
  const { data, error } = await supabase
    .from('user_pages')
    .update({ content, css: css ?? null, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('source_template_id', templateId)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}
