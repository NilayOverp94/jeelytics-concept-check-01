import { useEffect, useState } from 'react';
import { Sparkles, Brain, Target, Trophy } from 'lucide-react';
import logo from '@/assets/logo.png';

interface QuizLoadingScreenProps {
  questionCount: number;
}

const tips = [
  "Focus on concepts, not just formulas",
  "Practice time management during tests",
  "Review your mistakes regularly",
  "Stay calm and read questions carefully",
  "Eliminate wrong options systematically",
  "Draw diagrams for complex problems",
  "Double-check your calculations",
  "Trust your preparation and instincts"
];

const facts = [
  "JEE Advanced has a success rate of ~2%",
  "IIT Bombay is the top choice for most toppers",
  "Chemistry often has the highest scoring potential",
  "Mock tests boost scores by 15-20% on average",
  "Most toppers study 8-10 hours daily"
];

export function QuizLoadingScreen({ questionCount }: QuizLoadingScreenProps) {
  const [currentTip, setCurrentTip] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => {
      clearInterval(tipInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Animated Logo */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
            <img 
              src={logo} 
              alt="JEE Logo" 
              className="h-24 w-24 relative"
            />
            <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-primary animate-pulse" />
          </div>
        </div>

        {/* Main Message */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Crafting Your Quiz{dots}
          </h2>
          <p className="text-muted-foreground text-lg">
            Generating {questionCount} challenging questions just for you
          </p>
        </div>

        {/* Progress Animation */}
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary animate-[slide_2s_ease-in-out_infinite]" 
               style={{ width: '40%' }} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 text-center space-y-2 hover:scale-105 transition-transform">
            <Brain className="h-8 w-8 mx-auto text-primary animate-pulse" />
            <p className="text-sm text-muted-foreground">AI Powered</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 text-center space-y-2 hover:scale-105 transition-transform">
            <Target className="h-8 w-8 mx-auto text-accent animate-pulse" />
            <p className="text-sm text-muted-foreground">JEE Level</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 text-center space-y-2 hover:scale-105 transition-transform">
            <Trophy className="h-8 w-8 mx-auto text-primary animate-pulse" />
            <p className="text-sm text-muted-foreground">Track Progress</p>
          </div>
        </div>

        {/* Rotating Tips */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 space-y-2 animate-fade-in">
          <p className="text-sm font-semibold text-primary">💡 Quick Tip</p>
          <p className="text-foreground font-medium">{tips[currentTip]}</p>
        </div>

        {/* Did You Know */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 animate-fade-in">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-accent">Did you know?</span> {facts[Math.floor(currentTip / 2) % facts.length]}
          </p>
        </div>

        {questionCount >= 25 && (
          <p className="text-center text-sm text-muted-foreground animate-pulse">
            Large quiz detected • This may take up to 2 minutes
          </p>
        )}
      </div>
    </div>
  );
}
