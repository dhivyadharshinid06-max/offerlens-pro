import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Search, BellRing, FileCheck2, Building2, ArrowRight, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OfferLens — Verify Opportunities Before You Apply" },
      { name: "description", content: "OfferLens helps students verify internships and job offers, spot scams, and apply with confidence." },
      { property: "og:title", content: "OfferLens — Verify Opportunities Before You Apply" },
      { property: "og:description", content: "Verify internships and job offers before you apply." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: ShieldCheck, title: "Scam detection", desc: "We cross-check listings against known scam patterns and reported recruiters." },
  { icon: Building2, title: "Company verification", desc: "Confirm the employer is real, active, and currently hiring through official channels." },
  { icon: FileCheck2, title: "Offer review", desc: "Upload an offer letter and get a clear breakdown of red flags and missing terms." },
  { icon: BellRing, title: "Real-time alerts", desc: "Get notified when a posting changes status or gets flagged by other students." },
  { icon: Search, title: "Recruiter lookup", desc: "Search any recruiter to see verified history before sharing your personal info." },
  { icon: Star, title: "Student-trusted", desc: "Reviews and signals contributed by thousands of verified student users." },
];

const testimonials = [
  { name: "Maya R.", role: "CS Junior, UCLA", quote: "OfferLens caught a fake recruiter who'd been DMing my entire class. Saved me hours and probably my SSN." },
  { name: "Jordan K.", role: "Finance, NYU Stern", quote: "I check every internship here now. It's like a credit score for job postings." },
  { name: "Priya S.", role: "Design, RISD", quote: "Clean, fast, and honest. The offer review broke down exactly what was missing from my contract." },
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
              Trusted by 12,000+ students
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
              Verify Opportunities Before You Apply
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              OfferLens checks internships, job offers, and recruiters in seconds, so you can apply with confidence and skip the scams.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start verifying free <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">See how it works</Button>
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">No credit card required · Free for students</p>
          </div>

          {/* Mock dashboard preview */}
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
                  { label: "Stripe — SWE Intern", status: "Verified", tone: "good" },
                  { label: "QuickHire Pro", status: "High risk", tone: "bad" },
                  { label: "Anthropic — RS Intern", status: "Verified", tone: "good" },
                ].map((c) => (
                  <div key={c.label} className="rounded-lg border border-border p-4">
                    <div className="text-sm font-medium">{c.label}</div>
                    <div className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs ${c.tone === "good" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${c.tone === "good" ? "bg-primary" : "bg-destructive"}`} />
                      {c.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">Features</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Everything you need to apply with confidence</h2>
            <p className="mt-3 text-muted-foreground">Built specifically for students navigating noisy job boards, cold DMs, and too-good-to-be-true offers.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
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

      {/* Testimonials */}
      <section id="testimonials" className="border-t border-border bg-secondary/30 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">Testimonials</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Loved by students at top schools</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-xl border border-border bg-card p-6">
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground">“{t.quote}”</blockquote>
                <figcaption className="mt-5 text-sm">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-muted-foreground">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="border-t border-border bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Apply smarter, starting today</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Join thousands of students who verify every opportunity before sharing a single detail.</p>
          <ul className="mx-auto mt-6 flex max-w-lg flex-col items-start gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-center sm:gap-6">
            {["Free for students", "Unlimited verifications", "Cancel anytime"].map((i) => (
              <li key={i} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />{i}</li>
            ))}
          </ul>
          <div className="mt-8">
            <Link to="/signup">
              <Button size="lg">Create your free account</Button>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
