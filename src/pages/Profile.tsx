import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, User, Mail, Calendar, Target, TrendingUp, BarChart3, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import useSEO from '@/hooks/useSEO';
import logo from '@/assets/logo.png';

const DEFAULT_AVATARS = [
  '🧑‍🔬', '👨‍🎓', '🦸', '🧠', '🚀'
];

interface TestHistoryItem {
  id: string;
  subject: string;
  topic: string;
  score: number;
  total_questions: number;
  time_spent: number;
  created_at: string;
}

export default function Profile() {
  useSEO({ title: "Profile | JEElytics", description: "View your JEElytics profile, stats, and test history." });

  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium, subscription } = useSubscription();
  const [testHistory, setTestHistory] = useState<TestHistoryItem[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const [userStats, setUserStats] = useState({ streak: 0, totalTests: 0, totalScore: 0 });

  useEffect(() => {
    if (user) {
      fetchData();
      const saved = localStorage.getItem(`avatar_${user.id}`);
      if (saved) setSelectedAvatar(saved);
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    // Fetch last 20 test results
    const { data: tests } = await supabase
      .from('test_results')
      .select('id, subject, topic, score, total_questions, time_spent, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (tests) setTestHistory(tests);

    // Fetch user stats
    const { data: stats } = await supabase
      .from('user_stats')
      .select('streak, total_tests, total_score')
      .eq('user_id', user.id)
      .maybeSingle();

    if (stats) setUserStats({ streak: stats.streak, totalTests: stats.total_tests, totalScore: stats.total_score });
  };

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    if (user) localStorage.setItem(`avatar_${user.id}`, avatar);
  };

  const avgScore = testHistory.length > 0
    ? Math.round(testHistory.reduce((sum, t) => sum + (t.score / t.total_questions) * 100, 0) / testHistory.length)
    : 0;

  const totalCorrect = testHistory.reduce((sum, t) => sum + t.score, 0);
  const totalQuestions = testHistory.reduce((sum, t) => sum + t.total_questions, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Subject distribution for simple bar chart
  const subjectStats = testHistory.reduce((acc, t) => {
    if (!acc[t.subject]) acc[t.subject] = { count: 0, totalScore: 0, totalQ: 0 };
    acc[t.subject].count++;
    acc[t.subject].totalScore += t.score;
    acc[t.subject].totalQ += t.total_questions;
    return acc;
  }, {} as Record<string, { count: number; totalScore: number; totalQ: number }>);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/home')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <img src={logo} alt="JEElytics" className="h-8 w-8 rounded" />
            <span className="text-xl font-bold text-gradient-primary">Profile</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl space-y-6">
        {/* Avatar & User Info */}
        <Card className="card-jee">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center text-4xl shadow-lg">
                {selectedAvatar || <User className="h-10 w-10 text-white" />}
              </div>

              <div>
                <h2 className="text-xl font-bold">{user?.user_metadata?.name || 'Student'}</h2>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {user?.email}
                </p>
              </div>

              {isPremium ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-400/10 border border-amber-500/20">
                  <Crown className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Premium Member</span>
                </div>
              ) : (
                <Button variant="gradient" size="sm" onClick={() => navigate('/pricing')}>
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              )}

              {subscription?.expires_at && isPremium && (
                <p className="text-xs text-muted-foreground">
                  Valid until: {new Date(subscription.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>

            {/* Avatar Selection */}
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-sm font-medium mb-3 text-center">Choose Avatar</p>
              <div className="flex justify-center gap-3">
                {DEFAULT_AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => handleAvatarSelect(avatar)}
                    className={`w-12 h-12 rounded-full text-2xl flex items-center justify-center transition-all ${
                      selectedAvatar === avatar
                        ? 'ring-2 ring-primary ring-offset-2 bg-primary/10 scale-110'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-jee">
            <CardContent className="pt-4 pb-4 text-center">
              <Target className="h-5 w-5 text-primary mx-auto mb-1" />
              <div className="text-2xl font-bold text-primary">{avgScore}%</div>
              <div className="text-xs text-muted-foreground">Avg Score (Last 20)</div>
            </CardContent>
          </Card>
          <Card className="card-jee">
            <CardContent className="pt-4 pb-4 text-center">
              <TrendingUp className="h-5 w-5 text-secondary mx-auto mb-1" />
              <div className="text-2xl font-bold text-secondary">{accuracy}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </CardContent>
          </Card>
          <Card className="card-jee">
            <CardContent className="pt-4 pb-4 text-center">
              <BarChart3 className="h-5 w-5 text-accent mx-auto mb-1" />
              <div className="text-2xl font-bold text-accent">{userStats.totalTests}</div>
              <div className="text-xs text-muted-foreground">Total Tests</div>
            </CardContent>
          </Card>
          <Card className="card-jee">
            <CardContent className="pt-4 pb-4 text-center">
              <Award className="h-5 w-5 text-amber-500 mx-auto mb-1" />
              <div className="text-2xl font-bold text-amber-500">{userStats.streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Performance */}
        {Object.keys(subjectStats).length > 0 && (
          <Card className="card-jee">
            <CardHeader>
              <CardTitle className="text-lg">Subject Performance (Last 20 Tests)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(subjectStats).map(([subject, data]) => {
                const pct = Math.round((data.totalScore / data.totalQ) * 100);
                const color = subject === 'Physics' ? 'bg-primary' : subject === 'Chemistry' ? 'bg-secondary' : 'bg-accent';
                return (
                  <div key={subject}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{subject}</span>
                      <span className="text-muted-foreground">{pct}% ({data.count} tests)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className={`${color} h-3 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Test History */}
        <Card className="card-jee">
          <CardHeader>
            <CardTitle className="text-lg">Recent Tests (Last 20)</CardTitle>
          </CardHeader>
          <CardContent>
            {testHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">No tests taken yet. Start practicing!</p>
            ) : (
              <div className="space-y-3">
                {testHistory.map((test) => {
                  const pct = Math.round((test.score / test.total_questions) * 100);
                  return (
                    <div key={test.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                      <div>
                        <p className="text-sm font-medium">{test.topic}</p>
                        <p className="text-xs text-muted-foreground">
                          {test.subject} • {new Date(test.created_at).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${pct >= 70 ? 'text-primary' : pct >= 40 ? 'text-amber-500' : 'text-destructive'}`}>
                          {test.score}/{test.total_questions}
                        </p>
                        <p className="text-xs text-muted-foreground">{pct}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
