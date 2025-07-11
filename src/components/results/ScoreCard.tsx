import { Trophy, Target, Clock, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Subject } from '@/types/jee';
import { STRENGTH_CONFIG } from './constants';

interface ScoreCardProps {
  score: number;
  totalQuestions: number;
  percentage: number;
  conceptStrength: 'Strong' | 'Moderate' | 'Weak';
  subject: Subject;
  topic: string;
  timeSpent: number;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

export function ScoreCard({ 
  score, 
  totalQuestions, 
  percentage, 
  conceptStrength, 
  subject, 
  topic, 
  timeSpent 
}: ScoreCardProps) {
  const strengthConfig = STRENGTH_CONFIG[conceptStrength];

  return (
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
  );
}