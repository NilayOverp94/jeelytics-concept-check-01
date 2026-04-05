import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // This function checks all users and sends relevant notifications
    // It should be called via a cron job or manually

    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    // 1. Find users who haven't taken a test in 2+ days
    const { data: inactiveUsers } = await supabase
      .from('user_stats')
      .select('user_id, last_test_date, total_tests')
      .lt('last_test_date', twoDaysAgo.toISOString())
      .gt('total_tests', 0);

    if (inactiveUsers && inactiveUsers.length > 0) {
      for (const u of inactiveUsers) {
        // Check if we already sent a notification today
        const { data: existing } = await supabase
          .from('notifications')
          .select('id')
          .eq('user_id', u.user_id)
          .eq('type', 'test_reminder')
          .gte('created_at', new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString())
          .limit(1);

        if (!existing || existing.length === 0) {
          const daysSince = Math.floor((now.getTime() - new Date(u.last_test_date!).getTime()) / (1000 * 60 * 60 * 24));
          await supabase.from('notifications').insert({
            user_id: u.user_id,
            title: '📚 Time to Practice!',
            message: `You haven't taken a test in ${daysSince} days. Consistency is key for JEE success!`,
            type: 'test_reminder',
            link: '/home',
          });
        }
      }
    }

    // 2. Find users weak in specific subjects (score < 40% in recent tests)
    const { data: recentTests } = await supabase
      .from('test_results')
      .select('user_id, subject, score, total_questions')
      .gte('created_at', new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (recentTests && recentTests.length > 0) {
      // Group by user and subject
      const userSubjectScores: Record<string, Record<string, { total: number; count: number }>> = {};
      for (const t of recentTests) {
        if (!userSubjectScores[t.user_id]) userSubjectScores[t.user_id] = {};
        if (!userSubjectScores[t.user_id][t.subject]) userSubjectScores[t.user_id][t.subject] = { total: 0, count: 0 };
        userSubjectScores[t.user_id][t.subject].total += t.score;
        userSubjectScores[t.user_id][t.subject].count += t.total_questions;
      }

      for (const [userId, subjects] of Object.entries(userSubjectScores)) {
        for (const [subject, scores] of Object.entries(subjects)) {
          const percentage = (scores.total / scores.count) * 100;
          if (percentage < 40 && scores.count >= 5) {
            // Check if already notified today for this subject
            const { data: existing } = await supabase
              .from('notifications')
              .select('id')
              .eq('user_id', userId)
              .eq('type', 'weak_subject')
              .gte('created_at', new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString())
              .ilike('message', `%${subject}%`)
              .limit(1);

            if (!existing || existing.length === 0) {
              await supabase.from('notifications').insert({
                user_id: userId,
                title: `⚠️ ${subject} Needs Attention`,
                message: `Your recent ${subject} scores suggest you need more practice. Try focusing on weaker topics!`,
                type: 'weak_subject',
                link: '/home',
              });
            }
          }
        }
      }
    }

    // 3. Subscription expiry reminders (3 days before)
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const { data: expiringSubs } = await supabase
      .from('user_subscriptions')
      .select('user_id, expires_at')
      .eq('status', 'active')
      .lt('expires_at', threeDaysFromNow.toISOString())
      .gt('expires_at', now.toISOString());

    if (expiringSubs && expiringSubs.length > 0) {
      for (const sub of expiringSubs) {
        const { data: existing } = await supabase
          .from('notifications')
          .select('id')
          .eq('user_id', sub.user_id)
          .eq('type', 'subscription_expiry')
          .gte('created_at', new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString())
          .limit(1);

        if (!existing || existing.length === 0) {
          const daysLeft = Math.ceil((new Date(sub.expires_at!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          await supabase.from('notifications').insert({
            user_id: sub.user_id,
            title: '⏰ Subscription Expiring Soon',
            message: `Your premium subscription expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}. Renew now to keep unlimited access!`,
            type: 'subscription_expiry',
            link: '/pricing',
          });
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      processed: {
        inactive_reminders: inactiveUsers?.length || 0,
        weak_subject_checks: recentTests?.length || 0,
        expiry_reminders: expiringSubs?.length || 0,
      }
    }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Auto-notification error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
