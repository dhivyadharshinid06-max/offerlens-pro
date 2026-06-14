import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Search, FileText, Building2, ArrowRight, ClipboardPaste, Sparkles, ListChecks, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OfferLens — Verify Opportunities Before You Apply" },
      { name: "description", content: "OfferLens helps students and fresh graduates evaluate internship and job opportunities with AI-assisted analysis of red flags, company credibility, and offer details." },
      { property: "og:title", content: "OfferLens — Verify Opportunities Before You Apply" },
      { property: "og:description", content: "AI-assisted analysis of internships, job offers, and company credibility for students and fresh graduates." },
    ],
  }),
  component: Landing,
});

const whyItems = [
  { icon: Sparkles, title: "Analyze opportunities with AI", desc: "Run an AI-assisted review of internship listings, job descriptions, and offer letters to surface concerns you might miss on a quick read." },
  { icon: ShieldCheck, title: "Identify potential red flags", desc: "Spot vague responsibilities, unrealistic compensation, upfront fees, and other warning signs before you apply or accept." },
  { icon: Building2, title: "Research company credibility", desc: "Look at a company's online presence and stated details together, so you can assess credibility before sharing personal information." },
  { icon: Compass, title: "Make informed career decisions", desc: "Get a clear, structured summary that supports your own judgment — not a verdict that replaces it." },
];

const howItWorks = [
  { step: "01", icon: ClipboardPaste, title: "Paste the details", desc: "Share a job description, offer letter text, or a company URL you want to take a closer look at." },
  { step: "02", icon: Sparkles, title: "AI analyzes the opportunity", desc: "OfferLens reviews the content for red flags, positive indicators, and missing information." },
  { step: "03", icon: ListChecks, title: "Review risk indicators", desc: "Read a structured breakdown with risk indicators, positive signals, and suggested questions to ask." },
  { step: "04", icon: Compass, title: "Make a more informed decision", desc: "Use the analysis as one input into your own decision about whether to apply, follow up, or move on." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.95_0.05_258)_0%,transparent_70%)]" />
        <div className="mx-auto max-w-6xl px-4 pt-20 pb-24 sm:px-6 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              For students and fresh graduates
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
              Verify Opportunities Before You Apply
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              AI-powered internship and job offer verification for students and fresh graduates. Paste a description, offer, or company URL and get a clear breakdown of risk indicators and positive signals.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get started <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">See how it works</Button>
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">OfferLens is a decision-support tool, not a definitive verdict on any employer.</p>
          </div>

          {/* Product preview */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-primary/5">
              <div className="flex items-center gap-1.5 border-b border-border bg-secondary/50 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                <span className="ml-3 text-xs text-muted-foreground">offerlens.app/dashboard</span>
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-3">
                {[
                  { label: "Analyze Offer", icon: FileText, desc: "Paste a job description or offer letter for review." },
                  { label: "Company Verification", icon: Building2, desc: "Share a company URL to surface credibility signals." },
                  { label: "Analysis History", icon: ListChecks, desc: "Revisit past analyses and compare opportunities." },
                ].map((c) => (
                  <div key={c.label} className="rounded-lg border border-border p-4">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                      <c.icon className="h-4 w-4" />
                    </span>
                    <div className="mt-3 text-sm font-medium">{c.label}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why OfferLens */}
      <section id="features" className="border-t border-border bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">Why OfferLens</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">A clearer view of every opportunity</h2>
            <p className="mt-3 text-muted-foreground">OfferLens is built to help students and fresh graduates think critically about internship and job opportunities — not to replace their judgment.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {whyItems.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-border bg-secondary/30 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">How it works</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">From listing to informed decision in four steps</h2>
            <p className="mt-3 text-muted-foreground">A simple workflow designed around how students actually evaluate opportunities.</p>
          </div>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((s) => (
              <li key={s.step} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">{s.step}</span>
                </div>
                <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="border-t border-border bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-sm font-medium text-primary">Our mission</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Help students and fresh graduates evaluate internship and job opportunities with greater confidence and transparency.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            OfferLens shares analysis and risk indicators based on the information you provide. It is a tool to support your judgment — not a definitive verdict on any company, recruiter, or offer.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section id="get-started" className="border-t border-border bg-secondary/30 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Start evaluating opportunities with more clarity</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Create a free account to analyze internship descriptions, offer letters, and company URLs.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">Create your account</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">Log in</Button>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
