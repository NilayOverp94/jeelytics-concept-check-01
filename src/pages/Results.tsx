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
    console.log('📊 Results page loaded with:', { 
      subject, 
      score, 
      totalQuestions, 
      user: user?.id || 'NO_USER',
      hasQuestions: !!questions?.length,
      hasUserAnswers: !!userAnswers?.length,
      hasCorrectAnswers: !!correctAnswers?.length
    });

    if (!subject || score === undefined) {
      console.log('❌ Missing required data, redirecting to home');
      navigate('/');
      return;
    }

    // Only proceed if user is authenticated
    if (!user) {
      console.log('❌ No user found, waiting for auth or redirecting');
      // Give a moment for auth to load, then redirect if still no user
      const timeout = setTimeout(() => {
        if (!user) {
          console.log('❌ Still no user after timeout, redirecting to login');
          navigate('/login');
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }

    // User is authenticated, save the test result
    console.log('✅ User authenticated, saving test result');
    saveTestResult();
  }, [subject, score, totalQuestions, topic, userAnswers, correctAnswers, user, navigate]);

  const saveTestResult = async () => {
    if (!user) {
      console.error('❌ No user found, cannot save test result');
      toast({
        title: "Authentication Error", 
        description: "Please log in to save your test results.",
        variant: "destructive",
      });
      return;
    }

    if (!questions || !userAnswers || !correctAnswers) {
      console.error('❌ Missing required data:', { 
        hasQuestions: !!questions?.length, 
        hasUserAnswers: !!userAnswers?.length, 
        hasCorrectAnswers: !!correctAnswers?.length 
      });
      toast({
        title: "Data Error",
        description: "Missing test data. Please try taking the test again.",
        variant: "destructive",
      });
      return;
    }

    // Show saving status
    console.log('🔄 Starting to save test result...', { 
      userId: user.id, 
      subject, 
      topic, 
      score, 
      totalQuestions,
      timeSpent: timeSpent || 0
    });

    toast({
      title: "Saving Results...",
      description: "Please wait while we save your test results.",
    });

    try {
      // Check authentication status
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('❌ No active session found');
        toast({
          title: "Session Expired",
          description: "Please log in again to save your results.",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Session verified, proceeding with save...');

      // Save test result with retry logic
      let testSaveAttempts = 0;
      const maxAttempts = 3;
      
      while (testSaveAttempts < maxAttempts) {
        testSaveAttempts++;
        console.log(`📝 Attempt ${testSaveAttempts} - Saving test result...`);
        
        const { data: testData, error: testError } = await supabase
          .from('test_results')
          .insert({
            user_id: user.id,
            subject,
            topic,
            score,
            total_questions: totalQuestions,
            time_spent: timeSpent || 0,
            questions: JSON.parse(JSON.stringify(questions)),
            user_answers: userAnswers,
            correct_answers: correctAnswers
          })
          .select();

        if (!testError) {
          console.log('✅ Test result saved successfully:', testData);
          break;
        }

        console.error(`❌ Attempt ${testSaveAttempts} failed:`, testError);
        
        if (testSaveAttempts === maxAttempts) {
          toast({
            title: "Save Failed",
            description: `Failed to save test result after ${maxAttempts} attempts. Error: ${testError.message}`,
            variant: "destructive",
          });
          return;
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Update user stats with retry logic
      console.log('📊 Updating user stats...');
      
      const { data: existingStats, error: fetchError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('❌ Error fetching user stats:', fetchError);
        toast({
          title: "Warning",
          description: "Test saved but failed to update statistics.",
          variant: "destructive",
        });
        return;
      }

      console.log('📈 Current stats:', existingStats);

      const today = new Date().toDateString();
      const lastTestDate = existingStats?.last_test_date ? new Date(existingStats.last_test_date).toDateString() : null;
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      
      let newStreak = existingStats?.streak || 0;
      if (lastTestDate === today) {
        // Same day, don't change streak
        console.log('📅 Same day test, streak unchanged');
      } else if (lastTestDate === yesterday) {
        // Consecutive day, increment streak
        newStreak += 1;
        console.log('🔥 Consecutive day, streak incremented to:', newStreak);
      } else if (lastTestDate === null) {
        // First test ever
        newStreak = 1;
        console.log('🎉 First test ever, streak set to 1');
      } else {
        // Streak broken
        newStreak = 1;
        console.log('💔 Streak broken, reset to 1');
      }

      const newStats = {
        user_id: user.id,
        streak: newStreak,
        last_test_date: new Date().toISOString(),
        total_tests: (existingStats?.total_tests || 0) + 1,
        total_score: (existingStats?.total_score || 0) + score
      };

      console.log('📊 Updating stats with:', newStats);

      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .upsert(newStats, { onConflict: 'user_id' })
        .select();

      if (statsError) {
        console.error('❌ Error updating user stats:', statsError);
        toast({
          title: "Partial Success",
          description: "Test saved but statistics update failed.",
          variant: "destructive",
        });
      } else {
        console.log('✅ User stats updated successfully:', statsData);
        setUserStats({
          streak: newStats.streak,
          lastTestDate: new Date(newStats.last_test_date),
          testHistory: [],
          totalTests: newStats.total_tests,
          totalScore: newStats.total_score
        });
        
        toast({
          title: "Success!",
          description: `Test results saved! Score: ${score}/${totalQuestions} (${Math.round((score/totalQuestions)*100)}%)`,
        });
      }
    } catch (error) {
      console.error('💥 Unexpected error saving test data:', error);
      toast({
        title: "Unexpected Error",
        description: `Failed to save test data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  if (!subject || score === undefined) {
    console.log('❌ Missing required route data:', { subject, score });
    return null;
  }

  if (!user) {
    console.log('❌ No authenticated user found, redirecting');
    navigate('/login');
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