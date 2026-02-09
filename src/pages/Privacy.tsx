import useSEO from "@/hooks/useSEO";

export default function Privacy() {
  useSEO({
    title: "Privacy Policy | JEElytics - Your Data & Privacy",
    description: "Learn how JEElytics handles your data and privacy. We collect minimal information to deliver personalized JEE practice features.",
    canonical: "https://jeelytics-concept-check-01.lovable.app/privacy"
  });

  return (
    <main className="min-h-screen bg-background">
      <article className="mx-auto max-w-4xl px-4 md:px-8 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last Updated: February 9, 2026</p>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At JEElytics ("we," "our," or "us"), we are committed to protecting your privacy and ensuring transparency about how we collect, use, and safeguard your personal information. This Privacy Policy explains our data practices when you use our JEE preparation platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1. Information We Collect</h2>
            
            <div className="space-y-3">
              <h3 className="text-xl font-medium text-foreground">1.1 Information You Provide</h3>
              <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
                <li><strong>Account Information:</strong> Email address, password (encrypted), and optional profile details when you create an account</li>
                <li><strong>Usage Data:</strong> Quiz attempts, answers submitted, scores, time spent, and progress tracking data</li>
                <li><strong>Preferences:</strong> Theme settings (light/dark mode), subject preferences, and difficulty level selections</li>
                <li><strong>Communications:</strong> Messages sent to our support team or through contact forms</li>
                <li><strong>Payment Information:</strong> When you subscribe to premium, payment processing is handled by Razorpay. We do not store your credit/debit card details. We only receive transaction confirmations and subscription status</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-medium text-foreground">1.2 Information Collected Automatically</h3>
              <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
                <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
                <li><strong>Log Data:</strong> IP address, access times, pages viewed, and referring URLs</li>
                <li><strong>Cookies and Similar Technologies:</strong> Session cookies for authentication and local storage for user preferences</li>
                <li><strong>Analytics Data:</strong> Aggregate usage statistics to improve our services</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">We use the collected information for the following purposes:</p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
              <li><strong>Service Delivery:</strong> To provide, maintain, and improve our quiz platform and personalized learning experience</li>
              <li><strong>Account Management:</strong> To create and manage your account, authenticate your identity, and maintain security</li>
              <li><strong>Performance Tracking:</strong> To track your progress, generate analytics, maintain streaks, and display your quiz history</li>
              <li><strong>AI Question Generation:</strong> To generate personalized questions based on your selected topics and difficulty levels</li>
              <li><strong>Subscription Management:</strong> To process premium subscriptions, verify payments, and manage subscription status</li>
              <li><strong>Communication:</strong> To send service-related notifications, respond to inquiries, and provide customer support</li>
              <li><strong>Platform Improvement:</strong> To analyze usage patterns, identify bugs, and enhance user experience</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">3. Payment Processing and Security</h2>
            <p className="text-muted-foreground leading-relaxed">We take payment security seriously:</p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
              <li><strong>Razorpay Integration:</strong> All payment processing is handled by Razorpay, a PCI-DSS Level 1 compliant payment gateway</li>
              <li><strong>No Card Storage:</strong> We never store your credit card, debit card, or bank account details on our servers</li>
              <li><strong>Transaction Records:</strong> We only store transaction IDs, subscription status, and payment confirmation for record-keeping</li>
              <li><strong>Secure Transmission:</strong> All payment data is transmitted using industry-standard SSL/TLS encryption</li>
              <li><strong>Signature Verification:</strong> We verify all payment responses using HMAC-SHA256 cryptographic signatures</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">4. Data Sharing and Disclosure</h2>
            <p className="text-muted-foreground leading-relaxed">We do not sell your personal information. We may share your data only in the following circumstances:</p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
              <li><strong>Payment Processor:</strong> With Razorpay for processing subscription payments (they have their own privacy policy)</li>
              <li><strong>Service Providers:</strong> With third-party vendors (Supabase for database, authentication services) who assist in operating our platform</li>
              <li><strong>AI Services:</strong> Anonymized question data may be processed by AI services to generate practice questions</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (users will be notified)</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">5. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
              <li>Passwords are encrypted using bcrypt hashing algorithms</li>
              <li>Data transmission is secured using SSL/TLS encryption</li>
              <li>Row-Level Security (RLS) policies ensure users can only access their own data</li>
              <li>Authentication tokens are securely managed using industry-standard protocols</li>
              <li>Payment credentials are never stored on our servers</li>
              <li>Access controls and authentication mechanisms for our systems</li>
              <li>Regular backups to prevent data loss</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">6. Your Rights and Choices</h2>
            <p className="text-muted-foreground leading-relaxed">You have the following rights regarding your personal information:</p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information in your account settings</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data by contacting us</li>
              <li><strong>Data Portability:</strong> Request a copy of your data in a machine-readable format</li>
              <li><strong>Subscription Cancellation:</strong> Cancel your premium subscription at any time through the platform</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications (service-related emails may still be sent)</li>
              <li><strong>Cookie Management:</strong> Control cookies through your browser settings</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              To exercise these rights, please contact us at <a href="mailto:nilayraj712@gmail.com" className="text-primary hover:underline">nilayraj712@gmail.com</a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">7. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Specifically:
            </p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
              <li>Account data is retained while your account is active</li>
              <li>Quiz history and scores are retained to provide analytics and track progress</li>
              <li>Subscription and payment records are retained for accounting and legal compliance purposes</li>
              <li>After account deletion, personal data is removed within 30 days, except where retention is required by law</li>
              <li>Anonymized analytics data may be retained indefinitely for service improvement</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">8. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our service is intended for students preparing for JEE examinations. While we do not specifically target children under 13, we recognize that some users may be minors. If you are under 18, please obtain parental consent before using our platform and making any purchases. Parents or guardians may contact us to review, modify, or delete their child's information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">9. Third-Party Links and Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our platform may contain links to third-party websites or integrate third-party services:
            </p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
              <li><strong>Razorpay:</strong> For payment processing (see Razorpay's privacy policy)</li>
              <li><strong>YouTube:</strong> For embedded educational videos (see Google's privacy policy)</li>
              <li><strong>Google AdSense:</strong> For advertisements (see Google's privacy policy)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">10. International Data Transfers</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. We ensure that appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable data protection laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">11. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy periodically to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of significant changes by posting the updated policy on our platform with a revised "Last Updated" date. Your continued use of our services after changes are posted constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">12. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-muted/30 p-6 rounded-lg border border-border">
              <p className="text-muted-foreground"><strong>Email:</strong> <a href="mailto:nilayraj712@gmail.com" className="text-primary hover:underline">nilayraj712@gmail.com</a></p>
              <p className="text-muted-foreground mt-2"><strong>Platform:</strong> JEElytics</p>
              <p className="text-muted-foreground mt-2"><strong>Website:</strong> jeelytics-concept-check-01.lovable.app</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">13. Consent</h2>
            <p className="text-muted-foreground leading-relaxed">
              By using JEElytics, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and disclosure of your information as described herein.
            </p>
          </section>
        </div>

      </article>
    </main>
  );
}
