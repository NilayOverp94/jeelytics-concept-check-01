import { useNavigate } from 'react-router-dom';
import { Crown, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PremiumGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  feature?: string;
}

export function PremiumGate({ 
  open, 
  onOpenChange, 
  title = "Premium Feature",
  description = "This feature is available to premium subscribers only.",
  feature = "this feature"
}: PremiumGateProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-400/20">
            <Lock className="h-8 w-8 text-amber-500" />
          </div>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="font-medium text-sm">With Premium, you get:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Unlimited Tests per month
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Access to all PYQ Papers
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Priority AI Question Generation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Detailed Analytics
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Maybe Later
            </Button>
            <Button 
              variant="gradient" 
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                navigate('/pricing');
              }}
            >
              <Crown className="h-4 w-4 mr-2" />
              Get Premium
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface TestLimitGateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  remainingTests: number;
}

export function TestLimitGate({ open, onOpenChange, remainingTests }: TestLimitGateProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 p-4 rounded-full bg-destructive/20">
            <Lock className="h-8 w-8 text-destructive" />
          </div>
          <DialogTitle className="text-xl">Test Limit Reached</DialogTitle>
          <DialogDescription className="text-center">
            You've used all your free tests for this month.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-4xl font-bold text-destructive">{remainingTests}/10</p>
            <p className="text-sm text-muted-foreground">tests remaining this month</p>
          </div>

          <div className="bg-gradient-to-r from-amber-500/10 to-yellow-400/10 rounded-lg p-4 border border-amber-500/20">
            <p className="font-medium text-sm mb-2 flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-500" />
              Upgrade to Premium
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Unlimited Tests every month</li>
              <li>• Access to all PYQ Papers</li>
              <li>• Starting at just ₹29/month</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                navigate('/home');
              }}
            >
              Go Back
            </Button>
            <Button 
              variant="gradient" 
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                navigate('/pricing');
              }}
            >
              <Crown className="h-4 w-4 mr-2" />
              Get Premium
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
