// lib/supabase/templates.ts
import { createServerClient } from '@/lib/supabaseServer';


export async function getEffectivePage(userId: string, templateSlug = 'site_base') {
const supabase = createServerClient();
const { data, error } = await supabase
.rpc('get_effective_page', { p_user_id: userId, p_template_slug: templateSlug });
if (error) throw error;
// data: [{ origin: 'user' | 'admin', content, css, version }]
return data?.[0] ?? null;
}


export async function ensureUserFork(userId: string, templateId: string) {
const supabase = createServerClient();
const { data, error } = await supabase
.rpc('fork_template_for_user', { p_user_id: userId, p_template_id: templateId });
if (error) throw error;
return data;
}


export async function publishTemplate({ templateId, version, content, css }:{ templateId: string, version?: number, content?: any, css?: string }) {
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