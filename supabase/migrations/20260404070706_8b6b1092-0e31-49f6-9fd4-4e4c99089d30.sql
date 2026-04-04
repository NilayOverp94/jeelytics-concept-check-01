ALTER TABLE public.study_groups
ADD COLUMN IF NOT EXISTS avatar_key text NOT NULL DEFAULT 'books';

CREATE TABLE IF NOT EXISTS public.study_group_message_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.study_group_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  delivered_at timestamp with time zone NULL,
  read_at timestamp with time zone NULL,
  hidden_at timestamp with time zone NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (message_id, user_id)
);

ALTER TABLE public.study_group_message_states ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_study_group_message_states_message_id
ON public.study_group_message_states(message_id);

CREATE INDEX IF NOT EXISTS idx_study_group_message_states_user_id
ON public.study_group_message_states(user_id);

CREATE INDEX IF NOT EXISTS idx_study_group_message_states_hidden_at
ON public.study_group_message_states(user_id, hidden_at);

DROP POLICY IF EXISTS "Users can view own message states" ON public.study_group_message_states;
CREATE POLICY "Users can view own message states"
ON public.study_group_message_states
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own message states" ON public.study_group_message_states;
CREATE POLICY "Users can create own message states"
ON public.study_group_message_states
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.study_group_messages m
    WHERE m.id = message_id
      AND public.is_group_member(auth.uid(), m.group_id)
  )
);

DROP POLICY IF EXISTS "Users can update own message states" ON public.study_group_message_states;
CREATE POLICY "Users can update own message states"
ON public.study_group_message_states
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP TRIGGER IF EXISTS update_study_group_message_states_updated_at ON public.study_group_message_states;
CREATE TRIGGER update_study_group_message_states_updated_at
BEFORE UPDATE ON public.study_group_message_states
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'study_group_message_states'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.study_group_message_states;
  END IF;
END $$;