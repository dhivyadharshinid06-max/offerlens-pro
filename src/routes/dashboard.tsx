import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Search, Plus, Building2, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — OfferLens" }, { name: "description", content: "Your verified opportunities at a glance." }] }),
  component: Dashboard,
});

const stats = [
  { label: "Verifications", value: "24", icon: CheckCircle2 },
  { label: "Pending", value: "3", icon: Clock },
  { label: "Flagged", value: "2", icon: AlertTriangle },
];

const opportunities = [
  { company: "Stripe", role: "Software Engineer Intern", status: "Verified", tone: "good", date: "Today" },
  { company: "Anthropic", role: "Research Scientist Intern", status: "Verified", tone: "good", date: "Yesterday" },
  { company: "QuickHire Pro", role: "Remote Recruiter", status: "High risk", tone: "bad", date: "2d ago" },
  { company: "Notion", role: "Product Designer Intern", status: "Pending", tone: "warn", date: "3d ago" },
  { company: "Vercel", role: "DevRel Intern", status: "Verified", tone: "good", date: "1w ago" },
];

const toneClass: Record<string, string> = {
  good: "bg-primary/10 text-primary",
  bad: "bg-destructive/10 text-destructive",
  warn: "bg-amber-100 text-amber-700",
};

function Dashboard() {
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
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost" size="sm">Log out</Button></Link>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-sm font-medium text-primary">M</div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">Welcome back, Maya</h1>
            <p className="mt-1 text-sm text-muted-foreground">Here's what's happening with your opportunities.</p>
          </div>
          <Button className="shrink-0"><Plus className="mr-1 h-4 w-4" />New verification</Button>
        </div>

        {/* Search */}
        <div className="mt-8 rounded-xl border border-border bg-card p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Paste a job URL, company name, or recruiter email…" className="pl-9" />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-2 text-3xl font-semibold tracking-tight">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Recent */}
        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Recent opportunities</h2>
            <button className="text-xs text-muted-foreground hover:text-foreground">View all</button>
          </div>
          <ul className="divide-y divide-border">
            {opportunities.map((o) => (
              <li key={o.company + o.role} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{o.company}</div>
                    <div className="truncate text-xs text-muted-foreground">{o.role}</div>
                  </div>
                </div>
                <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClass[o.tone]}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${o.tone === "good" ? "bg-primary" : o.tone === "bad" ? "bg-destructive" : "bg-amber-500"}`} />
                  {o.status}
                </span>
                <span className="hidden text-xs text-muted-foreground sm:inline">{o.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
