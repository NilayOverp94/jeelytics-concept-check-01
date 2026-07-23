import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Shield, XCircle, CheckCircle } from "lucide-react";
import { extractAuthorizationIdFromUrl, peekOAuthNext, rememberOAuthNext } from "@/lib/oauthRedirect";
import { approveAuthorization, denyAuthorization, getAuthorizationDetails } from "@/lib/supabaseOAuth";

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? extractAuthorizationIdFromUrl();
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        const pendingNext = peekOAuthNext();
        if (pendingNext?.includes("authorization_id=")) {
          window.location.replace(pendingNext);
          return;
        }
        return setError("Missing authorization request. Please start the ChatGPT connection again from the connector window.");
      }
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) {
        return setError(sessionError.message);
      }
      if (!session) {
        const next = window.location.pathname + window.location.search;
        rememberOAuthNext(next);
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error: detailsError } = await getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (detailsError) return setError(detailsError.message);
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error: decisionError } = approve
      ? await approveAuthorization(authorizationId)
      : await denyAuthorization(authorizationId);
    if (decisionError) {
      setBusy(false);
      return setError(decisionError.message);
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      return setError("No redirect returned by the authorization server.");
    }
    window.location.href = target;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md card-jee">
          <CardContent className="pt-8 pb-8 text-center">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Authorization Error</h1>
            <p className="text-muted-foreground">{error}</p>
            <Button className="mt-6 w-full" onClick={() => (window.location.href = "/home")}>
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md card-jee">
          <CardContent className="pt-8 pb-8 text-center">
            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading authorization request…</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const clientName = details.client?.name ?? "an external AI assistant";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-jee">
        <CardHeader className="text-center pb-2">
          <Shield className="w-12 h-12 text-primary mx-auto mb-3" />
          <CardTitle className="text-xl">Connect {clientName}</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {clientName} wants to use JEElytics as you. It can start tests, read your profile, and access your test history.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Start practice tests on your behalf</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Read your profile, XP, and badges</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Review your weak chapters and PYQ papers</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" disabled={busy} onClick={() => decide(false)}>
              Deny
            </Button>
            <Button disabled={busy} onClick={() => decide(true)}>
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
