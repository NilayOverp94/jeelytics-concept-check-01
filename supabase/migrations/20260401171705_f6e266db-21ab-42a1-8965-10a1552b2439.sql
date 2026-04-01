
-- Study Groups table
CREATE TABLE public.study_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invite_code TEXT NOT NULL UNIQUE DEFAULT substring(md5(random()::text) from 1 for 8),
  max_members INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Study Group Members table
CREATE TABLE public.study_group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.study_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Study Group Messages table
CREATE TABLE public.study_group_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.study_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notifications / Inbox table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Study Groups: anyone authenticated can view groups they are a member of
CREATE POLICY "Members can view their groups" ON public.study_groups
  FOR SELECT TO authenticated
  USING (id IN (SELECT group_id FROM public.study_group_members WHERE user_id = auth.uid()));

-- Creator can also see their own groups
CREATE POLICY "Creators can view own groups" ON public.study_groups
  FOR SELECT TO authenticated
  USING (created_by = auth.uid());

-- Authenticated users can create groups
CREATE POLICY "Users can create groups" ON public.study_groups
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Creators can update their groups
CREATE POLICY "Creators can update own groups" ON public.study_groups
  FOR UPDATE TO authenticated
  USING (created_by = auth.uid());

-- Creators can delete their groups
CREATE POLICY "Creators can delete own groups" ON public.study_groups
  FOR DELETE TO authenticated
  USING (created_by = auth.uid());

-- Members: can view members of groups they belong to
CREATE POLICY "Members can view group members" ON public.study_group_members
  FOR SELECT TO authenticated
  USING (group_id IN (SELECT group_id FROM public.study_group_members WHERE user_id = auth.uid()));

-- Users can join groups (insert themselves)
CREATE POLICY "Users can join groups" ON public.study_group_members
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can leave groups (delete themselves)
CREATE POLICY "Users can leave groups" ON public.study_group_members
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Group creators can remove members
CREATE POLICY "Creators can remove members" ON public.study_group_members
  FOR DELETE TO authenticated
  USING (group_id IN (SELECT id FROM public.study_groups WHERE created_by = auth.uid()));

-- Messages: members can view messages in their groups
CREATE POLICY "Members can view group messages" ON public.study_group_messages
  FOR SELECT TO authenticated
  USING (group_id IN (SELECT group_id FROM public.study_group_members WHERE user_id = auth.uid()));

-- Members can send messages
CREATE POLICY "Members can send messages" ON public.study_group_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    group_id IN (SELECT group_id FROM public.study_group_members WHERE user_id = auth.uid())
  );

-- Notifications: users can only see their own
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- System can insert notifications (via service role), users can insert for invites
CREATE POLICY "Users can insert notifications" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Function to send group invite notification
CREATE OR REPLACE FUNCTION public.send_group_invite(p_invitee_email TEXT, p_group_id UUID, p_group_name TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_invitee_id UUID;
BEGIN
  SELECT id INTO v_invitee_id FROM auth.users WHERE email = p_invitee_email LIMIT 1;
  IF v_invitee_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (
      v_invitee_id,
      'Group Invite: ' || p_group_name,
      'You have been invited to join the study group "' || p_group_name || '"',
      'group_invite',
      '/groups/' || p_group_id::TEXT
    );
  END IF;
END;
$$;
