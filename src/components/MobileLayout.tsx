import { ReactNode } from 'react';
import { useCapacitor } from '@/hooks/useCapacitor';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MobileLayout({ children, className }: MobileLayoutProps) {
  const { isNative } = useCapacitor();

  return (
    <div 
      className={cn(
        'min-h-screen bg-background',
        // Add safe area padding for native apps (notch, home indicator)
        isNative && 'pt-safe pb-safe',
        className
      )}
    >
      {children}
    </div>
  );
}
