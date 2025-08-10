-- Update fetch_random_questions function to set a fixed search_path per security linter
CREATE OR REPLACE FUNCTION public.fetch_random_questions(
  p_user_id uuid,
  p_subject text,
  p_topic text,
  p_limit integer
)
RETURNS SETOF public.questions
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
VOLATILE
AS $$
DECLARE
  remaining_count integer;
BEGIN
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

  IF remaining_count = 0 THEN
    DELETE FROM public.answered_questions
    WHERE user_id = p_user_id
      AND subject = p_subject
      AND topic = p_topic;
  END IF;

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
  LIMIT LEAST(GREATEST(p_limit, 1), 100);
END;
$$;