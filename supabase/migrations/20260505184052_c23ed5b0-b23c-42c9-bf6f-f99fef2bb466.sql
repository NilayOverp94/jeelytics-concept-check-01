
-- =========================
-- CHAT POLISH
-- =========================

-- Group description
ALTER TABLE public.study_groups ADD COLUMN IF NOT EXISTS description TEXT;

-- Pinned flag on messages
ALTER TABLE public.study_group_messages ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT false;

-- Reactions table
CREATE TABLE IF NOT EXISTS public.message_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL,
  user_id UUID NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (message_id, user_id, emoji)
);
CREATE INDEX IF NOT EXISTS idx_message_reactions_msg ON public.message_reactions(message_id);

ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members view reactions"
ON public.message_reactions FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.study_group_messages m
  WHERE m.id = message_reactions.message_id
    AND public.is_group_member(auth.uid(), m.group_id)
));

CREATE POLICY "Members add own reactions"
ON public.message_reactions FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.study_group_messages m
    WHERE m.id = message_reactions.message_id
      AND public.is_group_member(auth.uid(), m.group_id)
  )
);

CREATE POLICY "Users remove own reactions"
ON public.message_reactions FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Pin toggle (admins only)
CREATE OR REPLACE FUNCTION public.toggle_pin_message(p_message_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_group UUID;
  v_is_admin BOOLEAN;
  v_pinned BOOLEAN;
BEGIN
  SELECT group_id, is_pinned INTO v_group, v_pinned
  FROM public.study_group_messages WHERE id = p_message_id;
  IF v_group IS NULL THEN RAISE EXCEPTION 'Message not found'; END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.study_groups WHERE id = v_group AND created_by = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.study_group_members
    WHERE group_id = v_group AND user_id = auth.uid() AND role = 'admin'
  ) INTO v_is_admin;

  IF NOT v_is_admin THEN RAISE EXCEPTION 'Only admins can pin'; END IF;

  UPDATE public.study_group_messages SET is_pinned = NOT v_pinned WHERE id = p_message_id;
  RETURN NOT v_pinned;
END;
$$;

-- Allow admins to UPDATE is_pinned via the function above (RLS already permits owner; ensure admins can too)
CREATE POLICY "Admins can update messages in their groups"
ON public.study_group_messages FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.study_groups sg
    WHERE sg.id = study_group_messages.group_id AND sg.created_by = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.study_group_members
    WHERE group_id = study_group_messages.group_id AND user_id = auth.uid() AND role = 'admin'
  )
);

-- =========================
-- GAMIFICATION
-- =========================

CREATE TABLE IF NOT EXISTS public.user_xp (
  user_id UUID NOT NULL PRIMARY KEY,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  points INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own xp" ON public.user_xp FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users insert own xp" ON public.user_xp FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own xp" ON public.user_xp FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  badge_key TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge_key)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own badges" ON public.user_badges FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users insert own badges" ON public.user_badges FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- award_xp function
CREATE OR REPLACE FUNCTION public.award_xp(p_amount INTEGER)
RETURNS TABLE(new_xp INTEGER, new_level INTEGER, leveled_up BOOLEAN)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user UUID := auth.uid();
  v_current_xp INTEGER;
  v_current_level INTEGER;
  v_new_xp INTEGER;
  v_new_level INTEGER;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  INSERT INTO public.user_xp (user_id, xp, level)
  VALUES (v_user, 0, 1)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT xp, level INTO v_current_xp, v_current_level FROM public.user_xp WHERE user_id = v_user;
  v_new_xp := v_current_xp + GREATEST(p_amount, 0);
  v_new_level := GREATEST(1, FLOOR(SQRT(v_new_xp::numeric / 100))::INTEGER + 1);

  UPDATE public.user_xp SET xp = v_new_xp, level = v_new_level, updated_at = now() WHERE user_id = v_user;

  RETURN QUERY SELECT v_new_xp, v_new_level, (v_new_level > v_current_level);
END;
$$;
