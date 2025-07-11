import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MCQQuestion, Subject, UserStats } from '@/types/jee';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ScoreCard } from '@/components/results/ScoreCard';
import { QuestionReview } from '@/components/results/QuestionReview';
import { MotivationalQuote } from '@/components/results/MotivationalQuote';
import { ActionButtons } from '@/components/results/ActionButtons';
import { useResultsHandlers } from '@/hooks/useResultsHandlers';
import { MOTIVATIONAL_QUOTES } from '@/components/results/constants';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [userStats, setUserStats] = useState<UserStats>({
    streak: 0,
    lastTestDate: null,
    testHistory: [],
    totalTests: 0,
    totalScore: 0
  });
  
  const {
    subject,
    topic,
    questions,
    userAnswers,
    correctAnswers,
    score,
    totalQuestions,
    timeSpent
  } = location.state as {
    subject: Subject;
    topic: string;
    questions: MCQQuestion[];
    userAnswers: string[];
    correctAnswers: string[];
    score: number;
    totalQuestions: number;
    timeSpent: number;
  };

  useEffect(() => {
    if (!subject || score === undefined || !user) {
      navigate('/');
      return;
    }

    saveTestResult();
  }, [subject, score, totalQuestions, topic, userAnswers, correctAnswers, user, navigate]);

  const saveTestResult = async () => {
    if (!user) return;

    console.log('Saving test result:', { subject, score, totalQuestions, topic });

    try {
      // Save test result
      const { error: testError } = await supabase
        .from('test_results')
        .insert({
          user_id: user.id,
          subject,
          topic,
          score,
          total_questions: totalQuestions,
          time_spent: timeSpent,
          questions: questions as any,
          user_answers: userAnswers,
          correct_answers: correctAnswers
        });

      if (testError) {
        console.error('Error saving test result:', testError);
        toast({
          title: "Error",
          description: "Failed to save test result. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Test result saved successfully');

      // Update user stats
      const { data: existingStats, error: fetchError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user stats:', fetchError);
        return;
      }

      const today = new Date().toDateString();
      const lastTestDate = existingStats?.last_test_date ? new Date(existingStats.last_test_date).toDateString() : null;
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      
      let newStreak = existingStats?.streak || 0;
      if (lastTestDate === today) {
        // Same day, don't change streak
      } else if (lastTestDate === yesterday) {
        // Consecutive day, increment streak
        newStreak += 1;
      } else if (lastTestDate === null) {
        // First test ever
        newStreak = 1;
      } else {
        // Streak broken
        newStreak = 1;
      }

      const newStats = {
        user_id: user.id,
        streak: newStreak,
        last_test_date: new Date().toISOString(),
        total_tests: (existingStats?.total_tests || 0) + 1,
        total_score: (existingStats?.total_score || 0) + score
      };

      const { error: statsError } = await supabase
        .from('user_stats')
        .upsert(newStats);

      if (statsError) {
        console.error('Error updating user stats:', statsError);
      } else {
        console.log('User stats updated successfully:', newStats);
        setUserStats({
          streak: newStats.streak,
          lastTestDate: new Date(newStats.last_test_date),
          testHistory: [],
          totalTests: newStats.total_tests,
          totalScore: newStats.total_score
        });
      }
    } catch (error) {
      console.error('Error saving test data:', error);
    }
  };

  if (!subject || score === undefined) {
    return null;
  }

  const percentage = (score / totalQuestions) * 100;
  let conceptStrength: 'Strong' | 'Moderate' | 'Weak' = 'Weak';
  if (percentage >= 80) conceptStrength = 'Strong';
  else if (percentage >= 60) conceptStrength = 'Moderate';

  const randomQuote = useMemo(() => 
    MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)], 
    [subject, topic, score]
  );

  const {
    handleTryAgain,
    handlePickAnother,
    handleShare,
    handleGoHome,
  } = useResultsHandlers({
    subject,
    topic,
    score,
    totalQuestions,
    percentage,
    conceptStrength,
    streak: userStats.streak,
    randomQuote,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gradient-primary">Test Results</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-muted"
            >
              <Home className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ScoreCard
          score={score}
          totalQuestions={totalQuestions}
          percentage={percentage}
          conceptStrength={conceptStrength}
          subject={subject}
          topic={topic}
          timeSpent={timeSpent}
        />

        <QuestionReview
          questions={questions}
          userAnswers={userAnswers}
          correctAnswers={correctAnswers}
        />

        <MotivationalQuote quote={randomQuote} />

        <ActionButtons
          onTryAgain={handleTryAgain}
          onPickAnother={handlePickAnother}
          onShare={handleShare}
          onGoHome={handleGoHome}
        />
      </main>
    </div>
  );
}