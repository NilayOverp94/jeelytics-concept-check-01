## Goal
Turn JEElytics into an MCP server that ChatGPT, Claude, Cursor, and other AI assistants can connect to. Students will be able to say things like *"Start a JEE Main Physics test for me"* and the AI will call JEElytics tools securely under their own account.

## Important prerequisite
This project uses an **external (bring-your-own) Supabase project**. Before the MCP server can be secured with OAuth, **OAuth 2.1 + Dynamic Client Registration must be enabled in your Supabase dashboard**:
https://supabase.com/dashboard/project/qoemuymleuoaymuenxjs/auth/providers

If it is not enabled, the MCP server cannot verify tokens and we must pause until you turn it on. We will not bypass this with service-role keys or public access.

## What will be built

### 1. MCP server entry and Vite plugin
- Create `src/lib/mcp/index.ts` with `defineMcp`.
- Add `mcpPlugin()` to `vite.config.ts`.
- The plugin auto-generates `supabase/functions/mcp/index.ts` at build time.

### 2. OAuth-secured auth config
- `auth.oauth.issuer` pointing to `https://qoemuymleuoaymuenxjs.supabase.co/auth/v1`.
- Tools will forward the caller's bearer token to Supabase so RLS runs as that user.

### 3. Consent screen
- Create `src/pages/OAuthConsent.tsx` at `/.lovable/oauth/consent`.
- Update `src/pages/Login.tsx` and signup flow to preserve `?next=` redirect back to the consent screen after sign-in.

### 4. First batch of tools (test/voice priority)
These tools match your priority use case and are read-safe or user-scoped:
- `get_profile` — read the signed-in user's profile, XP, level, badges, and subscription status.
- `get_weak_chapters` — list the user's weak subjects/chapters based on recent test results.
- `get_test_history` — fetch recent test results with scores.
- `start_test` — create a new test session for a subject/topic/difficulty and return the first question set.
- `submit_answer` — submit an answer for an active test question.
- `list_pyqs` — list available PYQ papers for an exam and year.

### 5. Second batch of tools (full app control expansion)
After the first batch works, expand to:
- `send_group_message` — send a text/image/voice message in a study group the user belongs to.
- `list_group_members` — list members of a group.
- `create_study_group` — create a new group.
- `join_group_by_code` — join a group using an invite code.
- `get_notifications` — read the user's inbox notifications.
- `mark_notification_read` — mark a notification as read.

### 6. UI and deployment
- Add a favicon if missing (required for the connector list icon).
- Deploy the `mcp` edge function.
- Run `app_mcp_server--extract_mcp_manifest` to generate `.lovable/mcp/manifest.json`.
- The app then appears in Lovable's **More → Agent integrations** panel.

## Security model
- Every tool runs as the signed-in user. No service-role escalation inside tool handlers.
- All database access uses the forwarded bearer token, so existing RLS policies continue to protect data.
- No tool will expose another user's data or bypass group membership checks.
- The `full app control` scope is implemented as user-scoped actions only — the AI can do what the user themselves can do, nothing more.

## Out of scope for this plan
- Building a chatbot inside JEElytics itself (MCP is for external AI clients, not an in-app assistant).
- Making any data public or weakening RLS.

## First step
Please confirm whether OAuth 2.1 is enabled in your Supabase dashboard. If yes, I will proceed with implementation immediately. If not, enable it and then tell me to continue.