import { Flame } from 'lucide-react';

interface StreakDisplayProps {
  streak: number;
  className?: string;
}

export function StreakDisplay({ streak, className = '' }: StreakDisplayProps) {
  if (streak === 0) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Flame className="h-5 w-5 text-accent animate-pulse-glow" />
      <span className="font-semibold text-accent">
        {streak} day{streak > 1 ? 's' : ''} streak!
      </span>
    </div>
  );
}