import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = "https://qoemuymleuoaymuenxjs.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvZW11eW1sZXVvYXltdWVueGpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNjcwMzksImV4cCI6MjA2Nzc0MzAzOX0.VJguxjXzpHgDQQM1cvbguI7lbo05Z4DyX56P8xoVp4w";

async function authedHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return {
    "Content-Type": "application/json",
    apikey: SUPABASE_ANON,
    Authorization: `Bearer ${token ?? SUPABASE_ANON}`,
  };
}

type OAuthResult<T> = { data: T | null; error: { message: string } | null };

async function call<T>(path: string, method: "GET" | "POST"): Promise<OAuthResult<T>> {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1${path}`, {
      method,
      headers: await authedHeaders(),
    });
    const text = await res.text();
    const body = text ? JSON.parse(text) : null;
    if (!res.ok) {
      return { data: null, error: { message: body?.msg || body?.error_description || body?.error || res.statusText } };
    }
    return { data: body as T, error: null };
  } catch (e: any) {
    return { data: null, error: { message: e?.message ?? "Network error" } };
  }
}

export function getAuthorizationDetails(id: string) {
  return call<any>(`/oauth/authorizations/${encodeURIComponent(id)}`, "GET");
}
export function approveAuthorization(id: string) {
  return call<any>(`/oauth/authorizations/${encodeURIComponent(id)}/approve`, "POST");
}
export function denyAuthorization(id: string) {
  return call<any>(`/oauth/authorizations/${encodeURIComponent(id)}/deny`, "POST");
}
