import { Link } from "react-router-dom";

const year = new Date().getFullYear();

export default function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">JEE Prep</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Practice JEE-style questions in Physics, Chemistry, and Mathematics. Track your progress, build streaks, and improve consistently.
            </p>
          </section>

          <nav aria-label="Quick links">
            <h3 className="text-sm font-semibold text-foreground">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link className="hover:text-foreground transition-colors" to="/">Home</Link>
              </li>
              <li>
                <Link className="hover:text-foreground transition-colors" to="/quiz">Quiz</Link>
              </li>
              <li>
                <Link className="hover:text-foreground transition-colors" to="/results">Results</Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link className="hover:text-foreground transition-colors" to="/disclaimer">Disclaimer</Link>
              </li>
              <li>
                <Link className="hover:text-foreground transition-colors" to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link className="hover:text-foreground transition-colors" to="/terms">Terms of Use</Link>
              </li>
            </ul>
          </nav>

          <section>
            <h3 className="text-sm font-semibold text-foreground">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a className="hover:text-foreground transition-colors" href="mailto:support@jeeprep.example">support@jeeprep.example</a>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">© {year} JEE Prep. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">
            Disclaimer: This app is for educational practice only and is not affiliated with NTA/JEE. Questions are illustrative and may not reflect the actual exam.
          </p>
        </div>
      </div>
    </footer>
  );
}
