-- Phase 1: Database Schema for JEElytics Premium Subscription System

-- 1.1 Create Subscription Plans Table
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  price_inr INTEGER NOT NULL,  -- Price in paise (2900 = Rs. 29)
  duration_days INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on subscription_plans (publicly readable, no write access)
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active subscription plans"
ON public.subscription_plans
FOR SELECT
USING (is_active = true);

-- Insert default plans with UPDATED PRICES
INSERT INTO public.subscription_plans (name, display_name, price_inr, duration_days) VALUES
  ('monthly', 'Monthly Plan', 2900, 30),   -- Rs. 29/month
  ('yearly', 'Yearly Plan', 10900, 365);   -- Rs. 109/year

-- 1.2 Create User Subscriptions Table
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan_id UUID REFERENCES public.subscription_plans(id),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on user_subscriptions
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
ON public.user_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
ON public.user_subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
ON public.user_subscriptions
FOR UPDATE
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);

-- 1.3 Add Daily Test Tracking to user_stats
ALTER TABLE public.user_stats
ADD COLUMN tests_today INTEGER DEFAULT 0,
ADD COLUMN last_test_reset_date DATE;

-- 1.4 Create Security Definer Functions

-- Function to check if user is premium
CREATE OR REPLACE FUNCTION public.is_premium_user(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_subscriptions
    WHERE user_id = p_user_id
      AND status = 'active'
      AND expires_at > now()
  );
END;
$$;

-- Function to check if user can take a test (premium OR has daily tests remaining)
CREATE OR REPLACE FUNCTION public.can_take_test(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_premium BOOLEAN;
  v_tests_today INTEGER;
  v_last_reset DATE;
  v_daily_limit INTEGER := 2;
BEGIN
  -- Check if premium
  v_is_premium := public.is_premium_user(p_user_id);
  IF v_is_premium THEN
    RETURN TRUE;
  END IF;

  -- Get current test count
  SELECT tests_today, last_test_reset_date
  INTO v_tests_today, v_last_reset
  FROM public.user_stats
  WHERE user_id = p_user_id;

  -- If no stats found, user can take test
  IF v_tests_today IS NULL THEN
    RETURN TRUE;
  END IF;

  -- Reset counter if it's a new day (IST = UTC+5:30)
  IF v_last_reset IS NULL OR v_last_reset < (now() AT TIME ZONE 'Asia/Kolkata')::DATE THEN
    RETURN TRUE;
  END IF;

  -- Check against daily limit
  RETURN v_tests_today < v_daily_limit;
END;
$$;

-- Function to increment daily test count
CREATE OR REPLACE FUNCTION public.increment_daily_test_count(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_reset DATE;
  v_today DATE := (now() AT TIME ZONE 'Asia/Kolkata')::DATE;
BEGIN
  -- Get last reset date
  SELECT last_test_reset_date INTO v_last_reset
  FROM public.user_stats
  WHERE user_id = p_user_id;

  -- If new day or first test, reset counter
  IF v_last_reset IS NULL OR v_last_reset < v_today THEN
    UPDATE public.user_stats
    SET tests_today = 1,
        last_test_reset_date = v_today,
        updated_at = now()
    WHERE user_id = p_user_id;
  ELSE
    -- Increment counter
    UPDATE public.user_stats
    SET tests_today = tests_today + 1,
        updated_at = now()
    WHERE user_id = p_user_id;
  END IF;
END;
$$;

-- Function to get remaining tests for today
CREATE OR REPLACE FUNCTION public.get_remaining_tests(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_premium BOOLEAN;
  v_tests_today INTEGER;
  v_last_reset DATE;
  v_daily_limit INTEGER := 2;
  v_today DATE := (now() AT TIME ZONE 'Asia/Kolkata')::DATE;
BEGIN
  -- Premium users have unlimited
  v_is_premium := public.is_premium_user(p_user_id);
  IF v_is_premium THEN
    RETURN -1; -- -1 means unlimited
  END IF;

  -- Get current count
  SELECT tests_today, last_test_reset_date
  INTO v_tests_today, v_last_reset
  FROM public.user_stats
  WHERE user_id = p_user_id;

  -- New day = full limit
  IF v_last_reset IS NULL OR v_last_reset < v_today THEN
    RETURN v_daily_limit;
  END IF;

  RETURN GREATEST(0, v_daily_limit - COALESCE(v_tests_today, 0));
END;
$$;

-- Trigger for updated_at on user_subscriptions
CREATE TRIGGER update_user_subscriptions_updated_at
BEFORE UPDATE ON public.user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();