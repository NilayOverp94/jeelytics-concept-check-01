import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useSEO from '@/hooks/useSEO';

export default function Refund() {
  useSEO({
    title: "Refund Policy | JEElytics",
    description: "JEElytics refund policy. No refunds after usage. Refunds only for technical errors.",
    canonical: "https://jeelytics-concept-check-01.lovable.app/refund"
  });

  return (
    <div className="min-h-screen bg-background pt-safe">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/home">
              <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
            </Link>
            <h1 className="text-xl font-bold text-gradient-primary">Refund Policy</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl prose dark:prose-invert">
        <h2>Refund Policy</h2>
        <p className="text-muted-foreground"><em>Last updated: April 2026</em></p>

        <h3>1. No Refund After Usage</h3>
        <p>Once a premium subscription has been activated and any premium features have been accessed (including unlimited tests, PYQ papers, or lecture notes), <strong>no refund will be provided</strong>. By purchasing, you acknowledge that you have reviewed the features and agree to the pricing.</p>

        <h3>2. Refund for Technical Errors Only</h3>
        <p>Refunds are only issued in the following cases:</p>
        <ul>
          <li><strong>Double/duplicate charges</strong> — If you were charged more than once for the same subscription</li>
          <li><strong>Payment processing errors</strong> — If payment was deducted but subscription was not activated</li>
          <li><strong>System failure</strong> — If a verified technical issue on our end prevented you from accessing premium features</li>
        </ul>

        <h3>3. How to Request a Refund</h3>
        <p>To request a refund for eligible cases, email us at <a href="mailto:nilayraj712@gmail.com" className="text-primary hover:underline">nilayraj712@gmail.com</a> with:</p>
        <ul>
          <li>Your registered email address</li>
          <li>Transaction/order ID from Razorpay</li>
          <li>Description of the issue</li>
          <li>Screenshots (if applicable)</li>
        </ul>

        <h3>4. Processing Time</h3>
        <p>Eligible refunds will be processed within <strong>7-10 business days</strong> and credited back to the original payment method.</p>

        <h3>5. Subscription Cancellation</h3>
        <p>You may choose not to renew your subscription at any time. Your premium access will continue until the current billing period ends. No partial refunds are provided for unused time within an active subscription period.</p>

        <h3>6. Contact Us</h3>
        <p>For any questions about this refund policy, please contact us at <a href="mailto:nilayraj712@gmail.com" className="text-primary hover:underline">nilayraj712@gmail.com</a>.</p>
      </div>
    </div>
  );
}
