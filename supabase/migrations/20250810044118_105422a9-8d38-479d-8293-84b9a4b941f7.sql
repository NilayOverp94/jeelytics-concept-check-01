-- Create questions table to store PCM questions
CREATE TABLE IF NOT EXISTS public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  topic text NOT NULL,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_answer text NOT NULL,
  explanation text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS and allow authenticated users to read questions
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'questions' AND policyname = 'Authenticated users can read questions'
  ) THEN
    CREATE POLICY "Authenticated users can read questions"
      ON public.questions
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Trigger to update updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_questions_updated_at'
  ) THEN
    CREATE TRIGGER update_questions_updated_at
    BEFORE UPDATE ON public.questions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Create answered_questions table to track which questions a user has seen/answered per topic
CREATE TABLE IF NOT EXISTS public.answered_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subject text NOT NULL,
  topic text NOT NULL,
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  answered_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_topic_question UNIQUE (user_id, subject, topic, question_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_answered_questions_user_topic ON public.answered_questions (user_id, subject, topic);
CREATE INDEX IF NOT EXISTS idx_questions_subject_topic ON public.questions (subject, topic);

-- Enable RLS on answered_questions
ALTER TABLE public.answered_questions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'answered_questions' AND policyname = 'Users can read their own answered questions'
  ) THEN
    CREATE POLICY "Users can read their own answered questions"
      ON public.answered_questions
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'answered_questions' AND policyname = 'Users can insert their own answered questions'
  ) THEN
    CREATE POLICY "Users can insert their own answered questions"
      ON public.answered_questions
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'answered_questions' AND policyname = 'Users can delete their own answered questions'
  ) THEN
    CREATE POLICY "Users can delete their own answered questions"
      ON public.answered_questions
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Function to fetch randomized non-repeating questions, resetting cycle when exhausted
CREATE OR REPLACE FUNCTION public.fetch_random_questions(
  p_user_id uuid,
  p_subject text,
  p_topic text,
  p_limit integer
)
RETURNS SETOF public.questions
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  remaining_count integer;
BEGIN
  -- Count remaining questions for this user/topic that haven't been answered yet
  SELECT COUNT(*) INTO remaining_count
  FROM public.questions q
  WHERE q.subject = p_subject
    AND q.topic = p_topic
    AND NOT EXISTS (
      SELECT 1
      FROM public.answered_questions a
      WHERE a.user_id = p_user_id
        AND a.subject = p_subject
        AND a.topic = p_topic
        AND a.question_id = q.id
    );

  -- If none remaining, reset the cycle by clearing answered tracking for this topic
  IF remaining_count = 0 THEN
    DELETE FROM public.answered_questions
    WHERE user_id = p_user_id
      AND subject = p_subject
      AND topic = p_topic;
  END IF;

  -- Return a randomized subset of the remaining pool (or full pool after reset)
  RETURN QUERY
  SELECT q.*
  FROM public.questions q
  WHERE q.subject = p_subject
    AND q.topic = p_topic
    AND NOT EXISTS (
      SELECT 1
      FROM public.answered_questions a
      WHERE a.user_id = p_user_id
        AND a.subject = p_subject
        AND a.topic = p_topic
        AND a.question_id = q.id
    )
  ORDER BY random()
  LIMIT LEAST(GREATEST(p_limit, 1), 100); -- safety bounds
END;
$$;