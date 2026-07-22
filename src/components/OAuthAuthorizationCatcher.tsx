import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { rememberOAuthNext } from "@/lib/oauthRedirect";

/**
 * When Supabase's OAuth 2.1 server sends an unauthenticated user to the
 * app's Site URL with `?authorization_id=...`, forward them to the consent
 * route so the authorization flow can complete.
 */
export default function OAuthAuthorizationCatcher() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/.lovable/oauth/consent") return;
    const params = new URLSearchParams(location.search);
    const authorizationId = params.get("authorization_id");
    if (!authorizationId) return;
    const target = `/.lovable/oauth/consent?authorization_id=${encodeURIComponent(authorizationId)}`;
    rememberOAuthNext(target);
    navigate(target, { replace: true });
  }, [location.pathname, location.search, navigate]);

  return null;
}
