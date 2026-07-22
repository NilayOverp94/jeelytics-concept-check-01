const PENDING_OAUTH_NEXT_KEY = "jeelytics.pending_oauth_next";

export function getSafeRelativeNext(value: string | null | undefined, fallback = "/home") {
  if (!value) return fallback;
  try {
    const decoded = decodeURIComponent(value);
    return decoded.startsWith("/") && !decoded.startsWith("//") ? decoded : fallback;
  } catch {
    return value.startsWith("/") && !value.startsWith("//") ? value : fallback;
  }
}

export function rememberOAuthNext(next: string) {
  const safeNext = getSafeRelativeNext(next);
  try {
    sessionStorage.setItem(PENDING_OAUTH_NEXT_KEY, safeNext);
  } catch {
    localStorage.setItem(PENDING_OAUTH_NEXT_KEY, safeNext);
  }
}

export function consumeOAuthNext(fallback = "/home") {
  const read = () => {
    try {
      return sessionStorage.getItem(PENDING_OAUTH_NEXT_KEY) ?? localStorage.getItem(PENDING_OAUTH_NEXT_KEY);
    } catch {
      return null;
    }
  };

  const value = read();
  try {
    sessionStorage.removeItem(PENDING_OAUTH_NEXT_KEY);
    localStorage.removeItem(PENDING_OAUTH_NEXT_KEY);
  } catch {
    // Ignore storage cleanup failures.
  }
  return getSafeRelativeNext(value, fallback);
}

export function peekOAuthNext() {
  try {
    return sessionStorage.getItem(PENDING_OAUTH_NEXT_KEY) ?? localStorage.getItem(PENDING_OAUTH_NEXT_KEY);
  } catch {
    return null;
  }
}

export function extractAuthorizationIdFromUrl() {
  const queryParams = new URLSearchParams(window.location.search);
  const fromQuery = queryParams.get("authorization_id");
  if (fromQuery) return fromQuery;

  const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
  const hashParams = new URLSearchParams(hash);
  return hashParams.get("authorization_id") ?? "";
}