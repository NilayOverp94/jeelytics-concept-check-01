import { RotateCcw, BookOpen, Share, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Subject } from '@/types/jee';
import { UserStats } from '@/types/jee';

interface ActionButtonsProps {
  onTryAgain: () => void;
  onPickAnother: () => void;
  onShare: () => void;
  onGoHome: () => void;
}

export function ActionButtons({ onTryAgain, onPickAnother, onShare, onGoHome }: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-scale-in">
      <Button
        variant="gradient"
        className="h-14"
        onClick={onTryAgain}
      >
        <RotateCcw className="h-5 w-5 mr-2" />
        Try Again
      </Button>
      <Button
        variant="outline"
        className="h-14 hover:shadow-card"
        onClick={onPickAnother}
      >
        <BookOpen className="h-5 w-5 mr-2" />
        Pick Another Topic
      </Button>
      <Button
        variant="gradient-secondary"
        className="h-14"
        onClick={onShare}
      >
        <Share className="h-5 w-5 mr-2" />
        Share Result
      </Button>
      <Button
        variant="outline"
        className="h-14 hover:shadow-card"
        onClick={onGoHome}
      >
        <Home className="h-5 w-5 mr-2" />
        Home
      </Button>
    </div>
  );
}