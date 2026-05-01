import { useEffect, useState, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, Sparkles } from "lucide-react";

type Step = {
  selector: string;
  title: string;
  body: string;
  /** if true, scroll target into view before showing */
  scroll?: boolean;
};

const STORAGE_KEY = "jeelytics_welcome_tour_v1";

const STEPS: Step[] = [
  {
    selector: '[data-tour="tab-tests"]',
    title: "📝 Tests",
    body: "Pick a subject, topic, number of questions and difficulty — then start an AI-generated assessment.",
    scroll: true,
  },
  {
    selector: '[data-tour="tab-classes"]',
    title: "🎬 Classes & Notes",
    body: "Watch curated lectures and read PDF notes for every topic. (Premium content unlocked with subscription.)",
  },
  {
    selector: '[data-tour="tab-pyq"]',
    title: "📚 Previous Year Questions",
    body: "Browse JEE Main (2019-2025) and Advanced (2007-2025) past papers.",
  },
  {
    selector: '[data-tour="inbox"]',
    title: "🔔 Inbox",
    body: "Test reminders, streak alerts, weak-subject tips and study suggestions land here.",
  },
  {
    selector: '[data-tour="groups"]',
    title: "👥 Study Groups",
    body: "Chat with other JEE aspirants, share doubts and study together in real time.",
  },
  {
    selector: '[data-tour="theme"]',
    title: "🎨 Theme",
    body: "Toggle between light and dark mode — pick what's easier on your eyes.",
  },
  {
    selector: '[data-tour="profile"]',
    title: "👤 Profile",
    body: "View your stats, manage your subscription, change your avatar and read our blog from About.",
  },
];

function getRect(selector: string): DOMRect | null {
  const el = document.querySelector(selector) as HTMLElement | null;
  if (!el) return null;
  return el.getBoundingClientRect();
}

export default function WelcomeTour() {
  const [active, setActive] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  // Show only once per user, after a short delay so the page mounts.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = window.setTimeout(() => setActive(true), 700);
    return () => window.clearTimeout(t);
  }, []);

  const step = STEPS[stepIdx];

  // Recompute target rect on step change / resize / scroll.
  useLayoutEffect(() => {
    if (!active || !step) return;
    const update = () => setRect(getRect(step.selector));
    if (step.scroll) {
      const el = document.querySelector(step.selector);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    update();
    const t = window.setTimeout(update, 350);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [active, stepIdx, step]);

  if (!active || !step) return null;

  const finish = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setActive(false);
  };

  const next = () => {
    if (stepIdx >= STEPS.length - 1) finish();
    else setStepIdx(stepIdx + 1);
  };

  // Tooltip placement: below target if room, otherwise above.
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const tipWidth = Math.min(320, vw - 24);
  const tipHeight = 170;

  let top = 80;
  let left = 12;
  let placeBelow = true;

  if (rect) {
    placeBelow = rect.bottom + tipHeight + 16 < vh;
    top = placeBelow ? rect.bottom + 12 : Math.max(12, rect.top - tipHeight - 12);
    left = Math.min(
      Math.max(12, rect.left + rect.width / 2 - tipWidth / 2),
      vw - tipWidth - 12
    );
  }

  return (
    <div className="fixed inset-0 z-[100]" aria-live="polite">
      {/* Dim overlay (click skips) */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
        onClick={finish}
      />

      {/* Highlight ring around target */}
      {rect && (
        <div
          className="absolute pointer-events-none rounded-xl ring-4 ring-primary shadow-glow transition-all duration-300"
          style={{
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
          }}
        />
      )}

      {/* Tooltip card */}
      <div
        className="absolute bg-card border border-border rounded-xl shadow-elegant p-4 animate-fade-in"
        style={{ top, left, width: tipWidth }}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">{step.title}</h3>
          </div>
          <button
            onClick={finish}
            aria-label="Skip tour"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {step.body}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {stepIdx + 1} / {STEPS.length}
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={finish}>
              Skip
            </Button>
            <Button size="sm" onClick={next} className="btn-gradient-primary">
              {stepIdx === STEPS.length - 1 ? "Finish" : "Next"}
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
