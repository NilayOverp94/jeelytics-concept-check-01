-- Drop and recreate the function to return explanations for any valid question
DROP FUNCTION IF EXISTS public.get_question_answers_public(uuid[]);

CREATE OR REPLACE FUNCTION public.get_question_answers_public(p_question_ids uuid[])
 RETURNS TABLE(id uuid, correct_answer text, explanation text)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT q.id, q.correct_answer, COALESCE(q.explanation, 'No explanation available') AS explanation
  FROM public.questions q
  WHERE q.id = ANY (p_question_ids);
$function$;