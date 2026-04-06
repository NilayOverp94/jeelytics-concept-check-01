import { Link } from "react-router-dom";

const year = new Date().getFullYear();

export default function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">JEElytics</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Free AI-powered JEE preparation. Practice tests, video lectures, PYQ papers, and more.
            </p>
          </section>

          <nav aria-label="Quick links">
            <h3 className="text-sm font-semibold text-foreground">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link className="hover:text-foreground transition-colors" to="/">Home</Link></li>
              <li><Link className="hover:text-foreground transition-colors" to="/pricing">Pricing</Link></li>
              <li><Link className="hover:text-foreground transition-colors" to="/about">About Us</Link></li>
              <li><Link className="hover:text-foreground transition-colors" to="/groups">Study Groups</Link></li>
            </ul>
          </nav>

          <nav aria-label="Resources">
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link className="hover:text-foreground transition-colors" to="/about#what-is-jee">What is JEE?</Link></li>
              <li><Link className="hover:text-foreground transition-colors" to="/about#how-to-use">How to Use JEElytics</Link></li>
              <li><Link className="hover:text-foreground transition-colors" to="/about#tips-and-strategy">JEE Strategy</Link></li>
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link className="hover:text-foreground transition-colors" to="/disclaimer">Disclaimer</Link></li>
              <li><Link className="hover:text-foreground transition-colors" to="/privacy">Privacy Policy</Link></li>
              <li><Link className="hover:text-foreground transition-colors" to="/terms">Terms of Use</Link></li>
              <li><Link className="hover:text-foreground transition-colors" to="/refund">Refund Policy</Link></li>
            </ul>
          </nav>

          <section>
            <h3 className="text-sm font-semibold text-foreground">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a className="hover:text-foreground transition-colors" href="mailto:nilayraj712@gmail.com">nilayraj712@gmail.com</a></li>
            </ul>
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">© {year} JEElytics. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">
            Not affiliated with NTA/JEE. For educational practice only.
          </p>
        </div>
      </div>
    </footer>
  );
}
