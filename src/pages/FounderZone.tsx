import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import founderPhoto from "@/assets/nilay-raj.webp.asset.json";
import {
  ArrowRight, Github, Linkedin, Mail, ExternalLink, Sparkles, Rocket,
  Brain, Shield, Code2, GraduationCap, Building2, Target, Trophy,
  BookOpen, Zap, Globe, ChevronDown, Cpu, Database, Cloud, Palette,
} from "lucide-react";

const LINKS = {
  portfolio: "https://nilayraj.netlify.app/",
  jeelytics: "https://jeelytics-concept-check-01.lovable.app/",
  safelens: "https://safelens-ai.lovable.app/",
  percentagepro: "https://nilayoverp94.github.io/PercentagePro/",
  github: "https://github.com/NilayOverp94",
  linkedin: "https://www.linkedin.com/in/not-nilay-rv/",
  medium: "https://medium.com/@nilay_raj",
  devto: "https://dev.to/nilay_raj",
  hashnode: "https://hashnode.com/@NilayOverp94",
  email: "mailto:nilayraj713@gmail.com",
};

const SITE_URL = "https://jeelytics-concept-check-01.lovable.app";
const founderImageAlt = "Nilay Raj, founder of JEElytics and AI engineer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
};

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className={`relative py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto ${className}`}
    >
      {children}
    </motion.section>
  );
}

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-2xl border border-primary/15 bg-card/70 backdrop-blur-xl shadow-card ${className}`}>
      {children}
    </div>
  );
}

function Counter({ end, label, suffix = "" }: { end: number; label: string; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const dur = 1600;
    const id = requestAnimationFrame(function tick() {
      const p = Math.min(1, (Date.now() - start) / dur);
      setN(Math.floor(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(id);
  }, [end]);
  return (
    <GlassCard className="p-6 text-center">
      <div className="text-3xl md:text-4xl font-bold text-gradient-primary">
        {n}{suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-2">{label}</div>
    </GlassCard>
  );
}

export default function FounderZone() {
  useEffect(() => {
    document.title = "Nilay Raj | JEElytics Founder & AI Engineer";
    const meta = (name: string, content: string, isProp = false) => {
      const attr = isProp ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.content = content;
    };
    const desc = "Nilay Raj is the founder of JEElytics, SafeLens AI builder, AI engineer, full-stack developer, and EdTech startup creator from New Delhi, India.";
    const founderImageUrl = new URL(founderPhoto.url, window.location.origin).href;
    meta("description", desc);
    meta("keywords", "Nilay Raj, Nilay Raj JEElytics, JEElytics founder, SafeLens AI, NilayOverp94, Apyx, Bosscoder School of Technology, AI Engineer, Full Stack Developer, EdTech founder, New Delhi");
    meta("author", "Nilay Raj");
    meta("robots", "index, follow, max-image-preview:large");
    meta("og:title", "Nilay Raj — JEElytics Founder", true);
    meta("og:description", desc, true);
    meta("og:type", "profile", true);
    meta("og:url", `${SITE_URL}/founder`, true);
    meta("twitter:card", "summary_large_image");
    meta("twitter:title", "Nilay Raj — Founder of JEElytics");
    meta("twitter:description", desc);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = `${SITE_URL}/founder`;

    const ldId = "founder-jsonld";
    let ld = document.getElementById(ldId) as HTMLScriptElement | null;
    if (!ld) { ld = document.createElement("script"); ld.id = ldId; ld.type = "application/ld+json"; document.head.appendChild(ld); }
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          name: "Nilay Raj",
          alternateName: ["NilayOverp94", "Nilay Raj JEElytics"],
          url: `${SITE_URL}/founder`,
          image: founderImageUrl,
          mainEntityOfPage: `${SITE_URL}/founder`,
          jobTitle: "Founder & AI Engineer",
          description: desc,
          worksFor: [
            { "@type": "Organization", name: "JEElytics", url: LINKS.jeelytics },
            { "@type": "Organization", name: "SafeLens AI", url: LINKS.safelens },
            { "@type": "Organization", name: "Apyx" },
          ],
          alumniOf: { "@type": "EducationalOrganization", name: "Bosscoder School of Technology" },
          address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressCountry: "India" },
          nationality: "Indian",
          knowsAbout: ["Artificial Intelligence", "Generative AI", "LLMs", "MCP", "Full Stack Development", "EdTech", "Cybersecurity", "SEO"],
          sameAs: [LINKS.github, LINKS.linkedin, LINKS.medium, LINKS.devto, LINKS.hashnode, LINKS.portfolio, LINKS.jeelytics, LINKS.safelens],
        },
        { "@type": "WebSite", name: "JEElytics", url: LINKS.jeelytics, founder: { "@type": "Person", name: "Nilay Raj" } },
        { "@type": "ProfilePage", name: "Nilay Raj Founder Zone", url: `${SITE_URL}/founder`, mainEntity: { "@type": "Person", name: "Nilay Raj", image: founderImageUrl } },
        { "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Nilay Raj Founder Zone", item: `${SITE_URL}/founder` },
        ]},
      ],
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Ambient gradient bg */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/15 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-primary-glow/10 blur-[120px]" />
      </div>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <Badge variant="outline" className="mb-4 backdrop-blur-md">
              <Sparkles className="w-3 h-3 mr-1" /> Founder Zone
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
              Nilay <span className="text-gradient-primary">Raj</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-2">
              Founder of JEElytics · AI Engineer · Full Stack Developer
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              EdTech Innovator · Startup Builder · Cybersecurity Enthusiast · New Delhi, India
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="group">
                <a href="#projects">View Projects <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" /></a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={LINKS.portfolio} target="_blank" rel="noopener noreferrer">Portfolio <ExternalLink className="w-4 h-4 ml-1" /></a>
              </Button>
              <Button asChild size="lg" variant="ghost"><a href={LINKS.github} target="_blank" rel="noopener noreferrer"><Github className="w-4 h-4" /></a></Button>
              <Button asChild size="lg" variant="ghost"><a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="w-4 h-4" /></a></Button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary to-primary-glow blur-2xl opacity-30 animate-pulse" />
              <GlassCard className="relative h-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/25 to-transparent" />
                <div className="relative text-center p-8">
                  <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto rounded-full p-1 bg-gradient-to-br from-primary to-primary-glow mb-5 shadow-glow">
                    <img
                      src={founderPhoto.url}
                      alt={founderImageAlt}
                      title="Nilay Raj - Founder of JEElytics"
                      width="208"
                      height="208"
                      loading="eager"
                      fetchPriority="high"
                      className="h-full w-full rounded-full object-cover object-[50%_18%] border-4 border-background"
                    />
                  </div>
                  <div className="text-xl font-semibold">Nilay Raj</div>
                  <div className="text-sm text-muted-foreground">Founder of JEElytics · AI Builder · Developer</div>
                  <div className="flex justify-center gap-2 mt-4 flex-wrap">
                    <Badge>AI</Badge><Badge>EdTech</Badge><Badge>Startup</Badge><Badge>Security</Badge>
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        </div>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground">
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* ABOUT */}
      <Section id="about">
        <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-4 text-center">About</motion.h2>
        <motion.p variants={fadeUp} className="text-lg text-muted-foreground max-w-3xl mx-auto text-center mb-12">
          I'm a student developer who loves turning ideas into real, shipped products. My work sits at the intersection of Artificial Intelligence and pragmatic software engineering — I build platforms that solve genuine problems, not toy prototypes. I believe technology should simplify lives and make quality education accessible to everyone.
        </motion.p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Rocket, title: "Founder", desc: "JEElytics & SafeLens AI" },
            { icon: Brain, title: "AI Engineer", desc: "LLMs, Agents, MCP" },
            { icon: Code2, title: "Full Stack Dev", desc: "React, TS, Supabase" },
            { icon: Building2, title: "Business Dev", desc: "Head of BD at Apyx" },
            { icon: GraduationCap, title: "Student", desc: "Bosscoder School of Tech" },
            { icon: Shield, title: "Security", desc: "Cyber safety enthusiast" },
            { icon: Target, title: "SEO", desc: "Entity & technical SEO" },
            { icon: Sparkles, title: "Entrepreneur", desc: "Product-first mindset" },
          ].map((c, i) => (
            <motion.div key={i} variants={fadeUp}>
              <GlassCard className="p-6 h-full hover:scale-[1.02] transition-transform">
                <c.icon className="w-8 h-8 text-primary mb-3" />
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm text-muted-foreground">{c.desc}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* FOUNDER STORY / TIMELINE */}
      <Section id="story">
        <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-12 text-center">Founder Story</motion.h2>
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary-glow/40 to-transparent" />
          {[
            { year: "Early", title: "First spark", desc: "Curiosity about how software actually works." },
            { year: "Learning", title: "Programming journey", desc: "JavaScript, TypeScript, React and modern web foundations." },
            { year: "Building", title: "First shipped projects", desc: "Percentage Calculator Pro and personal portfolio." },
            { year: "2025", title: "SafeLens AI", desc: "AI-powered cybersecurity platform for scam and phishing detection." },
            { year: "2025", title: "JEElytics launched", desc: "AI EdTech platform for JEE, BITSAT, CUET, NDA and more." },
            { year: "2025", title: "Head of BD at Apyx", desc: "Client acquisition, growth strategy and startup partnerships." },
            { year: "Now", title: "Bosscoder School of Technology", desc: "Industry-oriented software engineering with modern AI focus." },
            { year: "Next", title: "The future", desc: "Global AI products in education, cybersecurity and productivity." },
          ].map((m, i) => (
            <motion.div key={i} variants={fadeUp} className={`relative mb-8 md:w-1/2 ${i % 2 ? "md:ml-auto md:pl-12" : "md:pr-12"} pl-12 md:pl-12`}>
              <div className="absolute left-2 md:left-auto md:right-full md:mr-[-9px] top-4 w-4 h-4 rounded-full bg-primary shadow-glow" />
              <GlassCard className="p-6">
                <Badge variant="outline" className="mb-2">{m.year}</Badge>
                <div className="text-lg font-semibold">{m.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{m.desc}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* PROJECTS */}
      <Section id="projects">
        <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-4 text-center">Projects</motion.h2>
        <motion.p variants={fadeUp} className="text-center text-muted-foreground mb-12">Shipped products, real users, real impact.</motion.p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              name: "JEElytics", tag: "AI EdTech Platform", url: LINKS.jeelytics,
              desc: "AI-powered platform for JEE, BITSAT, CUET, NDA aspirants — personalized tests, analytics, study groups, MCP server, OAuth 2.1, and voice AI assistant.",
              stack: ["React", "TypeScript", "Supabase", "Gemini", "MCP", "OAuth 2.1"],
              gradient: "from-primary to-primary-glow",
            },
            {
              name: "SafeLens AI", tag: "AI Cybersecurity", url: LINKS.safelens,
              desc: "Detects scams, phishing, and unsafe URLs. Screenshot analyzer, email safety, WhatsApp scam detection with AI explanations.",
              stack: ["React", "AI Vision", "LLMs", "Prompt Engineering"],
              gradient: "from-primary to-secondary",
            },
            {
              name: "Percentage Calculator Pro", tag: "Utility Web App", url: LINKS.percentagepro,
              desc: "Fast, responsive utility with percentage, GST, and profit-loss calculators. Clean educational UI.",
              stack: ["HTML", "CSS", "JS"],
              gradient: "from-primary-glow to-secondary",
            },
            {
              name: "Personal Portfolio", tag: "Developer Hub", url: LINKS.portfolio,
              desc: "Modern developer portfolio showcasing projects, technical skills, achievements and blog.",
              stack: ["React", "TypeScript", "Netlify"],
              gradient: "from-primary to-secondary-glow",
            },
          ].map((p, i) => (
            <motion.div key={i} variants={fadeUp}>
              <GlassCard className="p-6 h-full group hover:scale-[1.01] transition-all">
                <div className={`h-40 rounded-xl mb-4 bg-gradient-to-br ${p.gradient} relative overflow-hidden flex items-center justify-center`}>
                  <div className="text-3xl font-bold text-primary-foreground/90 text-center px-4">{p.name}</div>
                  <div className="absolute inset-0 bg-background/10 group-hover:bg-background/0 transition-colors" />
                </div>
                <Badge variant="secondary" className="mb-2">{p.tag}</Badge>
                <div className="text-xl font-semibold mb-2">{p.name}</div>
                <p className="text-sm text-muted-foreground mb-4">{p.desc}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {p.stack.map((s) => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                </div>
                <Button asChild size="sm" variant="outline" className="w-full">
                  <a href={p.url} target="_blank" rel="noopener noreferrer">Live Demo <ExternalLink className="w-3 h-3 ml-1" /></a>
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* TECH STACK */}
      <Section id="stack">
        <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-12 text-center">Tech Stack</motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Code2, title: "Frontend", items: ["React", "TypeScript", "Tailwind", "HTML/CSS"] },
            { icon: Database, title: "Backend", items: ["Supabase", "Postgres", "REST APIs", "RLS"] },
            { icon: Brain, title: "AI", items: ["Gemini", "LLMs", "MCP", "Agents"] },
            { icon: Cloud, title: "Deploy", items: ["Netlify", "Lovable", "GitHub"] },
            { icon: Shield, title: "Security", items: ["OAuth 2.1", "JWT", "RLS", "DOMPurify"] },
            { icon: Cpu, title: "Automation", items: ["pg_cron", "Edge Fns", "Webhooks"] },
            { icon: Palette, title: "Design", items: ["Figma", "shadcn/ui", "Framer Motion"] },
            { icon: Target, title: "Perf & SEO", items: ["Core Web Vitals", "JSON-LD", "Sitemaps"] },
          ].map((c, i) => (
            <motion.div key={i} variants={fadeUp}>
              <GlassCard className="p-5 h-full">
                <c.icon className="w-6 h-6 text-primary mb-3" />
                <div className="font-semibold mb-2">{c.title}</div>
                <div className="flex flex-wrap gap-1">
                  {c.items.map((it) => <Badge key={it} variant="secondary" className="text-xs">{it}</Badge>)}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* AI NATIVE */}
      <Section id="ai">
        <motion.div variants={fadeUp}>
          <GlassCard className="p-8 md:p-12">
            <Badge className="mb-4">AI Native Development</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Building for the AI era</h2>
            <p className="text-muted-foreground max-w-3xl mb-6">
              JEElytics ships a production MCP server so ChatGPT, Claude and any MCP-compatible assistant can start practice tests, read student progress, and identify weak chapters via standardized tools — with OAuth 2.1 flowing per user, not shared keys. This is what an AI-native product looks like: LLMs, agents, and Generative AI wired into a real product architecture.
            </p>
            <div className="flex flex-wrap gap-2">
              {["MCP", "OAuth 2.1", "Gemini", "ChatGPT", "Claude", "AI Agents", "Prompt Engineering", "Generative AI"].map((t) =>
                <Badge key={t} variant="outline">{t}</Badge>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </Section>

      {/* BUSINESS + EDUCATION */}
      <Section id="experience">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div variants={fadeUp}>
            <GlassCard className="p-6 h-full">
              <Building2 className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-2xl font-bold mb-2">Head of Business Development</h3>
              <div className="text-sm text-muted-foreground mb-4">Apyx</div>
              <ul className="text-sm space-y-2 text-muted-foreground list-disc pl-4">
                <li>Client acquisition and long-term partnerships</li>
                <li>Startup strategy and growth planning</li>
                <li>Digital marketing and technology consulting</li>
                <li>Working directly with founders across the startup ecosystem</li>
              </ul>
            </GlassCard>
          </motion.div>
          <motion.div variants={fadeUp}>
            <GlassCard className="p-6 h-full">
              <GraduationCap className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-2xl font-bold mb-2">Education</h3>
              <div className="space-y-4 mt-4">
                <div>
                  <div className="font-semibold">Bosscoder School of Technology</div>
                  <div className="text-sm text-muted-foreground">Bengaluru — Industry-oriented software engineering with strong focus on practical development, modern technologies and AI.</div>
                </div>
                <div>
                  <div className="font-semibold">CBSE School Education</div>
                  <div className="text-sm text-muted-foreground">Foundation in mathematics, physics and computer science.</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </Section>

      {/* ACHIEVEMENTS */}
      <Section id="achievements">
        <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-12 text-center">Achievements</motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Rocket, title: "Shipped Products", desc: "Multiple production apps live" },
            { icon: Brain, title: "AI Native Build", desc: "MCP + OAuth 2.1 in production" },
            { icon: Trophy, title: "Startup Leadership", desc: "Head of BD role at Apyx" },
            { icon: Zap, title: "Fast Execution", desc: "Idea → live product cycles" },
            { icon: Shield, title: "Security-first", desc: "RLS, OAuth, hardened auth" },
            { icon: Globe, title: "SEO Optimized", desc: "Entity SEO + structured data" },
            { icon: BookOpen, title: "Writing", desc: "Medium, Dev.to, Hashnode" },
            { icon: Code2, title: "Open Source", desc: "GitHub contributions" },
          ].map((a, i) => (
            <motion.div key={i} variants={fadeUp}>
              <GlassCard className="p-5 text-center hover:scale-[1.03] transition-transform">
                <a.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="font-semibold">{a.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{a.desc}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* STATS */}
      <Section id="stats">
        <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-12 text-center">By the Numbers</motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Counter end={4} suffix="+" label="Projects shipped" />
          <Counter end={20} suffix="+" label="Technologies" />
          <Counter end={1000} suffix="+" label="Learning hours" />
          <Counter end={50000} suffix="+" label="Lines of code" />
        </div>
      </Section>

      {/* MISSION */}
      <Section id="mission">
        <motion.div variants={fadeUp}>
          <GlassCard className="p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary-glow/10 to-background" />
            <div className="relative">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Building Technology That Matters</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                To build AI-powered products that make education more personalized, accessible and effective — while solving meaningful real-world problems through technology. Every product should be simple, scalable, accessible, beautiful, reliable and useful.
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </Section>

      {/* ROADMAP */}
      <Section id="roadmap">
        <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-12 text-center">Roadmap</motion.h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: "Now", title: "JEElytics", desc: "Scaling AI EdTech to more exams and students." },
            { label: "Building", title: "SafeLens AI v2", desc: "Deeper vision + real-time scam intel." },
            { label: "Planning", title: "AI Dev Tools", desc: "Developer productivity powered by agents." },
            { label: "Future", title: "Global AI Products", desc: "Education, cybersecurity and productivity at scale." },
          ].map((r, i) => (
            <motion.div key={i} variants={fadeUp}>
              <GlassCard className="p-6 h-full">
                <Badge className="mb-3">{r.label}</Badge>
                <div className="font-semibold text-lg">{r.title}</div>
                <div className="text-sm text-muted-foreground mt-2">{r.desc}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CONTACT / CTA */}
      <Section id="contact">
        <motion.div variants={fadeUp}>
          <GlassCard className="p-8 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary-glow/10 to-background" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Let's Build the Future Together</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Open to collaborations on AI, EdTech and cybersecurity products. Reach out — I read every message.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild><a href={LINKS.portfolio} target="_blank" rel="noopener noreferrer">Portfolio <ExternalLink className="w-4 h-4 ml-1" /></a></Button>
                <Button asChild variant="outline"><a href={LINKS.jeelytics} target="_blank" rel="noopener noreferrer">JEElytics</a></Button>
                <Button asChild variant="outline"><a href={LINKS.safelens} target="_blank" rel="noopener noreferrer">SafeLens AI</a></Button>
                <Button asChild variant="outline"><a href={LINKS.github} target="_blank" rel="noopener noreferrer"><Github className="w-4 h-4 mr-1" /> GitHub</a></Button>
                <Button asChild variant="outline"><a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="w-4 h-4 mr-1" /> LinkedIn</a></Button>
                <Button asChild variant="outline"><a href={LINKS.medium} target="_blank" rel="noopener noreferrer">Medium</a></Button>
                <Button asChild variant="ghost"><a href={LINKS.email}><Mail className="w-4 h-4 mr-1" /> Email</a></Button>
              </div>
              <div className="mt-8">
                <Link to="/home" className="text-sm text-muted-foreground hover:text-primary underline">← Back to JEElytics</Link>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </Section>
    </div>
  );
}
