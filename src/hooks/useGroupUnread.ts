import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const LS_KEY = 'group_last_seen_v1';

function getSeen(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
}
function setSeen(map: Record<string, string>) {
  localStorage.setItem(LS_KEY, JSON.stringify(map));
}

export function markGroupSeen(groupId: string) {
  const map = getSeen();
  map[groupId] = new Date().toISOString();
  setSeen(map);
  window.dispatchEvent(new CustomEvent('group-seen-updated'));
}

export function useGroupUnread() {
  const { user } = useAuth();
  const [hasUnread, setHasUnread] = useState(false);

  const check = useCallback(async () => {
    if (!user) { setHasUnread(false); return; }
    const { data: members } = await supabase
      .from('study_group_members').select('group_id').eq('user_id', user.id);
    if (!members || members.length === 0) { setHasUnread(false); return; }
    const ids = members.map(m => m.group_id);
    const { data: msgs } = await supabase
      .from('study_group_messages')
      .select('group_id, created_at, user_id')
      .in('group_id', ids)
      .neq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(200);
    const latest: Record<string, string> = {};
    (msgs || []).forEach(m => {
      if (!latest[m.group_id]) latest[m.group_id] = m.created_at;
    });
    const seen = getSeen();
    const unread = Object.entries(latest).some(([gid, ts]) => !seen[gid] || new Date(ts) > new Date(seen[gid]));
    setHasUnread(unread);
  }, [user]);

  useEffect(() => {
    check();
    if (!user) return;
    const channel = supabase
      .channel('group-unread-watch')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'study_group_messages' }, () => check())
      .subscribe();
    const onSeen = () => check();
    window.addEventListener('group-seen-updated', onSeen);
    const interval = setInterval(check, 30000);
    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('group-seen-updated', onSeen);
      clearInterval(interval);
    };
  }, [user, check]);

  return hasUnread;
}
