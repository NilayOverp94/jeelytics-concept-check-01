-- 1. Fix study_groups SELECT policy: only members can see groups
DROP POLICY IF EXISTS "Anyone can find groups by invite code" ON public.study_groups;
CREATE POLICY "Members can view their groups" ON public.study_groups
  FOR SELECT TO authenticated
  USING (
    id IN (SELECT group_id FROM public.study_group_members WHERE user_id = auth.uid())
  );

-- 2. Create SECURITY DEFINER function for invite code lookup (so non-members can join)
CREATE OR REPLACE FUNCTION public.lookup_group_by_invite_code(p_invite_code text)
RETURNS TABLE(id uuid, name text, avatar_key text, max_members integer)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT sg.id, sg.name, sg.avatar_key, sg.max_members
  FROM public.study_groups sg
  WHERE sg.invite_code = p_invite_code
  LIMIT 1;
$$;

-- 3. Fix notifications INSERT: only service_role can insert
DROP POLICY IF EXISTS "Authenticated can insert notifications" ON public.notifications;

-- 4. Add admin role management UPDATE policy on study_group_members
CREATE POLICY "Admins can update member roles" ON public.study_group_members
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.study_groups sg
      WHERE sg.id = study_group_members.group_id
      AND sg.created_by = auth.uid()
    )
  )
  WITH CHECK (
    role IN ('member', 'admin')
    AND EXISTS (
      SELECT 1 FROM public.study_groups sg
      WHERE sg.id = study_group_members.group_id
      AND sg.created_by = auth.uid()
    )
  );

-- 5. Update subscription_plans prices
UPDATE public.subscription_plans SET price_inr = 199 WHERE name = 'monthly';
UPDATE public.subscription_plans SET price_inr = 1999 WHERE name = 'yearly';

-- 6. Allow profiles to be read by any authenticated user (for showing member names)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (true);