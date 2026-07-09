import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const cache = new Map<string, { url: string; expires: number }>();

/**
 * Resolve a chat-media reference (either a legacy public URL or `storage://chat-media/<path>`)
 * to a short-lived signed URL. Bucket is private.
 */
async function resolveSignedUrl(ref: string): Promise<string | null> {
  let path: string | null = null;
  if (ref.startsWith('storage://chat-media/')) {
    path = ref.slice('storage://chat-media/'.length);
  } else {
    const marker = '/chat-media/';
    const idx = ref.indexOf(marker);
    if (idx >= 0) path = ref.slice(idx + marker.length);
  }
  if (!path) return null;

  const cached = cache.get(path);
  if (cached && cached.expires > Date.now() + 30_000) return cached.url;

  const { data, error } = await supabase.storage.from('chat-media').createSignedUrl(path, 3600);
  if (error || !data) return null;
  cache.set(path, { url: data.signedUrl, expires: Date.now() + 3600_000 });
  return data.signedUrl;
}

export function useSignedChatUrl(ref: string) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    resolveSignedUrl(ref).then(u => { if (alive) setUrl(u); });
    return () => { alive = false; };
  }, [ref]);
  return url;
}

export function ChatImage({ src }: { src: string }) {
  const url = useSignedChatUrl(src);
  if (!url) return <div className="rounded-md bg-muted h-32 w-32 animate-pulse" />;
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <img src={url} alt="shared" className="rounded-md max-w-[220px] max-h-[260px] object-cover" />
    </a>
  );
}

export function ChatAudio({ src }: { src: string }) {
  const url = useSignedChatUrl(src);
  if (!url) return <div className="h-8 w-[220px] bg-muted rounded animate-pulse" />;
  return <audio controls src={url} className="max-w-[220px]" />;
}

export function ChatFileLink({ src, name, className }: { src: string; name?: string; className?: string }) {
  const url = useSignedChatUrl(src);
  if (!url) return <span className={className}>📎 loading…</span>;
  return <a href={url} target="_blank" rel="noreferrer" className={className}>📎 {name || 'file'}</a>;
}
