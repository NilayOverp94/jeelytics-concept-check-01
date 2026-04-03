CREATE OR REPLACE FUNCTION public.is_group_member(p_user_id uuid, p_group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.study_group_members
    WHERE user_id = p_user_id AND group_id = p_group_id
  );
$$;

DROP POLICY IF EXISTS "Members can view group members" ON public.study_group_members;

CREATE POLICY "Members can view group members"
ON public.study_group_members
FOR SELECT
TO authenticated
USING (public.is_group_member(auth.uid(), group_id));

DROP POLICY IF EXISTS "Members can view group messages" ON public.study_group_messages;

CREATE POLICY "Members can view group messages"
ON public.study_group_messages
FOR SELECT
TO authenticated
USING (public.is_group_member(auth.uid(), group_id));

DROP POLICY IF EXISTS "Members can send messages" ON public.study_group_messages;

CREATE POLICY "Members can send messages"
ON public.study_group_messages
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() AND public.is_group_member(auth.uid(), group_id));

DROP POLICY IF EXISTS "Members can view their groups" ON public.study_groups;

CREATE POLICY "Members can view their groups"
ON public.study_groups
FOR SELECT
TO authenticated
USING (public.is_group_member(auth.uid(), id));