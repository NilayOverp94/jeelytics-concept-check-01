import { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function FeedbackButton() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim() || !user) return;
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-feedback', {
        body: { message: message.trim(), phone: phone.trim() || null }
      });
      if (error) throw error;
      toast({ title: "Feedback sent! ✅", description: "Thanks for your feedback. We'll look into it." });
      setMessage('');
      setPhone('');
      setOpen(false);
    } catch {
      toast({ title: "Error", description: "Failed to send feedback. Try again.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Floating button - rectangle, positioned to cover "Edit with Lovable" badge */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-2 right-2 z-[9999] h-8 px-3 rounded-md bg-primary text-primary-foreground shadow-lg flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity text-xs font-medium"
        aria-label="Send feedback"
      >
        {open ? <X className="h-3.5 w-3.5" /> : <MessageSquare className="h-3.5 w-3.5" />}
        {!open && <span>Report</span>}
      </button>

      {/* Feedback form */}
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-80 bg-card border border-border rounded-xl shadow-2xl p-4 animate-fade-in">
          <h3 className="font-semibold text-sm mb-3">Report a Problem</h3>
          <Textarea
            placeholder="Describe the issue..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mb-2 text-sm min-h-[80px]"
            maxLength={5000}
          />
          <Input
            placeholder="Phone number (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mb-3 text-sm"
            maxLength={15}
          />
          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || sending}
            className="w-full"
            size="sm"
          >
            <Send className="h-3.5 w-3.5 mr-1.5" />
            {sending ? 'Sending...' : 'Submit'}
          </Button>
        </div>
      )}
    </>
  );
}
