import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SubscriptionPlan {
  id: string;
  name: string;
  display_name: string;
  price_inr: number;
  duration_days: number;
  is_active: boolean;
}

interface UserSubscription {
  id: string;
  status: string;
  starts_at: string | null;
  expires_at: string | null;
  plan: SubscriptionPlan | null;
}

interface UseSubscriptionReturn {
  isPremium: boolean;
  subscription: UserSubscription | null;
  plans: SubscriptionPlan[];
  remainingTests: number;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [remainingTests, setRemainingTests] = useState(2);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscriptionStatus = useCallback(async () => {
    if (!user) {
      setIsPremium(false);
      setSubscription(null);
      setRemainingTests(2);
      setIsLoading(false);
      return;
    }

    try {
      // Check premium status using database function
      const { data: premiumData, error: premiumError } = await supabase
        .rpc('is_premium_user', { p_user_id: user.id });

      if (premiumError) {
        console.error('Error checking premium status:', premiumError);
      } else {
        setIsPremium(premiumData || false);
      }

      // Get remaining tests
      const { data: testsData, error: testsError } = await supabase
        .rpc('get_remaining_tests', { p_user_id: user.id });

      if (testsError) {
        console.error('Error getting remaining tests:', testsError);
      } else {
        setRemainingTests(testsData ?? 2);
      }

      // Get active subscription details
      const { data: subData, error: subError } = await supabase
        .from('user_subscriptions')
        .select(`
          id,
          status,
          starts_at,
          expires_at,
          subscription_plans (
            id,
            name,
            display_name,
            price_inr,
            duration_days,
            is_active
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString())
        .order('expires_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (subError) {
        console.error('Error fetching subscription:', subError);
      } else if (subData) {
        setSubscription({
          id: subData.id,
          status: subData.status,
          starts_at: subData.starts_at,
          expires_at: subData.expires_at,
          plan: subData.subscription_plans as unknown as SubscriptionPlan
        });
      } else {
        setSubscription(null);
      }

    } catch (error) {
      console.error('Error in fetchSubscriptionStatus:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchPlans = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_inr', { ascending: true });

      if (error) {
        console.error('Error fetching plans:', error);
      } else {
        setPlans(data || []);
      }
    } catch (error) {
      console.error('Error in fetchPlans:', error);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionStatus();
    fetchPlans();
  }, [fetchSubscriptionStatus, fetchPlans]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    await fetchSubscriptionStatus();
  }, [fetchSubscriptionStatus]);

  return {
    isPremium,
    subscription,
    plans,
    remainingTests,
    isLoading,
    refetch
  };
}
