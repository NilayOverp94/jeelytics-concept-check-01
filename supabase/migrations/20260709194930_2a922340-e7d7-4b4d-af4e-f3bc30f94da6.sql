
-- 1) Realtime policies: change ELSE true -> false
DROP POLICY IF EXISTS "group_members_can_read_realtime" ON realtime.messages;
DROP POLICY IF EXISTS "group_members_can_send_realtime" ON realtime.messages;

CREATE POLICY "group_members_can_read_realtime" ON realtime.messages
FOR SELECT TO authenticated
USING (
  CASE WHEN realtime.topic() LIKE 'group:%'
    THEN public.is_group_member(auth.uid(), (SUBSTRING(realtime.topic() FROM 7))::uuid)
    ELSE false
  END
);

CREATE POLICY "group_members_can_send_realtime" ON realtime.messages
FOR INSERT TO authenticated
WITH CHECK (
  CASE WHEN realtime.topic() LIKE 'group:%'
    THEN public.is_group_member(auth.uid(), (SUBSTRING(realtime.topic() FROM 7))::uuid)
    ELSE false
  END
);

-- 2) Profiles: restrict SELECT to self or shared-group members
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

CREATE POLICY "Users can view own or shared-group profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1
    FROM public.study_group_members m1
    JOIN public.study_group_members m2 ON m1.group_id = m2.group_id
    WHERE m1.user_id = auth.uid()
      AND m2.user_id = profiles.user_id
  )
);

-- 3) increment_daily_test_count: enforce caller identity
CREATE OR REPLACE FUNCTION public.increment_daily_test_count(p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_last_reset DATE;
  v_today DATE := (now() AT TIME ZONE 'Asia/Kolkata')::DATE;
  v_current_month INTEGER := EXTRACT(MONTH FROM (now() AT TIME ZONE 'Asia/Kolkata'));
  v_current_year INTEGER := EXTRACT(YEAR FROM (now() AT TIME ZONE 'Asia/Kolkata'));
  v_reset_month INTEGER;
  v_reset_year INTEGER;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT last_test_reset_date INTO v_last_reset
  FROM public.user_stats
  WHERE user_id = p_user_id;

  IF v_last_reset IS NULL THEN
    UPDATE public.user_stats
    SET tests_today = 1, last_test_reset_date = v_today, updated_at = now()
    WHERE user_id = p_user_id;
  ELSE
    v_reset_month := EXTRACT(MONTH FROM v_last_reset);
    v_reset_year := EXTRACT(YEAR FROM v_last_reset);
    IF v_current_year > v_reset_year OR v_current_month > v_reset_month THEN
      UPDATE public.user_stats
      SET tests_today = 1, last_test_reset_date = v_today, updated_at = now()
      WHERE user_id = p_user_id;
    ELSE
      UPDATE public.user_stats
      SET tests_today = tests_today + 1, updated_at = now()
      WHERE user_id = p_user_id;
    END IF;
  END IF;
END;
$function$;

-- 4) chat-media: replace broad public SELECT with group-member SELECT
DROP POLICY IF EXISTS "chat_media_public_read" ON storage.objects;

CREATE POLICY "chat_media_group_members_read"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'chat-media'
  AND (
    (auth.uid())::text = (storage.foldername(name))[1]
    OR public.is_group_member(auth.uid(), ((storage.foldername(name))[2])::uuid)
  )
);

-- 5) Revoke EXECUTE from anon on all SECURITY DEFINER public functions
REVOKE EXECUTE ON FUNCTION public.is_premium_user(uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_group_member(uuid, uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.lookup_group_by_invite_code(text) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.send_group_invite(text, uuid, text) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_remaining_tests(uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.can_take_test(uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.increment_daily_test_count(uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.toggle_pin_message(uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.award_xp(integer) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.fetch_random_questions_public(text, text, integer) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.grant_owner_premium_if_match() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.join_group_with_code(text) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_group_invite_code(uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, PUBLIC;
