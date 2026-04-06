import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-3 sm:p-4 animate-fade-in">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl shadow-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Cookie className="h-8 w-8 text-accent shrink-0 hidden sm:block" />
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">🍪 We use cookies</h3>
          <p className="text-xs text-muted-foreground">
            We use cookies and similar technologies to enhance your experience, analyze traffic, and serve personalized ads via Google AdSense. By clicking "Accept All", you consent to our use of cookies.
          </p>
        </div>
        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={decline} className="flex-1 sm:flex-none text-xs">
            Decline
          </Button>
          <Button size="sm" onClick={accept} className="flex-1 sm:flex-none text-xs bg-gradient-to-r from-primary to-primary-glow text-white">
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}
