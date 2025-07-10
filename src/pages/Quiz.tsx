import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { MCQQuestion, Subject } from '@/types/jee';
import { generateMCQs } from '@/data/questionBank';
import { useToast } from '@/hooks/use-toast';

export default function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { subject, topic } = location.state as { subject: Subject; topic: string };

  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!subject || !topic) {
      navigate('/');
      return;
    }

    const generatedQuestions = generateMCQs(subject, topic, 5);
    setQuestions(generatedQuestions);
    setUserAnswers(new Array(5).fill(''));
  }, [subject, topic, navigate]);

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

  const handleSubmit = () => {
    const unansweredCount = userAnswers.filter(answer => !answer).length;
    
    if (unansweredCount > 0) {
      toast({
        title: "Incomplete Test",
        description: `You have ${unansweredCount} unanswered questions. Submit anyway?`,
        variant: "destructive",
      });
    }

    // Calculate results
    const correctAnswers = questions.map(q => q.correctAnswer);
    const score = userAnswers.reduce((total, answer, index) => {
      return total + (answer === correctAnswers[index] ? 1 : 0);
    }, 0);

    setIsSubmitted(true);
    
    // Navigate to results with data
    navigate('/results', {
      state: {
        subject,
        topic,
        questions,
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

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = userAnswers.filter(answer => answer).length;

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
            <div className="text-lg leading-relaxed">
              {currentQ.question}
            </div>

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
                    {option.text}
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