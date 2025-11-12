import useSEO from "@/hooks/useSEO";
import AdSense from "@/components/AdSense";

export default function Terms() {
  useSEO({
    title: "Terms of Use | JEElytics - Usage Terms & Conditions",
    description: "Terms and conditions for using JEElytics AI-powered JEE practice platform. Educational use guidelines and user responsibilities.",
    canonical: "https://jeelytics-concept-check-01.lovable.app/terms"
  });

  return (
    <main className="min-h-screen bg-background">
      <article className="mx-auto max-w-4xl px-4 md:px-8 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">Terms of Use</h1>
        <p className="text-sm text-muted-foreground mb-8">Last Updated: November 12, 2025</p>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Welcome to JEElytics. These Terms of Use ("Terms") govern your access to and use of our platform, including all content, features, and services offered. By accessing or using JEElytics, you agree to be bound by these Terms. If you do not agree, please do not use our platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By creating an account, accessing our website, or using any of our services, you acknowledge that you have read, understood, and agree to be bound by these Terms, as well as our Privacy Policy and Disclaimer. These Terms apply to all users, including students, educators, and visitors.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              JEElytics is an AI-powered educational platform designed to help students prepare for the Joint Entrance Examination (JEE) through practice quizzes, performance analytics, and personalized study materials. Our services include:
            </p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
              <li>AI-generated and curated multiple-choice questions across Physics, Chemistry, and Mathematics</li>
              <li>Timed quizzes with varying difficulty levels (CBSE, JEE Mains, JEE Advanced)</li>
              <li>Performance tracking, score analytics, and progress reports</li>
              <li>Study streak tracking and motivational features</li>
              <li>Topic-wise practice and concept testing</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">3. User Accounts and Registration</h2>
            
            <div className="space-y-3">
              <h3 className="text-xl font-medium text-foreground">3.1 Account Creation</h3>
              <p className="text-muted-foreground leading-relaxed">
                To access certain features, you must create an account by providing accurate, current, and complete information, including a valid email address and password. You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-medium text-foreground">3.2 Account Responsibilities</h3>
              <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
                <li>You are solely responsible for all activities conducted through your account</li>
                <li>You must immediately notify us of any unauthorized access or security breach</li>
                <li>You may not share your account credentials or allow others to access your account</li>
                <li>You must be at least 13 years old to create an account (users under 18 should obtain parental consent)</li>
                <li>One person may maintain only one account unless explicitly authorized</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-medium text-foreground">3.3 Account Termination</h3>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate your account at our discretion if you violate these Terms, engage in fraudulent activity, or misuse our services. You may delete your account at any time by contacting us at nilayraj712@gmail.com.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">4. Acceptable Use Policy</h2>
            <p className="text-muted-foreground leading-relaxed">You agree to use JEElytics only for lawful purposes and in accordance with these Terms. You shall not:</p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
              <li>Use the platform for any commercial purposes without our explicit written consent</li>
              <li>Attempt to reverse engineer, decompile, or extract source code from our services</li>
              <li>Use automated bots, scrapers, or scripts to access or extract data from the platform</li>
              <li>Interfere with or disrupt the integrity or performance of our services</li>
              <li>Share, distribute, or reproduce quiz questions or proprietary content without authorization</li>
              <li>Upload malicious code, viruses, or any harmful software</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Harass, abuse, or harm other users or our staff</li>
              <li>Violate any applicable laws, regulations, or third-party rights</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">5. Intellectual Property Rights</h2>
            
            <div className="space-y-3">
              <h3 className="text-xl font-medium text-foreground">5.1 Our Content</h3>
              <p className="text-muted-foreground leading-relaxed">
                All content on JEElytics, including but not limited to text, graphics, logos, questions, explanations, software, and design, is the property of JEElytics or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express permission.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-medium text-foreground">5.2 Limited License</h3>
              <p className="text-muted-foreground leading-relaxed">
                We grant you a limited, non-exclusive, non-transferable, revocable license to access and use JEElytics for personal, non-commercial educational purposes only. This license does not include the right to download (except for caching), copy, or distribute content.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-medium text-foreground">5.3 User Content</h3>
              <p className="text-muted-foreground leading-relaxed">
                While we do not claim ownership of your personal data (answers, performance records), you grant us a worldwide, royalty-free license to use anonymized data for analytics, service improvement, and AI training purposes.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">6. Educational Purpose and Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              JEElytics is provided solely for educational and practice purposes. While we strive for accuracy, we make no guarantees regarding:
            </p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
              <li>The accuracy, completeness, or reliability of questions, answers, or explanations</li>
              <li>The suitability of our content for actual JEE examinations</li>
              <li>Your performance on the actual JEE or any other examination</li>
              <li>Admission outcomes or academic success resulting from using our platform</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Our questions are for practice and concept checking. They may not perfectly mirror official JEE patterns or difficulty levels.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">7. Third-Party Services and Advertisements</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our platform may display third-party advertisements (e.g., Google AdSense) and may integrate third-party services. We are not responsible for the content, accuracy, or privacy practices of these third parties. Your interactions with third-party services are governed by their respective terms and policies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">8. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              JEElytics is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied, including but not limited to:
            </p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
              <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
              <li>Guarantees of uninterrupted, secure, or error-free service</li>
              <li>Accuracy or reliability of content, results, or analytics</li>
              <li>Availability at all times or from all locations</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              We do not warrant that the platform will meet your requirements or that defects will be corrected.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">9. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, JEElytics, its owners, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
              <li>Loss of profits, data, or use</li>
              <li>Poor exam performance or admission outcomes</li>
              <li>Costs of procuring substitute services</li>
              <li>Any damages arising from your use or inability to use our services</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Our total liability for any claims related to our services shall not exceed the amount you paid to us in the past 12 months, if any.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">10. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify, defend, and hold harmless JEElytics and its affiliates from any claims, liabilities, damages, losses, costs, or expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
              <li>Your violation of these Terms</li>
              <li>Your misuse of our services</li>
              <li>Your violation of any third-party rights or applicable laws</li>
              <li>Any content or data you submit through our platform</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">11. Modifications to Terms and Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective upon posting on our platform with an updated "Last Updated" date. We may also modify, suspend, or discontinue any aspect of our services without notice. Your continued use of JEElytics after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">12. Governing Law and Dispute Resolution</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles. Any disputes arising from these Terms or your use of our services shall be resolved through binding arbitration in accordance with Indian arbitration laws. You agree to waive any right to a jury trial or to participate in class action lawsuits.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">13. Severability</h2>
            <p className="text-muted-foreground leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">14. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions, concerns, or support regarding these Terms, please contact us:
            </p>
            <div className="bg-muted/30 p-6 rounded-lg border border-border">
              <p className="text-muted-foreground"><strong>Email:</strong> <a href="mailto:nilayraj712@gmail.com" className="text-primary hover:underline">nilayraj712@gmail.com</a></p>
              <p className="text-muted-foreground mt-2"><strong>Platform:</strong> JEElytics</p>
              <p className="text-muted-foreground mt-2"><strong>Website:</strong> jeelytics-concept-check-01.lovable.app</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">15. Acknowledgment</h2>
            <p className="text-muted-foreground leading-relaxed">
              By using JEElytics, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.
            </p>
          </section>
        </div>

        {/* Ad Placement */}
        <div className="mt-16">
          <AdSense 
            slot="5555555555" 
            format="horizontal"
          />
        </div>
      </article>
    </main>
  );
}
