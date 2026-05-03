
-- 1. Lock down activate_subscription (service_role only)
REVOKE EXECUTE ON FUNCTION public.activate_subscription(uuid, text, text, timestamptz, timestamptz) FROM PUBLIC, anon, authenticated;

-- 2. Secure group join: require invite code
DROP POLICY IF EXISTS "Users can join groups" ON public.study_group_members;

CREATE POLICY "Creators self-add on create"
ON public.study_group_members
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.study_groups sg
    WHERE sg.id = study_group_members.group_id AND sg.created_by = auth.uid()
  )
);

CREATE OR REPLACE FUNCTION public.join_group_with_code(p_invite_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_group_id uuid;
  v_max integer;
  v_count integer;
  v_user uuid := auth.uid();
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT id, max_members INTO v_group_id, v_max
  FROM public.study_groups WHERE invite_code = p_invite_code LIMIT 1;
  IF v_group_id IS NULL THEN RAISE EXCEPTION 'Invalid invite code'; END IF;

  IF EXISTS (SELECT 1 FROM public.study_group_members WHERE group_id = v_group_id AND user_id = v_user) THEN
    RETURN v_group_id;
  END IF;

  SELECT count(*) INTO v_count FROM public.study_group_members WHERE group_id = v_group_id;
  IF v_max IS NOT NULL AND v_count >= v_max THEN RAISE EXCEPTION 'Group is full'; END IF;

  INSERT INTO public.study_group_members (group_id, user_id, role)
  VALUES (v_group_id, v_user, 'member');

  RETURN v_group_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.join_group_with_code(text) TO authenticated;

-- 3. Hide sensitive columns from clients
REVOKE SELECT (razorpay_order_id, razorpay_payment_id, razorpay_signature)
  ON public.user_subscriptions FROM anon, authenticated;

REVOKE SELECT (invite_code) ON public.study_groups FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_group_invite_code(p_group_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  v_code text;
  v_user uuid := auth.uid();
  v_is_admin boolean;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  SELECT EXISTS (
    SELECT 1 FROM public.study_groups sg
    WHERE sg.id = p_group_id AND sg.created_by = v_user
  ) OR EXISTS (
    SELECT 1 FROM public.study_group_members m
    WHERE m.group_id = p_group_id AND m.user_id = v_user AND m.role = 'admin'
  ) INTO v_is_admin;

  IF NOT v_is_admin THEN RETURN NULL; END IF;

  SELECT invite_code INTO v_code FROM public.study_groups WHERE id = p_group_id;
  RETURN v_code;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_group_invite_code(uuid) TO authenticated;

-- 4. Realtime authorization for group channels (topic format: group:<uuid>)
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "group_members_can_read_realtime" ON realtime.messages;
CREATE POLICY "group_members_can_read_realtime"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  CASE
    WHEN realtime.topic() LIKE 'group:%' THEN
      public.is_group_member(auth.uid(), substring(realtime.topic() from 7)::uuid)
    ELSE true
  END
);

DROP POLICY IF EXISTS "group_members_can_send_realtime" ON realtime.messages;
CREATE POLICY "group_members_can_send_realtime"
ON realtime.messages
FOR INSERT
TO authenticated
WITH CHECK (
  CASE
    WHEN realtime.topic() LIKE 'group:%' THEN
      public.is_group_member(auth.uid(), substring(realtime.topic() from 7)::uuid)
    ELSE true
  END
);
