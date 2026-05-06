CREATE OR REPLACE FUNCTION public.get_user_public_stats(p_user_id uuid)
RETURNS TABLE(xp integer, level integer, badges text[])
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  RETURN QUERY
  SELECT 
    COALESCE((SELECT ux.xp FROM public.user_xp ux WHERE ux.user_id = p_user_id), 0),
    COALESCE((SELECT ux.level FROM public.user_xp ux WHERE ux.user_id = p_user_id), 1),
    COALESCE(ARRAY(SELECT b.badge_key FROM public.user_badges b WHERE b.user_id = p_user_id), ARRAY[]::text[]);
END;
$$;

REVOKE ALL ON FUNCTION public.get_user_public_stats(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_user_public_stats(uuid) TO authenticated;