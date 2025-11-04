-- Drop the vulnerable SECURITY DEFINER function that exposes test answers
-- This function bypasses RLS and allows any authenticated user to retrieve
-- correct answers for arbitrary question IDs without validation.
-- The test_results table already contains all answer data needed for the results page.

DROP FUNCTION IF EXISTS public.get_question_answers_public(uuid[]);