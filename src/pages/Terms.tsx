import useSEO from "@/hooks/useSEO";
import AdSense from "@/components/AdSense";

export default function Terms() {
  useSEO({
    title: "Terms of Use | JEElytics - Usage Terms & Conditions",
    description: "Terms and conditions for using JEElytics AI-powered JEE practice platform. Educational use guidelines and user responsibilities.",
    canonical: "https://jeelytics-concept-check-01.lovable.app/terms"
  });

  return (
    <main className="min-h-[60vh] bg-background">
      <article className="mx-auto max-w-3xl px-4 md:px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">Terms of Use</h1>
        <p className="mt-4 text-muted-foreground">
          By using JEE Prep, you agree to follow these terms to ensure a safe and fair experience for all users.
        </p>
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-medium text-foreground">Usage</h2>
          <ul className="list-disc ml-6 text-muted-foreground space-y-2">
            <li>Use the app for personal, non-commercial educational purposes only.</li>
            <li>Do not attempt to abuse or reverse engineer the service.</li>
            <li>Content is provided "as is" without warranties.</li>
          </ul>
        </section>
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-medium text-foreground">Liability</h2>
          <p className="text-muted-foreground">
            We are not liable for any outcomes arising from the use of this app, including exam performance.
          </p>
        </section>

        {/* Ad Placement */}
        <div className="mt-12">
          <AdSense 
            slot="5555555555" 
            format="horizontal"
          />
        </div>
      </article>
    </main>
  );
}
