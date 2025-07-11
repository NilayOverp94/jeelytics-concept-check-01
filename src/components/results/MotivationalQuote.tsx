import { Card, CardContent } from '@/components/ui/card';

interface MotivationalQuoteProps {
  quote: string;
}

export function MotivationalQuote({ quote }: MotivationalQuoteProps) {
  return (
    <Card className="card-jee mb-8 animate-fade-in">
      <CardContent className="pt-6 text-center">
        <div className="text-4xl mb-4">💡</div>
        <blockquote className="text-lg italic text-muted-foreground">
          "{quote}"
        </blockquote>
      </CardContent>
    </Card>
  );
}