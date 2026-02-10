
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
  v_monthly_limit INTEGER := 10;
  v_today DATE := (now() AT TIME ZONE 'Asia/Kolkata')::DATE;
  v_current_month INTEGER := EXTRACT(MONTH FROM (now() AT TIME ZONE 'Asia/Kolkata'));
  v_current_year INTEGER := EXTRACT(YEAR FROM (now() AT TIME ZONE 'Asia/Kolkata'));
  v_reset_month INTEGER;
  v_reset_year INTEGER;
BEGIN
  -- Premium users have unlimited
  v_is_premium := public.is_premium_user(p_user_id);
  IF v_is_premium THEN
    RETURN -1;
  END IF;

  -- Get current count
  SELECT tests_today, last_test_reset_date
  INTO v_tests_today, v_last_reset
  FROM public.user_stats
  WHERE user_id = p_user_id;

  -- If no record, full limit
  IF v_last_reset IS NULL THEN
    RETURN v_monthly_limit;
  END IF;

  -- Check if we're in a new month
  v_reset_month := EXTRACT(MONTH FROM v_last_reset);
  v_reset_year := EXTRACT(YEAR FROM v_last_reset);
  
  IF v_current_year > v_reset_year OR v_current_month > v_reset_month THEN
    RETURN v_monthly_limit;
  END IF;

  RETURN GREATEST(0, v_monthly_limit - COALESCE(v_tests_today, 0));
END;
$$;
