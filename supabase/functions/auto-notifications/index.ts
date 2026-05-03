import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Require service-role bearer to prevent public abuse
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (token !== supabaseServiceKey) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const results = { test_reminders: 0, weak_subjects: 0, expiry_reminders: 0, streak_reminders: 0, pyq_reminders: 0, study_tips: 0, milestones: 0 };

    // Helper: check if notification already sent today
    const alreadySent = async (userId: string, type: string, extraFilter?: string) => {
      let q = supabase.from('notifications').select('id').eq('user_id', userId).eq('type', type).gte('created_at', oneDayAgo.toISOString()).limit(1);
      if (extraFilter) q = q.ilike('message', `%${extraFilter}%`);
      const { data } = await q;
      return data && data.length > 0;
    };

    // 1. Test reminders for inactive users (2+ days)
    const { data: inactiveUsers } = await supabase
      .from('user_stats')
      .select('user_id, last_test_date, total_tests, streak')
      .lt('last_test_date', twoDaysAgo.toISOString())
      .gt('total_tests', 0);

    if (inactiveUsers) {
      for (const u of inactiveUsers) {
        if (await alreadySent(u.user_id, 'test_reminder')) continue;
        const daysSince = Math.floor((now.getTime() - new Date(u.last_test_date!).getTime()) / (1000 * 60 * 60 * 24));
        const messages = [
          `You haven't taken a test in ${daysSince} days. Consistency is key for JEE success! 🎯`,
          `${daysSince} days without practice! Your JEE competitors are studying right now. Don't fall behind! 💪`,
          `Hey! It's been ${daysSince} days. Even 5 questions a day can make a huge difference. Start now! 🚀`,
        ];
        await supabase.from('notifications').insert({
          user_id: u.user_id,
          title: '📚 Time to Practice!',
          message: messages[Math.floor(Math.random() * messages.length)],
          type: 'test_reminder',
          link: '/home',
        });
        results.test_reminders++;
      }
    }

    // 2. Streak reminders (users with streak > 0 who haven't tested today)
    const today = new Date(now.toISOString().split('T')[0]);
    const { data: streakUsers } = await supabase
      .from('user_stats')
      .select('user_id, streak, last_test_date')
      .gt('streak', 0);

    if (streakUsers) {
      for (const u of streakUsers) {
        if (!u.last_test_date) continue;
        const lastTest = new Date(u.last_test_date);
        const diffHours = (now.getTime() - lastTest.getTime()) / (1000 * 60 * 60);
        // If between 18-36 hours (likely to lose streak today)
        if (diffHours >= 18 && diffHours <= 36) {
          if (await alreadySent(u.user_id, 'streak_reminder')) continue;
          await supabase.from('notifications').insert({
            user_id: u.user_id,
            title: `🔥 Don't Lose Your ${u.streak}-Day Streak!`,
            message: `You're about to lose your ${u.streak}-day streak! Take a quick 3-question test to keep it alive.`,
            type: 'streak_reminder',
            link: '/home',
          });
          results.streak_reminders++;
        }
      }
    }

    // 3. Weak subject notifications
    const { data: recentTests } = await supabase
      .from('test_results')
      .select('user_id, subject, score, total_questions')
      .gte('created_at', new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (recentTests && recentTests.length > 0) {
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
            if (await alreadySent(userId, 'weak_subject', subject)) continue;
            const tips: Record<string, string> = {
              Physics: "Try watching the video lectures on mechanics and electrodynamics — they're the most scoring topics!",
              Chemistry: "Focus on Physical Chemistry numericals and Organic reactions — they carry the most marks.",
              Mathematics: "Start with Calculus and Coordinate Geometry — these topics appear most frequently in JEE.",
            };
            await supabase.from('notifications').insert({
              user_id: userId,
              title: `⚠️ ${subject} Needs Attention`,
              message: `Your ${subject} scores are below 40% this week. ${tips[subject] || 'Try focusing on weaker topics!'}`,
              type: 'weak_subject',
              link: '/home',
            });
            results.weak_subjects++;
          }
        }
      }
    }

    // 4. Subscription expiry reminders
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const { data: expiringSubs } = await supabase
      .from('user_subscriptions')
      .select('user_id, expires_at')
      .eq('status', 'active')
      .lt('expires_at', threeDaysFromNow.toISOString())
      .gt('expires_at', now.toISOString());

    if (expiringSubs) {
      for (const sub of expiringSubs) {
        if (await alreadySent(sub.user_id, 'subscription_expiry')) continue;
        const daysLeft = Math.ceil((new Date(sub.expires_at!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        await supabase.from('notifications').insert({
          user_id: sub.user_id,
          title: '⏰ Subscription Expiring Soon',
          message: `Your premium subscription expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}. Renew now to keep unlimited access!`,
          type: 'subscription_expiry',
          link: '/pricing',
        });
        results.expiry_reminders++;
      }
    }

    // 5. PYQ practice reminders (for users who've never opened PYQ tab)
    const { data: allUsers } = await supabase
      .from('user_stats')
      .select('user_id, total_tests')
      .gt('total_tests', 3);

    if (allUsers) {
      for (const u of allUsers) {
        if (await alreadySent(u.user_id, 'pyq_reminder')) continue;
        // Send max once per 3 days
        const { data: recent } = await supabase.from('notifications').select('id').eq('user_id', u.user_id).eq('type', 'pyq_reminder').gte('created_at', new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()).limit(1);
        if (recent && recent.length > 0) continue;
        // Only send to ~10% of eligible users per run
        if (Math.random() > 0.1) continue;
        await supabase.from('notifications').insert({
          user_id: u.user_id,
          title: '📝 Practice with Real JEE Papers',
          message: 'Check out PYQ papers from 2007-2025 for JEE Mains, Advanced, MHTCET & more!',
          type: 'pyq_reminder',
          link: '/home',
        });
        results.pyq_reminders++;
      }
    }

    // 6. Milestone celebrations
    const { data: milestoneUsers } = await supabase
      .from('user_stats')
      .select('user_id, total_tests, streak');

    if (milestoneUsers) {
      const milestones = [10, 25, 50, 100, 200, 500];
      for (const u of milestoneUsers) {
        if (milestones.includes(u.total_tests)) {
          if (await alreadySent(u.user_id, 'milestone')) continue;
          await supabase.from('notifications').insert({
            user_id: u.user_id,
            title: `🏆 ${u.total_tests} Tests Completed!`,
            message: `Amazing! You've completed ${u.total_tests} practice tests. Keep up the incredible work!`,
            type: 'milestone',
            link: '/profile',
          });
          results.milestones++;
        }
      }
    }

    // 7. Random study tips (1 per 2 days to random 5% of users)
    if (allUsers) {
      const tips = [
        { title: '💡 Study Tip', message: 'Use the Pomodoro technique: 25 min study + 5 min break. Your brain retains more!' },
        { title: '💡 Study Tip', message: 'Before solving, try to predict the answer. This strengthens neural pathways!' },
        { title: '💡 Study Tip', message: 'Teach a concept to someone else — if you can explain it simply, you truly understand it.' },
        { title: '💡 Study Tip', message: 'Solve problems before watching solution videos. Struggle is where learning happens!' },
        { title: '🧠 Did You Know?', message: 'JEE Advanced has only ~150 seats per 1000 test-takers. Consistent daily practice gives you the edge!' },
      ];
      for (const u of allUsers) {
        if (Math.random() > 0.05) continue;
        const { data: recent } = await supabase.from('notifications').select('id').eq('user_id', u.user_id).eq('type', 'study_tip').gte('created_at', new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()).limit(1);
        if (recent && recent.length > 0) continue;
        const tip = tips[Math.floor(Math.random() * tips.length)];
        await supabase.from('notifications').insert({
          user_id: u.user_id,
          title: tip.title,
          message: tip.message,
          type: 'study_tip',
        });
        results.study_tips++;
      }
    }

    return new Response(JSON.stringify({ success: true, processed: results }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Auto-notification error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
