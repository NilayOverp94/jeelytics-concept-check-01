import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, RotateCcw, BookOpen, Share, Home, Target, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MCQQuestion, TestResult, UserStats, Subject } from '@/types/jee';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const STRENGTH_CONFIG = {
  Strong: {
    color: 'bg-green-500',
    textColor: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-500/10',
    emoji: '🔥',
    message: 'Excellent! You have a strong grasp of this concept.'
  },
  Moderate: {
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700 dark:text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    emoji: '⚡',
    message: 'Good work! A bit more practice will make you stronger.'
  },
  Weak: {
    color: 'bg-red-500',
    textColor: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-500/10',
    emoji: '💪',
    message: 'Keep practicing! Every expert was once a beginner.'
  }
};

const MOTIVATIONAL_QUOTES = [
  "Even Einstein failed tests before he cracked the universe!",
  "Success is the sum of small efforts repeated day in and day out.",
  "The only way to learn mathematics is to do mathematics.",
  "Physics is not a religion. If it were, we'd have a much easier time raising money.",
  "Chemistry is the study of matter, but I prefer to see it as the study of change.",
  "In mathematics, you don't understand things. You just get used to them.",
  "The important thing is not to stop questioning.",
  "Science is a way of thinking much more than it is a body of knowledge."
];

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

  const strengthConfig = STRENGTH_CONFIG[conceptStrength];
  const randomQuote = useMemo(() => 
    MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)], 
    [subject, topic, score]
  );

  const handleTryAgain = () => {
    navigate('/quiz', { state: { subject, topic } });
  };

  const handlePickAnother = () => {
    navigate('/');
  };

  const handleShare = () => {
    const message = `🎯 JEElytics Test Result!
    
📚 Subject: ${subject}
📖 Topic: ${topic}
📊 Score: ${score}/${totalQuestions} (${percentage.toFixed(0)}%)
💪 Concept Strength: ${conceptStrength}
🔥 Current Streak: ${userStats.streak} day${userStats.streak > 1 ? 's' : ''}

"${randomQuote}"

Check your concept strength at JEElytics! 🚀`;

    if (navigator.share) {
      navigator.share({
        title: 'JEElytics Test Result',
        text: message,
      });
    } else {
      // Fallback to WhatsApp
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
    
    toast({
      title: "Result Shared!",
      description: "Your test result has been shared successfully.",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

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
        {/* Score Card */}
        <Card className="card-jee mb-8 animate-fade-in">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl mb-2">
              {score}/{totalQuestions} Correct!
            </CardTitle>
            <div className="text-6xl font-bold text-gradient-primary mb-2">
              {percentage.toFixed(0)}%
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {/* Concept Strength */}
            <div className={`p-6 rounded-xl ${strengthConfig.bgColor}`}>
              <div className="text-2xl mb-2">{strengthConfig.emoji}</div>
              <Badge className={`${strengthConfig.color} text-white text-lg px-4 py-2 mb-3`}>
                Concept Strength: {conceptStrength}
              </Badge>
              <p className={`text-lg font-medium ${strengthConfig.textColor}`}>
                {strengthConfig.message}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Target className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="font-semibold">Accuracy</div>
                <div className="text-2xl font-bold text-primary">{percentage.toFixed(0)}%</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Clock className="h-6 w-6 text-secondary mx-auto mb-2" />
                <div className="font-semibold">Time Taken</div>
                <div className="text-2xl font-bold text-secondary">{formatTime(timeSpent)}</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <BookOpen className="h-6 w-6 text-accent mx-auto mb-2" />
                <div className="font-semibold">Subject</div>
                <div className="text-lg font-bold text-accent">{subject}</div>
                <div className="text-sm text-muted-foreground">{topic}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{score} out of {totalQuestions} correct</span>
              </div>
              <Progress value={percentage} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card className="card-jee mb-8 animate-scale-in">
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const correctAnswer = correctAnswers[index];
              const isCorrect = userAnswer === correctAnswer;
              const userOption = question.options.find(opt => opt.label === userAnswer);
              const correctOption = question.options.find(opt => opt.label === correctAnswer);

              return (
                <div key={question.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium mb-2">
                        Question {index + 1}: {question.question}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className={`${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          Your answer: {userAnswer ? `${userAnswer}. ${userOption?.text}` : 'Not answered'}
                        </div>
                        {!isCorrect && (
                          <div className="text-green-600 dark:text-green-400">
                            Correct answer: {correctAnswer}. {correctOption?.text}
                          </div>
                        )}
                        <div className="text-muted-foreground bg-muted/50 p-2 rounded">
                          <strong>Explanation:</strong> {question.explanation}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Motivational Quote */}
        <Card className="card-jee mb-8 animate-fade-in">
          <CardContent className="pt-6 text-center">
            <div className="text-4xl mb-4">💡</div>
            <blockquote className="text-lg italic text-muted-foreground">
              "{randomQuote}"
            </blockquote>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-scale-in">
          <Button
            variant="gradient"
            className="h-14"
            onClick={handleTryAgain}
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Try Again
          </Button>
          <Button
            variant="outline"
            className="h-14 hover:shadow-card"
            onClick={handlePickAnother}
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Pick Another Topic
          </Button>
          <Button
            variant="gradient-secondary"
            className="h-14"
            onClick={handleShare}
          >
            <Share className="h-5 w-5 mr-2" />
            Share Result
          </Button>
          <Button
            variant="outline"
            className="h-14 hover:shadow-card"
            onClick={() => navigate('/')}
          >
            <Home className="h-5 w-5 mr-2" />
            Home
          </Button>
        </div>
      </main>
    </div>
  );
}