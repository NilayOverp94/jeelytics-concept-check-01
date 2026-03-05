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

const GRID_SIZE = 4;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;

// Generate shuffled indices for puzzle
function generateShuffledTiles(): number[] {
  const tiles = Array.from({ length: TOTAL_TILES }, (_, i) => i);
  // Fisher-Yates shuffle
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
}

const TILE_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--secondary))',
  'hsl(262 80% 55%)',
  'hsl(330 70% 50%)',
  'hsl(200 80% 50%)',
  'hsl(150 60% 45%)',
  'hsl(30 80% 55%)',
  'hsl(var(--primary) / 0.8)',
  'hsl(var(--accent) / 0.8)',
  'hsl(262 70% 60%)',
  'hsl(330 60% 55%)',
  'hsl(200 70% 55%)',
  'hsl(150 50% 50%)',
  'hsl(30 70% 60%)',
  'hsl(var(--secondary) / 0.8)',
];

const TILE_ICONS = ['⚡', '🧪', '📐', '🎯', '🧠', '🔬', '📊', '✨', '🚀', '💡', '⭐', '🔥', '🎓', '📖', '🏆', '💪'];

export function QuizLoadingScreen({ questionCount }: QuizLoadingScreenProps) {
  const [currentTip, setCurrentTip] = useState(0);
  const [tiles, setTiles] = useState<number[]>(generateShuffledTiles);
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);
  const [dots, setDots] = useState('');

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

  // Check if puzzle is solved
  useEffect(() => {
    const isSolved = tiles.every((tile, index) => tile === index);
    if (isSolved && moves > 0) {
      setSolved(true);
    }
  }, [tiles, moves]);

  const handleTileClick = useCallback((clickedIndex: number) => {
    if (solved) return;

    if (selectedTile === null) {
      setSelectedTile(clickedIndex);
    } else {
      if (selectedTile === clickedIndex) {
        setSelectedTile(null);
        return;
      }
      // Swap tiles
      setTiles(prev => {
        const newTiles = [...prev];
        [newTiles[selectedTile], newTiles[clickedIndex]] = [newTiles[clickedIndex], newTiles[selectedTile]];
        return newTiles;
      });
      setMoves(m => m + 1);
      setSelectedTile(null);
    }
  }, [selectedTile, solved]);

  const handleReset = () => {
    setTiles(generateShuffledTiles());
    setSelectedTile(null);
    setMoves(0);
    setSolved(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Generating Questions{dots}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {questionCount} questions loading • Solve the puzzle while you wait!
          </p>
        </div>

        {/* Progress bar */}
        <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary animate-[slide_2s_ease-in-out_infinite]" 
               style={{ width: '40%' }} />
        </div>

        {/* Puzzle */}
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">🧩 Tile Puzzle</span>
              {solved && <span className="text-xs font-bold text-green-500 animate-pulse">✅ Solved!</span>}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">Moves: <span className="font-bold text-foreground">{moves}</span></span>
              <button 
                onClick={handleReset}
                className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {tiles.map((tileValue, index) => {
              const isSelected = selectedTile === index;
              const isInCorrectPosition = tileValue === index;
              
              return (
                <button
                  key={index}
                  onClick={() => handleTileClick(index)}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-xl sm:text-2xl
                    transition-all duration-200 cursor-pointer select-none
                    ${isSelected 
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-95' 
                      : 'hover:scale-105 active:scale-95'
                    }
                    ${solved && isInCorrectPosition ? 'animate-pulse' : ''}
                  `}
                  style={{
                    backgroundColor: TILE_COLORS[tileValue],
                    opacity: isInCorrectPosition && !solved ? 0.9 : 0.75,
                    boxShadow: isSelected ? '0 0 15px hsl(var(--primary) / 0.5)' : 'none',
                  }}
                >
                  {TILE_ICONS[tileValue]}
                </button>
              );
            })}
          </div>
          
          <p className="text-xs text-center text-muted-foreground mt-3">
            Tap two tiles to swap them • Arrange in order to solve
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
