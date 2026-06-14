import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, FileText, Building2, History, Sparkles, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — OfferLens" }, { name: "description", content: "Analyze internship and job opportunities and review your past analyses." }] }),
  component: Dashboard,
});

type TabKey = "analyze" | "company" | "history";

const tabs: { key: TabKey; label: string; icon: typeof FileText }[] = [
  { key: "analyze", label: "Analyze Offer", icon: FileText },
  { key: "company", label: "Company Verification", icon: Building2 },
  { key: "history", label: "Analysis History", icon: History },
];

function Dashboard() {
  const [tab, setTab] = useState<TabKey>("analyze");

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Top bar */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span className="text-base font-semibold tracking-tight">OfferLens</span>
          </Link>
          <Link to="/login"><Button variant="ghost" size="sm">Log out</Button></Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">Your dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Analyze an opportunity, research a company, or revisit past analyses.</p>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-muted-foreground">
            OfferLens provides AI-assisted analysis based on the information you share. It does not definitively label any company, recruiter, or offer — use the results as one input into your own decision.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-8 overflow-x-auto">
          <div role="tablist" className="inline-flex gap-1 rounded-lg border border-border bg-card p-1">
            {tabs.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.key)}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          {tab === "analyze" && <AnalyzePanel />}
          {tab === "company" && <CompanyPanel />}
          {tab === "history" && <HistoryPanel />}
        </div>
      </main>
    </div>
  );
}

function PanelShell({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function AnalyzePanel() {
  return (
    <PanelShell
      title="Analyze an opportunity"
      desc="Paste a job description or offer letter and OfferLens will surface potential red flags and positive indicators."
    >
      <label htmlFor="offer-input" className="text-sm font-medium">Job description or offer letter</label>
      <Textarea
        id="offer-input"
        placeholder="Paste the full text of the job description or offer letter here…"
        className="mt-2 min-h-48"
      />
      <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">Your input is used to generate the analysis you see below.</p>
        <Button className="sm:self-end"><Sparkles className="mr-1 h-4 w-4" />Analyze</Button>
      </div>
    </PanelShell>
  );
}

function CompanyPanel() {
  return (
    <PanelShell
      title="Research company credibility"
      desc="Share a company URL to review credibility signals based on the information available."
    >
      <label htmlFor="company-url" className="text-sm font-medium">Company website URL</label>
      <Input id="company-url" type="url" placeholder="https://company.com" className="mt-2" />
      <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">OfferLens reviews the URL and stated details — it does not certify any company.</p>
        <Button className="sm:self-end"><Sparkles className="mr-1 h-4 w-4" />Run check</Button>
      </div>
    </PanelShell>
  );
}

function HistoryPanel() {
  return (
    <PanelShell
      title="Analysis history"
      desc="Your previous analyses will appear here so you can compare opportunities over time."
    >
      <div className="grid place-items-center rounded-lg border border-dashed border-border bg-secondary/40 px-6 py-12 text-center">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <History className="h-5 w-5" />
        </span>
        <h3 className="mt-4 text-sm font-semibold">No analyses yet</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">Once you analyze a job description, offer letter, or company URL, your results will be saved here for easy reference.</p>
      </div>
    </PanelShell>
  );
}
