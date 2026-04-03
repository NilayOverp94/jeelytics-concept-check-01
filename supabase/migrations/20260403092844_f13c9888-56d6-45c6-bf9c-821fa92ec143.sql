-- Fix: Allow anyone authenticated to find groups by invite_code (for joining)
CREATE POLICY "Anyone can find groups by invite code"
ON public.study_groups
FOR SELECT
TO authenticated
USING (true);

-- Drop the old restrictive policies that are now redundant
DROP POLICY IF EXISTS "Creators can view own groups" ON public.study_groups;
DROP POLICY IF EXISTS "Members can view their groups" ON public.study_groups;

-- Enable realtime for study_group_messages
ALTER PUBLICATION supabase_realtime ADD TABLE study_group_messages;

-- Allow members to delete their own messages
CREATE POLICY "Users can delete own messages"
ON public.study_group_messages
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Allow group creators to delete any message in their group
CREATE POLICY "Group creators can delete any message"
ON public.study_group_messages
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.study_groups
    WHERE id = group_id AND created_by = auth.uid()
  )
);

-- Allow users to update their own messages (for editing)
CREATE POLICY "Users can edit own messages"
ON public.study_group_messages
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Add reply_to and is_deleted columns for WhatsApp-like features
ALTER TABLE public.study_group_messages 
ADD COLUMN IF NOT EXISTS reply_to uuid REFERENCES public.study_group_messages(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS edited_at timestamp with time zone;