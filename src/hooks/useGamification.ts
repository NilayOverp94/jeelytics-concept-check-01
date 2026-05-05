import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface XPState { xp: number; level: number; points: number; }

const BADGE_DEFS = [
  { key: 'first_test', name: 'First Steps', emoji: '🎯', desc: 'Complete your first test' },
  { key: 'streak_7', name: 'Week Warrior', emoji: '🔥', desc: '7-day streak' },
  { key: 'streak_30', name: 'Unstoppable', emoji: '⚡', desc: '30-day streak' },
  { key: 'tests_10', name: 'Dedicated', emoji: '📚', desc: '10 tests completed' },
  { key: 'tests_50', name: 'Scholar', emoji: '🎓', desc: '50 tests completed' },
  { key: 'tests_100', name: 'Master', emoji: '👑', desc: '100 tests completed' },
  { key: 'perfect_score', name: 'Perfectionist', emoji: '💯', desc: 'Score 100% on a test' },
  { key: 'level_5', name: 'Rising Star', emoji: '⭐', desc: 'Reach level 5' },
  { key: 'level_10', name: 'Elite', emoji: '🏆', desc: 'Reach level 10' },
  { key: 'social', name: 'Social Butterfly', emoji: '💬', desc: 'Send 50 group messages' },
];
export const BADGES = BADGE_DEFS;

export function useGamification() {
  const { user } = useAuth();
  const [xpState, setXpState] = useState<XPState>({ xp: 0, level: 1, points: 0 });
  const [badges, setBadges] = useState<string[]>([]);

  const refresh = useCallback(async () => {
    if (!user) return;
    const { data: xp } = await supabase.from('user_xp').select('xp, level, points').eq('user_id', user.id).maybeSingle();
    if (xp) setXpState(xp as XPState);
    const { data: b } = await supabase.from('user_badges').select('badge_key').eq('user_id', user.id);
    if (b) setBadges(b.map((r: any) => r.badge_key));
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const awardXP = useCallback(async (amount: number) => {
    if (!user) return null;
    const { data } = await supabase.rpc('award_xp', { p_amount: amount });
    await refresh();
    return data?.[0] as { new_xp: number; new_level: number; leveled_up: boolean } | undefined;
  }, [user, refresh]);

  const grantBadge = useCallback(async (badgeKey: string) => {
    if (!user || badges.includes(badgeKey)) return false;
    const { error } = await supabase.from('user_badges').insert({ user_id: user.id, badge_key: badgeKey } as any);
    if (!error) { setBadges(prev => [...prev, badgeKey]); return true; }
    return false;
  }, [user, badges]);

  // Progress toward next level: level n requires xp >= 100*(n-1)^2
  const nextLevelXp = 100 * (xpState.level) * (xpState.level);
  const prevLevelXp = 100 * (xpState.level - 1) * (xpState.level - 1);
  const progressPct = Math.min(100, Math.round(((xpState.xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100));

  return { xpState, badges, awardXP, grantBadge, refresh, nextLevelXp, progressPct };
}
