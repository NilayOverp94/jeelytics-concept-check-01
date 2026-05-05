
DROP POLICY IF EXISTS "Group members can read realtime messages" ON realtime.messages;
DROP POLICY IF EXISTS "Group members can publish realtime messages" ON realtime.messages;

CREATE POLICY "Group members can read realtime messages"
ON realtime.messages FOR SELECT TO authenticated
USING (
  CASE
    WHEN realtime.topic() LIKE 'group:%' THEN
      public.is_group_member(auth.uid(), substring(realtime.topic() from 7)::uuid)
    ELSE false
  END
);

CREATE POLICY "Group members can publish realtime messages"
ON realtime.messages FOR INSERT TO authenticated
WITH CHECK (
  CASE
    WHEN realtime.topic() LIKE 'group:%' THEN
      public.is_group_member(auth.uid(), substring(realtime.topic() from 7)::uuid)
    ELSE false
  END
);
