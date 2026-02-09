import { useState } from 'react';
import { Crown, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useSubscription } from '@/hooks/useSubscription';

export function UserStatusBadge() {
  const navigate = useNavigate();
  const { isPremium, subscription, remainingTests, isLoading } = useSubscription();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="h-7 w-16 bg-muted animate-pulse rounded-full" />
    );
  }

  const getPlanDisplayName = () => {
    if (!subscription?.plan) return 'Premium';
    const name = subscription.plan.display_name || subscription.plan.name;
    return name;
  };

  const getExpiryDate = () => {
    if (!subscription?.expires_at) return null;
    return new Date(subscription.expires_at).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isPremium) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-semibold text-xs shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
            <Crown className="h-3.5 w-3.5" />
            <span>Premium</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" align="end">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400">
                <Crown className="h-4 w-4 text-black" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{getPlanDisplayName()}</p>
                <p className="text-xs text-muted-foreground">Active Subscription</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>✓ Unlimited Tests</p>
              <p>✓ All PYQs Access</p>
              <p>✓ Priority Support</p>
            </div>
            {getExpiryDate() && (
              <p className="text-xs text-muted-foreground border-t pt-2">
                Expires: {getExpiryDate()}
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground font-medium text-xs hover:bg-muted/80 transition-all cursor-pointer">
          <UserIcon className="h-3.5 w-3.5" />
          <span>Free</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-muted">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Free Plan</p>
              <p className="text-xs text-muted-foreground">Limited features</p>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm font-medium">Tests Remaining</p>
            <p className="text-2xl font-bold text-primary">{remainingTests}/10</p>
            <p className="text-xs text-muted-foreground">this month</p>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>✓ 10 Tests/Month</p>
            <p className="line-through opacity-60">✗ All PYQs Access</p>
            <p className="line-through opacity-60">✗ Unlimited Tests</p>
          </div>

          <Button 
            variant="gradient" 
            className="w-full"
            onClick={() => {
              setOpen(false);
              navigate('/pricing');
            }}
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
