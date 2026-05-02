-- 1. app_config table (service_role only)
CREATE TABLE IF NOT EXISTS public.app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- No policies = no access for anon/authenticated. Only service_role bypasses RLS.

INSERT INTO public.app_config (key, value)
VALUES ('owner_email', 'nilayraj713@gmail.com')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- 2. Function to grant lifetime premium to owner
CREATE OR REPLACE FUNCTION public.grant_owner_premium_if_match()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_owner_email TEXT;
  v_plan_id UUID;
  v_existing UUID;
BEGIN
  SELECT value INTO v_owner_email FROM public.app_config WHERE key = 'owner_email';

  IF v_owner_email IS NULL OR LOWER(NEW.email) <> LOWER(v_owner_email) THEN
    RETURN NEW;
  END IF;

  -- Already has an active long-term subscription? Skip.
  SELECT id INTO v_existing
  FROM public.user_subscriptions
  WHERE user_id = NEW.id
    AND status = 'active'
    AND expires_at > now() + INTERVAL '1 year'
  LIMIT 1;

  IF v_existing IS NOT NULL THEN
    RETURN NEW;
  END IF;

  SELECT id INTO v_plan_id FROM public.subscription_plans WHERE name = 'yearly' AND is_active = true LIMIT 1;
  IF v_plan_id IS NULL THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.user_subscriptions (
    user_id, plan_id, status, starts_at, expires_at,
    razorpay_order_id, razorpay_payment_id
  ) VALUES (
    NEW.id, v_plan_id, 'active', now(), now() + INTERVAL '100 years',
    'owner_grant_' || extract(epoch from now())::TEXT,
    'owner_auto_grant'
  );

  RETURN NEW;
END;
$$;

-- Trigger on insert (signup) and update (login refreshes user row)
DROP TRIGGER IF EXISTS owner_premium_on_user_change ON auth.users;
CREATE TRIGGER owner_premium_on_user_change
AFTER INSERT OR UPDATE OF email, last_sign_in_at ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.grant_owner_premium_if_match();

-- 3. Storage bucket for chat media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-media',
  'chat-media',
  true,
  26214400, -- 25 MB
  ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/gif',
        'audio/webm','audio/ogg','audio/mpeg','audio/mp4','audio/wav',
        'application/pdf','application/zip',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword','text/plain']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies: anyone can read (public bucket); authenticated users upload to their own folder
DROP POLICY IF EXISTS "chat_media_public_read" ON storage.objects;
CREATE POLICY "chat_media_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-media');

DROP POLICY IF EXISTS "chat_media_user_upload" ON storage.objects;
CREATE POLICY "chat_media_user_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-media'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "chat_media_user_delete" ON storage.objects;
CREATE POLICY "chat_media_user_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat-media'
  AND auth.uid()::text = (storage.foldername(name))[1]
);