SELECT cron.schedule(
  'auto-notifications-morning',
  '30 2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://qoemuymleuoaymuenxjs.supabase.co/functions/v1/auto-notifications',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvZW11eW1sZXVvYXltdWVueGpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNjcwMzksImV4cCI6MjA2Nzc0MzAzOX0.VJguxjXzpHgDQQM1cvbguI7lbo05Z4DyX56P8xoVp4w"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

SELECT cron.schedule(
  'auto-notifications-evening',
  '30 14 * * *',
  $$
  SELECT net.http_post(
    url := 'https://qoemuymleuoaymuenxjs.supabase.co/functions/v1/auto-notifications',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvZW11eW1sZXVvYXltdWVueGpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNjcwMzksImV4cCI6MjA2Nzc0MzAzOX0.VJguxjXzpHgDQQM1cvbguI7lbo05Z4DyX56P8xoVp4w"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);