import useSEO from "@/hooks/useSEO";

export default function Disclaimer() {
  useSEO({
    title: "Disclaimer | JEElytics - Independent JEE Practice Platform",
    description: "JEElytics is an independent educational practice platform. Not affiliated with NTA or JEE organizing bodies. Read our disclaimer.",
    canonical: "https://jeelytics.lovable.app/disclaimer"
  });

  return (
    <main className="min-h-[60vh] bg-background">
      <article className="mx-auto max-w-3xl px-4 md:px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">Disclaimer</h1>
        <p className="mt-4 text-muted-foreground">
          JEE Prep is an independent educational practice platform. We are not affiliated with, endorsed by, or connected to the National Testing Agency (NTA) or the Joint Entrance Examination (JEE) organizing bodies.
        </p>
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-medium text-foreground">Important Notes</h2>
          <ul className="list-disc ml-6 text-muted-foreground space-y-2">
            <li>Questions are for practice and learning. They may not reflect official exam questions.</li>
            <li>Scoring and analytics are indicative to help track progress.</li>
            <li>We do not guarantee admission outcomes or exam results.</li>
          </ul>
        </section>
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-medium text-foreground">Contact</h2>
          <p className="text-muted-foreground">
            For any concerns, reach us at <a className="underline hover:text-foreground" href="mailto:nilayraj712@gmail.com">nilayraj712@gmail.com</a>.
          </p>
        </section>
      </article>
    </main>
  );
}
