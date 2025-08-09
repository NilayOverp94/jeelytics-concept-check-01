import useSEO from "@/hooks/useSEO";

export default function Privacy() {
  useSEO({
    title: "Privacy Policy | JEE Prep",
    description: "Learn how JEE Prep handles your data and privacy.",
  });

  return (
    <main className="min-h-[60vh] bg-background">
      <article className="mx-auto max-w-3xl px-4 md:px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">
          We respect your privacy. We collect minimal information required to deliver features like login, quizzes, results, and streaks.
        </p>
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-medium text-foreground">What We Collect</h2>
          <ul className="list-disc ml-6 text-muted-foreground space-y-2">
            <li>Account information (email) for authentication.</li>
            <li>Quiz attempts and scores to show analytics.</li>
            <li>Theme preferences and app settings.</li>
          </ul>
        </section>
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-medium text-foreground">Your Choices</h2>
          <ul className="list-disc ml-6 text-muted-foreground space-y-2">
            <li>You can request deletion of your account and associated data.</li>
            <li>You can choose light/dark themes and opt out of non-essential features.</li>
          </ul>
        </section>
      </article>
    </main>
  );
}
