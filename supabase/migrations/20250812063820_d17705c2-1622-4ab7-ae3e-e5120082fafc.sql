
-- 1) Remove overly permissive read access on questions
DROP POLICY IF EXISTS "Authenticated users can read questions" ON public.questions;

-- 2) Revoke direct execution on the internal function that returns full question rows (with answers)
REVOKE EXECUTE ON FUNCTION public.fetch_random_questions(uuid, text, text, integer)
FROM PUBLIC, anon, authenticated;

-- 3) Ensure no duplicate "served" markers; enables conflict-free inserts later if needed
CREATE UNIQUE INDEX IF NOT EXISTS answered_questions_user_question_uidx
  ON public.answered_questions (user_id, question_id);

-- 4) Secure RPC to fetch questions WITHOUT answers/explanations.
--    Also marks them as "served" to avoid repeating for this user.
CREATE OR REPLACE FUNCTION public.fetch_random_questions_public(
  p_subject text,
  p_topic text,
  p_limit integer DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  question text,
  options jsonb,
  subject text,
  topic text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH selected AS (
    SELECT q.*
    FROM public.fetch_random_questions(auth.uid(), p_subject, p_topic, p_limit) AS q
  ),
  ins AS (
    INSERT INTO public.answered_questions (user_id, question_id, subject, topic)
    SELECT auth.uid(), s.id, s.subject, s.topic
    FROM selected s
    WHERE NOT EXISTS (
      SELECT 1
      FROM public.answered_questions a
      WHERE a.user_id = auth.uid()
        AND a.question_id = s.id
    )
    RETURNING question_id
  )
  SELECT s.id, s.question, s.options, s.subject, s.topic
  FROM selected s;
END;
$$;

GRANT EXECUTE ON FUNCTION public.fetch_random_questions_public(text, text, integer) TO authenticated;

-- 5) Secure RPC to reveal answers/explanations ONLY for questions that were served to this user
CREATE OR REPLACE FUNCTION public.get_question_answers_public(
  p_question_ids uuid[]
)
RETURNS TABLE (
  id uuid,
  correct_answer text,
  explanation text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT q.id, q.correct_answer, COALESCE(q.explanation, '') AS explanation
  FROM public.questions q
  WHERE q.id = ANY (p_question_ids)
    AND EXISTS (
      SELECT 1
      FROM public.answered_questions a
      WHERE a.user_id = auth.uid()
        AND a.question_id = q.id
    );
$$;

GRANT EXECUTE ON FUNCTION public.get_question_answers_public(uuid[]) TO authenticated;
