-- Enforce one reaction per user per message
DELETE FROM public.message_reactions a USING public.message_reactions b
WHERE a.ctid < b.ctid AND a.message_id = b.message_id AND a.user_id = b.user_id;

ALTER TABLE public.message_reactions DROP CONSTRAINT IF EXISTS message_reactions_message_id_user_id_emoji_key;
ALTER TABLE public.message_reactions ADD CONSTRAINT message_reactions_one_per_user UNIQUE (message_id, user_id);