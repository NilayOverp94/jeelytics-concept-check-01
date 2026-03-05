import { useEffect, useState, useCallback } from 'react';
import { Brain, Target, Trophy, Lightbulb } from 'lucide-react';

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

// Memory card game
const EMOJIS = ['⚡', '🧪', '📐', '🎯', '🧠', '🔬', '📊', '✨'];
const CARD_PAIRS = [...EMOJIS, ...EMOJIS]; // 16 cards = 8 pairs

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function QuizLoadingScreen({ questionCount }: QuizLoadingScreenProps) {
  const [currentTip, setCurrentTip] = useState(0);
  const [dots, setDots] = useState('');

  // Memory game state
  const [cards, setCards] = useState(() => shuffleArray(CARD_PAIRS));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 4000);
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => {
      clearInterval(tipInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  const handleCardClick = useCallback((index: number) => {
    if (locked || flipped.includes(index) || matched.has(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        // Match found
        setMatched(prev => new Set([...prev, first, second]));
        setFlipped([]);
        setLocked(false);
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 800);
      }
    }
  }, [flipped, matched, locked, cards]);

  const handleReset = () => {
    setCards(shuffleArray(CARD_PAIRS));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setLocked(false);
  };

  const allMatched = matched.size === cards.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Generating Questions{dots}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {questionCount} questions loading • Play while you wait!
          </p>
        </div>

        {/* Progress bar */}
        <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary animate-[slide_2s_ease-in-out_infinite]" 
               style={{ width: '40%' }} />
        </div>

        {/* Memory Game */}
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">🃏 Memory Match</span>
              {allMatched && <span className="text-xs font-bold text-green-500 animate-pulse">🎉 You win!</span>}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">Moves: <span className="font-bold text-foreground">{moves}</span></span>
              <span className="text-xs text-muted-foreground">Pairs: <span className="font-bold text-foreground">{matched.size / 2}/{EMOJIS.length}</span></span>
              <button 
                onClick={handleReset}
                className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {cards.map((emoji, index) => {
              const isFlipped = flipped.includes(index);
              const isMatched = matched.has(index);
              const showFace = isFlipped || isMatched;
              
              return (
                <button
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-xl sm:text-2xl
                    transition-all duration-300 cursor-pointer select-none
                    ${showFace 
                      ? isMatched 
                        ? 'bg-primary/20 border-2 border-primary/40 scale-95' 
                        : 'bg-accent/20 border-2 border-accent/40' 
                      : 'bg-muted hover:bg-muted/70 hover:scale-105 active:scale-95 border-2 border-border'
                    }
                  `}
                  style={{
                    transform: showFace ? 'rotateY(0deg)' : 'rotateY(0deg)',
                  }}
                >
                  {showFace ? emoji : '❓'}
                </button>
              );
            })}
          </div>
          
          <p className="text-xs text-center text-muted-foreground mt-3">
            Tap cards to find matching pairs!
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-3 text-center">
            <Brain className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">AI Powered</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-3 text-center">
            <Target className="h-5 w-5 mx-auto text-accent mb-1" />
            <p className="text-xs text-muted-foreground">JEE Level</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-3 text-center">
            <Trophy className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Track Progress</p>
          </div>
        </div>

        {/* Tip */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary">Quick Tip</span>
          </div>
          <p className="text-sm text-foreground">{tips[currentTip]}</p>
        </div>

        {questionCount >= 25 && (
          <p className="text-center text-xs text-muted-foreground animate-pulse">
            Large quiz • This may take up to 2 minutes
          </p>
        )}
      </div>
    </div>
  );
}
