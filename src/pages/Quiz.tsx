
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
import katex from 'katex';

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
  
  const { subject, topic, useAI, questionCount = 5, difficulty = 'jee-mains' } = location.state as { 
    subject: Subject; 
    topic: string; 
    useAI?: boolean;
    questionCount?: number;
    difficulty?: 'cbse' | 'jee-mains' | 'jee-advanced';
  };

  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [labelMaps, setLabelMaps] = useState<Record<string, Record<string, string>>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  // Convert simple LaTeX ($...$, \( ... \), $$...$$, \[ ... \]) to KaTeX HTML, then sanitize
  const renderMathToHTML = (input: string) => {
    try {
      let out = input ?? '';
      const render = (expr: string, displayMode: boolean) => {
        try {
          return katex.renderToString(expr, { displayMode, throwOnError: false, output: 'html' });
        } catch {
          return expr;
        }
      };
      // Display math first
      out = out.replace(/\\\[([\s\S]+?)\\\]/g, (_, expr) => render(expr, true));
      out = out.replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => render(expr, true));
      // Inline math
      out = out.replace(/\\\(([^]*?)\\\)/g, (_, expr) => render(expr, false));
      out = out.replace(/\$([^$]+?)\$/g, (_, expr) => render(expr, false));
      return out;
    } catch {
      return input ?? '';
    }
  };

  // Helper function to safely render HTML content for AI questions
  const createSafeMarkup = (html: string) => {
    const withMath = renderMathToHTML(html);
    return { __html: DOMPurify.sanitize(withMath) } as const;
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

    const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h
    const cacheKey = `ai-questions:${subject}:${topic}:${questionCount}:${difficulty}`;

    // Fetch AI-generated questions (with local cache)
    const fetchQuestions = async () => {
      try {
        // Try cache first
        const cachedRaw = localStorage.getItem(cacheKey);
        if (cachedRaw) {
          try {
            const cached = JSON.parse(cachedRaw) as { ts: number; questions: MCQQuestion[] };
            if (cached?.questions?.length && Date.now() - cached.ts < CACHE_TTL_MS) {
              console.log('Quiz: Using cached AI questions for', subject, topic);
              setQuestions(cached.questions);
              setUserAnswers(new Array(cached.questions.length).fill(''));
              setLabelMaps({});
              // Scroll to top when using cached questions
              window.scrollTo({ top: 0, behavior: 'smooth' });
              return;
            }
          } catch {}
        }

        // No valid cache → call edge function
        setIsGenerating(true);
        console.log('Quiz: Generating AI questions for', subject, topic, 'count:', questionCount);
        
        // Use longer timeout for 25 questions (150s, which is max edge function timeout)
        const timeoutMs = questionCount >= 25 ? 140000 : 50000;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
          const { data, error } = await supabase.functions.invoke('generate-ai-questions', {
            body: { subject, topic, questionCount, difficulty }
          });

          clearTimeout(timeoutId);
          setIsGenerating(false);

          if (error) {
            console.error('Quiz: AI question generation error:', error);
            const errorMsg = (error as any)?.message || "Failed to generate AI questions";
            
            // Check for specific error types
            if (errorMsg.includes('429') || errorMsg.includes('rate limit')) {
              toast({
                title: "Rate Limit Exceeded",
                description: "Too many requests. Please wait a moment and try again.",
                variant: "destructive",
              });
            } else if (errorMsg.includes('402') || errorMsg.includes('credits')) {
              toast({
                title: "Credits Exhausted",
                description: "AI credits exhausted. Please add funds to your workspace.",
                variant: "destructive",
              });
            } else {
              toast({
                title: "Error",
                description: errorMsg,
                variant: "destructive",
              });
            }
            navigate('/');
            return;
          }

          // Edge function may return a 200 with an error payload in some scenarios
          if (data && (data as any).error) {
            console.error('Quiz: AI function returned error payload:', (data as any).error);
            toast({
              title: "Error",
              description: (data as any).error,
              variant: "destructive",
            });
            navigate('/');
            return;
          }

          const aiQuestions = (data as any).questions as MCQQuestion[];
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

          // Scroll to top when questions are loaded
          window.scrollTo({ top: 0, behavior: 'smooth' });

          // Save to cache
          try {
            localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), questions: aiQuestions }));
          } catch {}
        } catch (fetchError) {
          clearTimeout(timeoutId);
          setIsGenerating(false);
          
          if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            console.error('Quiz: Request timeout');
            toast({
              title: "Request Timeout",
              description: `Generating ${questionCount} questions took too long. Try with fewer questions or try again.`,
              variant: "destructive",
            });
          } else {
            console.error('Quiz: Fetch error:', fetchError);
            toast({
              title: "Network Error",
              description: "Failed to reach the server. Please check your connection.",
              variant: "destructive",
            });
          }
          navigate('/');
        }
      } catch (e) {
        setIsGenerating(false);
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

    // For AI questions, correct answers and explanations are already available
    const correctAnswers = questions.map(q => q.correctAnswer);
    const questionsWithExplanations = questions;

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

  if (questions.length === 0 || isGenerating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground text-lg">Generating your quiz...</p>
          {questionCount >= 25 && (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Generating {questionCount} questions may take up to 2 minutes. Please wait...
              </p>
            </div>
          )}
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
            <div 
              className="text-lg leading-relaxed"
              dangerouslySetInnerHTML={createSafeMarkup(currentQ.question)}
            />

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
                    <span dangerouslySetInnerHTML={createSafeMarkup(option.text)} />
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
