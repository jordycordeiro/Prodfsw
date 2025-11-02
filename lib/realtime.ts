
'use client';
import { createBrowserClient } from '@/lib/supabaseClient';

export function subscribeInbox(onChange: () => void) {
  const supabase = createBrowserClient();
  const channel = supabase
    .channel('inbox-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'user_inbox' }, payload => {
      // Narrow to current user on the RLS boundary; any change triggers UI refresh hooks
      onChange();
    })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}
