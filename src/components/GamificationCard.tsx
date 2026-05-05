import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useGamification, BADGES } from '@/hooks/useGamification';
import { Trophy, Star, Lock } from 'lucide-react';

interface Props {
  totalTests: number;
  streak: number;
  hadPerfectScore?: boolean;
}

export function GamificationCard({ totalTests, streak, hadPerfectScore }: Props) {
  const { xpState, badges, grantBadge, progressPct, nextLevelXp } = useGamification();

  // Auto-grant badges based on stats
  useEffect(() => {
    if (totalTests >= 1) grantBadge('first_test');
    if (totalTests >= 10) grantBadge('tests_10');
    if (totalTests >= 50) grantBadge('tests_50');
    if (totalTests >= 100) grantBadge('tests_100');
    if (streak >= 7) grantBadge('streak_7');
    if (streak >= 30) grantBadge('streak_30');
    if (hadPerfectScore) grantBadge('perfect_score');
    if (xpState.level >= 5) grantBadge('level_5');
    if (xpState.level >= 10) grantBadge('level_10');
  }, [totalTests, streak, hadPerfectScore, xpState.level, grantBadge]);

  return (
    <Card className="card-jee">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" /> Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <span className="font-bold">Level {xpState.level}</span>
            </div>
            <span className="text-xs text-muted-foreground">{xpState.xp} / {nextLevelXp} XP</span>
          </div>
          <Progress value={progressPct} className="h-2" />
        </div>

        {/* Badges */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">BADGES ({badges.length}/{BADGES.length})</p>
          <div className="grid grid-cols-5 gap-2">
            {BADGES.map(b => {
              const earned = badges.includes(b.key);
              return (
                <div key={b.key} title={`${b.name}: ${b.desc}`}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-center p-1 border ${earned ? 'bg-primary/10 border-primary/30' : 'bg-muted/30 border-border opacity-40'}`}>
                  <span className="text-xl">{earned ? b.emoji : <Lock className="h-4 w-4 mx-auto" />}</span>
                  <span className="text-[8px] leading-tight mt-0.5 line-clamp-2">{b.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
