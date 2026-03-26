-- Remove the insecure public UPDATE policy on user_subscriptions
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.user_subscriptions;

-- Create a SECURITY DEFINER function for activating subscriptions (only callable by edge functions with service_role)
CREATE OR REPLACE FUNCTION public.activate_subscription(
  p_subscription_id uuid,
  p_razorpay_payment_id text,
  p_razorpay_signature text,
  p_starts_at timestamptz,
  p_expires_at timestamptz
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.user_subscriptions
  SET status = 'active',
      razorpay_payment_id = p_razorpay_payment_id,
      razorpay_signature = p_razorpay_signature,
      starts_at = p_starts_at,
      expires_at = p_expires_at,
      updated_at = now()
  WHERE id = p_subscription_id;
END;
$$;