import useSEO from "@/hooks/useSEO";
import AdSense from "@/components/AdSense";

export default function Disclaimer() {
  useSEO({
    title: "Disclaimer | JEElytics - Independent JEE Practice Platform",
    description: "JEElytics is an independent educational practice platform. Not affiliated with NTA or JEE organizing bodies. Read our disclaimer.",
    canonical: "https://jeelytics-concept-check-01.lovable.app/disclaimer"
  });

  return (
    <main className="min-h-screen bg-background">
      <article className="mx-auto max-w-4xl px-4 md:px-8 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">Disclaimer</h1>
        <p className="text-sm text-muted-foreground mb-8">Last Updated: November 12, 2025</p>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This disclaimer applies to your use of JEElytics and outlines important information regarding the nature of our services, limitations, and your responsibilities as a user. Please read this carefully before using our platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1. No Official Affiliation</h2>
            <p className="text-muted-foreground leading-relaxed">
              JEElytics is an independent educational practice platform created to help students prepare for the Joint Entrance Examination (JEE). We are <strong>NOT</strong> affiliated with, endorsed by, sponsored by, or in any way officially connected with:
            </p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
              <li>National Testing Agency (NTA)</li>
              <li>Joint Entrance Examination (JEE) organizing authorities</li>
              <li>Indian Institutes of Technology (IITs)</li>
              <li>National Institutes of Technology (NITs)</li>
              <li>Indian Institutes of Information Technology (IIITs)</li>
              <li>Any other government body or educational institution conducting JEE examinations</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Any reference to "JEE," "JEE Main," "JEE Advanced," or related terms is made solely for descriptive and educational purposes to indicate the nature of our content.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2. Educational Purpose Only</h2>
            <p className="text-muted-foreground leading-relaxed">
              JEElytics is designed exclusively for educational and practice purposes. The questions, quizzes, explanations, and study materials provided on our platform are intended to:
            </p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
              <li>Help students practice concepts in Physics, Chemistry, and Mathematics</li>
              <li>Provide a simulated quiz-taking experience</li>
              <li>Track progress and identify areas for improvement</li>
              <li>Offer supplementary learning resources</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Our content should be used as a <strong>supplement</strong> to your regular studies, not as a replacement for comprehensive JEE preparation through textbooks, coaching, and official materials.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">3. No Guarantee of Accuracy</h2>
            <p className="text-muted-foreground leading-relaxed">
              While we make reasonable efforts to ensure the accuracy and quality of our content, including AI-generated questions:
            </p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
              <li><strong>Questions may contain errors:</strong> We do not guarantee that all questions, answers, explanations, or solutions are free from mistakes or perfectly aligned with JEE exam standards</li>
              <li><strong>Content may be outdated:</strong> JEE syllabus, patterns, and difficulty levels may change. Our content may not always reflect the latest official guidelines</li>
              <li><strong>AI-generated content:</strong> Some questions are generated using artificial intelligence, which may produce variations in quality, accuracy, or relevance</li>
              <li><strong>No official endorsement:</strong> Our questions do not represent official JEE exam questions and have not been verified by NTA or IITs</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>Users are encouraged to cross-verify information with official JEE resources, textbooks, and qualified educators.</strong>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">4. No Guarantee of Exam Performance</h2>
            <p className="text-muted-foreground leading-relaxed">
              We make no representations, warranties, or guarantees that:
            </p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
              <li>Using JEElytics will improve your JEE exam scores or percentile</li>
              <li>You will gain admission to any educational institution based on your performance on our platform</li>
              <li>Our scoring, analytics, or difficulty ratings accurately predict your actual JEE performance</li>
              <li>Practicing on our platform will prepare you comprehensively for the JEE examination</li>
              <li>Our content coverage matches the official JEE syllabus completely</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>Your actual JEE performance depends on multiple factors including your overall preparation, understanding of concepts, exam strategy, and day-of-exam conditions—factors beyond the scope of this platform.</strong>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">5. Service Availability and Reliability</h2>
            <p className="text-muted-foreground leading-relaxed">
              JEElytics is provided on an "as is" and "as available" basis:
            </p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
              <li><strong>No uptime guarantee:</strong> We do not guarantee uninterrupted, timely, secure, or error-free service</li>
              <li><strong>Technical issues:</strong> The platform may experience downtime, server errors, bugs, or performance issues</li>
              <li><strong>Data loss:</strong> While we implement safeguards, we are not liable for loss of quiz data, scores, or user progress due to technical failures</li>
              <li><strong>Changes to service:</strong> We may modify, suspend, or discontinue features without prior notice</li>
              <li><strong>AI service limitations:</strong> AI-generated question features depend on third-party services and may be subject to availability, rate limits, or quality variations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">6. Third-Party Content and Links</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our platform may contain:
            </p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
              <li><strong>Third-party advertisements:</strong> We display ads through services like Google AdSense. We are not responsible for the content, accuracy, or practices of advertisers</li>
              <li><strong>External links:</strong> Links to external websites are provided for convenience only. We do not endorse or control third-party sites and are not liable for their content or services</li>
              <li><strong>Third-party services:</strong> We integrate services like Supabase for database and authentication. We are not liable for failures or security issues in third-party services</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Your interactions with third parties are solely between you and that third party, governed by their terms and policies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">7. User Responsibility</h2>
            <p className="text-muted-foreground leading-relaxed">
              By using JEElytics, you acknowledge and accept that:
            </p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
              <li>You use the platform at your own risk</li>
              <li>You are responsible for verifying the accuracy of content</li>
              <li>You should consult official JEE resources, educators, and textbooks for comprehensive preparation</li>
              <li>You understand that our platform is a practice tool, not a substitute for formal education</li>
              <li>You will not rely solely on JEElytics for JEE preparation</li>
              <li>You are responsible for managing your study time and not using our platform as a distraction</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">8. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, JEElytics, its creators, owners, employees, and affiliates shall not be liable for:
            </p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
              <li>Any direct, indirect, incidental, special, consequential, or punitive damages</li>
              <li>Poor performance on JEE or any other examination</li>
              <li>Admission outcomes or rejection from educational institutions</li>
              <li>Loss of time, opportunity, or tuition costs</li>
              <li>Reliance on inaccurate or outdated content</li>
              <li>Technical failures, data loss, or service interruptions</li>
              <li>Emotional distress or disappointment arising from use of our services</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>You use JEElytics entirely at your own risk and discretion.</strong>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">9. Medical and Mental Health Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              Exam preparation can be stressful. JEElytics is not a substitute for professional medical, psychological, or counseling services. If you experience:
            </p>
            <ul className="list-disc ml-6 text-muted-foreground space-y-2 leading-relaxed">
              <li>Severe stress, anxiety, or depression related to exam preparation</li>
              <li>Mental health challenges affecting your well-being</li>
              <li>Academic burnout or excessive pressure</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong>Please seek help from qualified mental health professionals, counselors, or trusted adults. Your well-being is more important than any examination.</strong>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">10. No Professional Advice</h2>
            <p className="text-muted-foreground leading-relaxed">
              JEElytics does not provide professional educational counseling, career guidance, or college admission advice. Any information provided is for general educational purposes only and should not be construed as personalized advice. For college admissions, career planning, or educational guidance, consult qualified counselors or educational institutions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">11. Intellectual Property Notice</h2>
            <p className="text-muted-foreground leading-relaxed">
              All trademarks, logos, and brand names mentioned on JEElytics are the property of their respective owners. The mention of "JEE," "IIT," "NIT," or other institutional names is for descriptive purposes only and does not imply endorsement, affiliation, or sponsorship.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">12. Changes to This Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to update this Disclaimer at any time without prior notice. Changes will be effective upon posting with an updated "Last Updated" date. Your continued use of JEElytics after changes constitutes acceptance of the updated Disclaimer.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">13. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions, concerns, or need clarification regarding this Disclaimer, please contact us:
            </p>
            <div className="bg-muted/30 p-6 rounded-lg border border-border">
              <p className="text-muted-foreground"><strong>Email:</strong> <a href="mailto:nilayraj712@gmail.com" className="text-primary hover:underline">nilayraj712@gmail.com</a></p>
              <p className="text-muted-foreground mt-2"><strong>Platform:</strong> JEElytics</p>
              <p className="text-muted-foreground mt-2"><strong>Website:</strong> jeelytics-concept-check-01.lovable.app</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">14. Acknowledgment and Agreement</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using JEElytics, you acknowledge that you have read, understood, and agree to this Disclaimer in its entirety. You accept all risks associated with using our platform and agree to hold JEElytics harmless for any outcomes related to your use of our services.
            </p>
          </section>
        </div>

        {/* Ad Placement */}
        <div className="mt-16">
          <AdSense 
            slot="3333333333" 
            format="horizontal"
          />
        </div>
      </article>
    </main>
  );
}
