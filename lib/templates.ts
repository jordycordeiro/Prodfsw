
import { createServerClient } from '@/lib/supabaseServer';
import type { EffectivePage, PageContent } from '@/types/prodoc';

/** ---- Helpers comuns ---- */

export async function publishTemplate({
  templateId,
  version,
  content,
  css,
}: {
  templateId: string;
  version?: number;
  content?: PageContent;
  css?: string;
}) {
  const supabase = createServerClient();
  const { data, error } = await supabase.rpc('publish_template', {
    p_template_id: templateId,
    p_version: version ?? null,
    p_content: content ?? null,
    p_css: css ?? null,
  });
  if (error) throw error;
  return data?.[0] ?? null;
}

/** ---- Via SLUG (recomendada) ---- */

export async function getTemplateIdBySlug(slug: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('templates').select('id').eq('slug', slug).single();
  if (error) throw error;
  return data?.id as string;
}

export async function getEffectivePageBySlug(userId: string, slug: string): Promise<EffectivePage | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase.rpc('get_effective_page_by_slug', {
    p_user_id: userId,
    p_template_slug: slug,
  });
  if (error) throw error;
  return (data?.[0] as EffectivePage) ?? null;
}

export async function ensureUserForkBySlug(userId: string, slug: string) {
  const templateId = await getTemplateIdBySlug(slug);
  const supabase = createServerClient();
  const { data, error } = await supabase.rpc('fork_template_for_user', {
    p_user_id: userId,
    p_template_id: templateId,
  });
  if (error) throw error;
  return data;
}

/** ---- Via TITLE (alternativa) ---- */

export async function getTemplateIdByTitle(title: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('templates').select('id').eq('title', title).single();
  if (error) throw error;
  return data?.id as string;
}

export async function getEffectivePageByTitle(userId: string, title: string): Promise<EffectivePage | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase.rpc('get_effective_page_by_title', {
    p_user_id: userId,
    p_template_title: title,
  });
  if (error) throw error;
  return (data?.[0] as EffectivePage) ?? null;
}

export async function ensureUserForkByTitle(userId: string, title: string) {
  const templateId = await getTemplateIdByTitle(title);
  const supabase = createServerClient();
  const { data, error } = await supabase.rpc('fork_template_for_user', {
    p_user_id: userId,
    p_template_id: templateId,
  });
  if (error) throw error;
  return data;
}
