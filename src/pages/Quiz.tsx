
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { MCQQuestion, Subject } from '@/types/jee';
// Removed local generator; we now fetch from Supabase
// import { generateMCQs } from '@/data/questionBank';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import DOMPurify from 'dompurify';

export default function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  
  // Safely handle location state - redirect if missing
  if (!location.state) {
    navigate('/');
    return null;
  }
  
  const { subject, topic, useAI } = location.state as { subject: Subject; topic: string; useAI?: boolean };

  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [labelMaps, setLabelMaps] = useState<Record<string, Record<string, string>>>({});

  // Helper function to safely render HTML content for AI questions
  const createSafeMarkup = (html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  // Check authentication first
  useEffect(() => {
    if (loading) return; // Wait for auth to load
    
    if (!user) {
      console.log('❌ Quiz: User not authenticated, redirecting to login');
      toast({
        title: "Authentication Required",
        description: "Please log in to take the quiz.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
  }, [user, loading, navigate, toast]);

  useEffect(() => {
    if (!subject || !topic) {
      navigate('/');
      return;
    }

    // Fetch questions - either from AI or database
    const fetchQuestions = async () => {
      try {
        if (useAI) {
          console.log('Quiz: Generating AI questions for', subject, topic);
          const { data, error } = await supabase.functions.invoke('generate-ai-questions', {
            body: { subject, topic }
          });

          if (error) {
            console.error('Quiz: AI question generation error:', error);
            toast({
              title: "Error",
              description: "Failed to generate AI questions. Please try again.",
              variant: "destructive",
            });
            navigate('/');
            return;
          }

          const aiQuestions = data.questions;
          if (!aiQuestions || aiQuestions.length === 0) {
            toast({
              title: "No Questions Generated",
              description: "Failed to generate questions. Please try again.",
              variant: "destructive",
            });
            navigate('/');
            return;
          }

          console.log('Quiz: Received AI questions:', aiQuestions.length);
          setQuestions(aiQuestions);
          setUserAnswers(new Array(aiQuestions.length).fill(''));
          setLabelMaps({}); // AI questions don't need label mapping
        } else {
          console.log('Quiz: Fetching questions via Supabase RPC for', subject, topic);
          const { data, error } = await supabase.rpc('fetch_random_questions_public', {
            p_subject: subject,
            p_topic: topic,
            p_limit: 5,
          });

          if (error) {
            console.error('Quiz: RPC error fetching questions:', error);
            toast({
              title: "Error",
              description: "Failed to load questions. Please try again.",
              variant: "destructive",
            });
            navigate('/');
            return;
          }

          if (!data || data.length === 0) {
            console.log('Quiz: No questions found for topic:', topic);
            toast({
              title: "No Questions Available",
              description: `No questions found for ${topic}. Please try a different topic.`,
              variant: "destructive",
            });
            navigate('/');
            return;
          }

          // Map RPC rows to MCQQuestion shape (without answers/explanations)
          const mapped: MCQQuestion[] = data.map((row: any) => ({
            id: String(row.id),
            question: row.question,
            options: Array.isArray(row.options) ? row.options : [],
            // Fill placeholders (answers fetched after submission)
            correctAnswer: '',
            explanation: '',
            topic: row.topic,
            subject: row.subject,
          }));

          // Randomize options and re-label A/B/C/D so correct isn't always the same letter
          const letters = ['A', 'B', 'C', 'D'];
          const newLabelMaps: Record<string, Record<string, string>> = {};
          const shuffledQuestions: MCQQuestion[] = mapped.map((q) => {
            const original = q.options;
            // Fisher–Yates shuffle (pure)
            const shuffled = [...original];
            for (let i = shuffled.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            // Build mapping from original label -> new label based on shuffled order
            const labelMap: Record<string, string> = {};
            const relabeled = shuffled.map((opt, idx) => {
              const newLabel = letters[idx] ?? String.fromCharCode(65 + idx);
              labelMap[opt.label] = newLabel;
              return { label: newLabel, text: opt.text };
            });
            newLabelMaps[q.id] = labelMap;
            return { ...q, options: relabeled };
          });

          console.log('Quiz: Applied option shuffling and relabeling with maps:', newLabelMaps);
          setLabelMaps(newLabelMaps);
          console.log('Quiz: Received questions:', shuffledQuestions.length);
          setQuestions(shuffledQuestions);
          setUserAnswers(new Array(shuffledQuestions.length).fill(''));
        }
      } catch (e) {
        console.error('Quiz: Unexpected error fetching questions:', e);
        toast({
          title: "Unexpected Error",
          description: "Failed to load questions. Please try again.",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    fetchQuestions();
  }, [subject, topic, navigate, toast]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    const unansweredCount = userAnswers.filter(answer => !answer).length;
    
    if (unansweredCount > 0) {
      toast({
        title: "Incomplete Test",
        description: `You have ${unansweredCount} unanswered questions. Submitting...`,
        variant: "destructive",
      });
    }

    let correctAnswers: string[];
    let questionsWithExplanations: MCQQuestion[];

    if (useAI) {
      // For AI questions, correct answers and explanations are already available
      correctAnswers = questions.map(q => q.correctAnswer);
      questionsWithExplanations = questions;
    } else {
      // Fetch correct answers and explanations securely for served question IDs
      const questionIds = questions.map(q => q.id);
      console.log('Quiz: Fetching answers for question IDs:', questionIds);

      const { data: answersData, error: answersError } = await supabase.rpc('get_question_answers_public', {
        p_question_ids: questionIds,
      });

      if (answersError) {
        console.error('Quiz: Error fetching answers:', answersError);
        toast({
          title: "Error",
          description: "Failed to fetch answers. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const answerMap = new Map<string, { correct_answer: string; explanation: string }>();
      (answersData || []).forEach((row: any) => {
        console.log('Processing answer row:', row);
        answerMap.set(String(row.id), {
          correct_answer: row.correct_answer,
          explanation: row.explanation ?? '',
        });
      });

      console.log('Answer map created:', Array.from(answerMap.entries()));

      const correctAnswersOriginal = questionIds.map(id => answerMap.get(id)?.correct_answer || '');
      correctAnswers = questionIds.map((id, idx) => {
        const orig = correctAnswersOriginal[idx];
        const map = labelMaps[id];
        const translated = map && orig ? (map[orig] ?? '') : orig;
        return translated || '';
      });
      questionsWithExplanations = questions.map(q => ({
        ...q,
        explanation: answerMap.get(q.id)?.explanation || 'No explanation available',
      }));
    }

    console.log('Questions with explanations:', questionsWithExplanations.map(q => ({ id: q.id, explanation: q.explanation })));

    // Calculate score - only count answered questions that are correct
    const score = userAnswers.reduce((total, answer, index) => {
      // Only count as correct if answer is provided AND matches correct answer
      return total + (answer && answer === correctAnswers[index] ? 1 : 0);
    }, 0);

    setIsSubmitted(true);
    
    // Navigate to results with full data
    navigate('/results', {
      state: {
        subject,
        topic,
        useAI,
        questions: questionsWithExplanations,
        userAnswers,
        correctAnswers,
        score,
        totalQuestions: questions.length,
        timeSpent: 300 - timeLeft
      }
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestion + 1) / (questions.length || 1)) * 100;
  const answeredCount = userAnswers.filter(answer => answer).length;

  // Show loading if auth is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="hover:bg-muted"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">{subject} - {topic}</h1>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>{answeredCount}/{questions.length} answered</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-mono">
                <Clock className="h-4 w-4 text-accent" />
                <span className={timeLeft < 60 ? 'text-destructive font-bold' : ''}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="card-jee animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg">
              Question {currentQuestion + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question */}
            {useAI ? (
              <div 
                className="text-lg leading-relaxed"
                dangerouslySetInnerHTML={createSafeMarkup(currentQ.question)}
              />
            ) : (
              <div className="text-lg leading-relaxed">
                {currentQ.question}
              </div>
            )}

            {/* Options */}
            <RadioGroup
              value={userAnswers[currentQuestion]}
              onValueChange={handleAnswerSelect}
              className="space-y-3"
            >
              {currentQ.options.map((option) => (
                <div key={option.label} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={option.label} id={option.label} />
                  <Label 
                    htmlFor={option.label} 
                    className="flex-1 cursor-pointer text-base"
                  >
                    <span className="font-semibold text-primary mr-2">
                      {option.label}.
                    </span>
                    {useAI ? (
                      <span dangerouslySetInnerHTML={createSafeMarkup(option.text)} />
                    ) : (
                      option.text
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="hover:shadow-card"
              >
                Previous
              </Button>
              
              <div className="flex gap-3">
                {currentQuestion === questions.length - 1 ? (
                  <Button
                    variant="gradient"
                    onClick={handleSubmit}
                  >
                    Submit Test
                  </Button>
                ) : (
                  <Button
                    variant="gradient-secondary"
                    onClick={handleNext}
                  >
                    Next Question
                  </Button>
                )}
              </div>
            </div>

            {/* Question Navigator */}
            <div className="pt-6 border-t border-border">
              <div className="text-sm font-medium mb-3">Question Navigator:</div>
              <div className="flex flex-wrap gap-2">
                {questions.map((_, index) => (
                  <Button
                    key={index}
                    variant={currentQuestion === index ? "default" : "outline"}
                    size="sm"
                    className={`w-10 h-10 ${
                      userAnswers[index] 
                        ? currentQuestion === index 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-400'
                        : currentQuestion === index
                          ? 'bg-primary text-primary-foreground'
                          : ''
                    }`}
                    onClick={() => setCurrentQuestion(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
