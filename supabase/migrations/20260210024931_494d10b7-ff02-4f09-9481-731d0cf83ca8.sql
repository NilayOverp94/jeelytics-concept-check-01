
-- Fix can_take_test to use monthly limit of 10
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
  v_monthly_limit INTEGER := 10;
  v_current_month INTEGER := EXTRACT(MONTH FROM (now() AT TIME ZONE 'Asia/Kolkata'));
  v_current_year INTEGER := EXTRACT(YEAR FROM (now() AT TIME ZONE 'Asia/Kolkata'));
  v_reset_month INTEGER;
  v_reset_year INTEGER;
BEGIN
  v_is_premium := public.is_premium_user(p_user_id);
  IF v_is_premium THEN
    RETURN TRUE;
  END IF;

  SELECT tests_today, last_test_reset_date
  INTO v_tests_today, v_last_reset
  FROM public.user_stats
  WHERE user_id = p_user_id;

  IF v_tests_today IS NULL THEN
    RETURN TRUE;
  END IF;

  IF v_last_reset IS NULL THEN
    RETURN TRUE;
  END IF;

  v_reset_month := EXTRACT(MONTH FROM v_last_reset);
  v_reset_year := EXTRACT(YEAR FROM v_last_reset);
  
  IF v_current_year > v_reset_year OR v_current_month > v_reset_month THEN
    RETURN TRUE;
  END IF;

  RETURN v_tests_today < v_monthly_limit;
END;
$$;

-- Fix increment to be monthly not daily
CREATE OR REPLACE FUNCTION public.increment_daily_test_count(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_reset DATE;
  v_today DATE := (now() AT TIME ZONE 'Asia/Kolkata')::DATE;
  v_current_month INTEGER := EXTRACT(MONTH FROM (now() AT TIME ZONE 'Asia/Kolkata'));
  v_current_year INTEGER := EXTRACT(YEAR FROM (now() AT TIME ZONE 'Asia/Kolkata'));
  v_reset_month INTEGER;
  v_reset_year INTEGER;
BEGIN
  SELECT last_test_reset_date INTO v_last_reset
  FROM public.user_stats
  WHERE user_id = p_user_id;

  IF v_last_reset IS NULL THEN
    UPDATE public.user_stats
    SET tests_today = 1,
        last_test_reset_date = v_today,
        updated_at = now()
    WHERE user_id = p_user_id;
  ELSE
    v_reset_month := EXTRACT(MONTH FROM v_last_reset);
    v_reset_year := EXTRACT(YEAR FROM v_last_reset);
    
    IF v_current_year > v_reset_year OR v_current_month > v_reset_month THEN
      UPDATE public.user_stats
      SET tests_today = 1,
          last_test_reset_date = v_today,
          updated_at = now()
      WHERE user_id = p_user_id;
    ELSE
      UPDATE public.user_stats
      SET tests_today = tests_today + 1,
          updated_at = now()
      WHERE user_id = p_user_id;
    END IF;
  END IF;
END;
$$;

-- Fix prices: 2900 -> 29, 10900 -> 109 (store in rupees, not paise)
UPDATE public.subscription_plans SET price_inr = 29 WHERE name = 'monthly';
UPDATE public.subscription_plans SET price_inr = 109 WHERE name = 'yearly';
