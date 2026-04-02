
-- Fix security: Restrict user_subscriptions INSERT to service_role only
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON public.user_subscriptions;

CREATE POLICY "Service role can insert user subscriptions" ON public.user_subscriptions
  FOR INSERT TO service_role
  WITH CHECK (true);

-- Create feedback table
CREATE TABLE public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  message text NOT NULL,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own feedback" ON public.feedback
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own feedback" ON public.feedback
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
