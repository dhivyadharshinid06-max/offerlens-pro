import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  ShieldCheck, FileText, Building2, History, Sparkles, Info, LogOut,
  AlertTriangle, CheckCircle2, Trash2, Loader2, BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { analyzeOffer, listAnalyses, deleteAnalysis } from "@/lib/analyses.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — OfferLens" }, { name: "description", content: "Analyze internship and job opportunities and review your past analyses." }] }),
  component: Dashboard,
});

type TabKey = "analyze" | "company" | "history";
type AnalysisType = "job_description" | "offer" | "company";

type Analysis = {
  id: string;
  type: AnalysisType;
  input_preview: string;
  risk_score: number;
  risk_level: "Low Risk" | "Medium Risk" | "High Risk";
  red_flags: { title: string; explanation: string }[];
  positive_indicators: { title: string; explanation: string }[];
  summary: string;
  created_at: string;
};

const tabs: { key: TabKey; label: string; icon: typeof FileText }[] = [
  { key: "analyze", label: "Analyze Offer", icon: FileText },
  { key: "company", label: "Company Verification", icon: Building2 },
  { key: "history", label: "Analysis History", icon: History },
];

const typeLabels: Record<AnalysisType, string> = {
  job_description: "Job description",
  offer: "Offer letter",
  company: "Company info",
};

function Dashboard() {
  const [tab, setTab] = useState<TabKey>("analyze");
  const [active, setActive] = useState<Analysis | null>(null);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const listFn = useServerFn(listAnalyses);
  const { data: analyses } = useSuspenseQuery({
    queryKey: ["analyses"],
    queryFn: () => listFn() as unknown as Promise<Analysis[]>,
  });

  const metrics = useMemo(() => {
    const total = analyses.length;
    const low = analyses.filter((a) => a.risk_level === "Low Risk").length;
    const high = analyses.filter((a) => a.risk_level === "High Risk").length;
    return { total, low, high };
  }, [analyses]);

  async function handleLogout() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span className="text-base font-semibold tracking-tight">OfferLens</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-1 h-4 w-4" />
            Log out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">Your dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Analyze an opportunity, research a company, or revisit past analyses.</p>
        </div>

        {/* Metrics */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <MetricCard label="Total analyses" value={metrics.total} icon={BarChart3} />
          <MetricCard label="Low risk" value={metrics.low} icon={CheckCircle2} accent="text-emerald-600" />
          <MetricCard label="High risk" value={metrics.high} icon={AlertTriangle} accent="text-red-600" />
        </div>

        {/* Disclaimer */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-muted-foreground">
            OfferLens provides informational risk analysis and does not make legal or factual determinations about companies.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-8 overflow-x-auto">
          <div role="tablist" className="inline-flex gap-1 rounded-lg border border-border bg-card p-1">
            {tabs.map((t) => {
              const activeTab = tab === t.key;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={activeTab}
                  onClick={() => setTab(t.key)}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${activeTab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <t.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          {tab === "analyze" && <AnalyzePanel type="job_description" onResult={setActive} />}
          {tab === "company" && <AnalyzePanel type="company" onResult={setActive} />}
          {tab === "history" && <HistoryPanel analyses={analyses} onOpen={setActive} />}
        </div>

        {active && (
          <ResultModal analysis={active} onClose={() => setActive(null)} />
        )}
      </main>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, accent }: { label: string; value: number; icon: typeof FileText; accent?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className={`h-4 w-4 ${accent ?? "text-muted-foreground"}`} />
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function AnalyzePanel({ type, onResult }: { type: AnalysisType; onResult: (a: Analysis) => void }) {
  const [content, setContent] = useState("");
  const [selectedType, setSelectedType] = useState<AnalysisType>(type);
  const qc = useQueryClient();
  const analyzeFn = useServerFn(analyzeOffer);

  const mutation = useMutation({
    mutationFn: (input: { type: AnalysisType; content: string }) => analyzeFn({ data: input }) as unknown as Promise<Analysis>,
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ["analyses"] });
      setContent("");
      onResult(result);
      toast.success("Analysis complete");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const isCompanyTab = type === "company";
  const title = isCompanyTab ? "Research company credibility" : "Analyze an opportunity";
  const desc = isCompanyTab
    ? "Paste company information — website text, an 'About' page, or recruiter messages — to surface credibility signals."
    : "Paste a job description, internship listing, or offer letter and OfferLens will surface red flags and positive indicators.";
  const placeholder = isCompanyTab
    ? "Paste company information here…"
    : "Paste the full text of the job description or offer letter here…";

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>

      {!isCompanyTab && (
        <div className="mt-5 inline-flex rounded-lg border border-border bg-secondary/40 p-1 text-sm">
          {(["job_description", "offer"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedType(t)}
              className={`rounded-md px-3 py-1.5 font-medium transition ${selectedType === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              {typeLabels[t]}
            </button>
          ))}
        </div>
      )}

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="mt-4 min-h-48"
      />
      <p className="mt-2 text-xs text-muted-foreground">{content.length} / 20,000 characters · minimum 20</p>

      <div className="mt-4 flex justify-end">
        <Button
          disabled={mutation.isPending || content.trim().length < 20}
          onClick={() => mutation.mutate({ type: isCompanyTab ? "company" : selectedType, content })}
        >
          {mutation.isPending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
          {mutation.isPending ? "Analyzing…" : "Analyze"}
        </Button>
      </div>
    </section>
  );
}

function HistoryPanel({ analyses, onOpen }: { analyses: Analysis[]; onOpen: (a: Analysis) => void }) {
  const qc = useQueryClient();
  const delFn = useServerFn(deleteAnalysis);
  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }) as Promise<{ ok: boolean }>,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["analyses"] });
      toast.success("Deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (analyses.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="grid place-items-center rounded-lg border border-dashed border-border bg-secondary/40 px-6 py-12 text-center">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
            <History className="h-5 w-5" />
          </span>
          <h3 className="mt-4 text-sm font-semibold">No analyses yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Once you analyze a job description, offer letter, or company information, your results will be saved here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold tracking-tight">Analysis history</h2>
      <p className="mt-1 text-sm text-muted-foreground">Tap a row to see the full analysis.</p>
      <ul className="mt-6 divide-y divide-border">
        {analyses.map((a) => (
          <li key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4">
            <button onClick={() => onOpen(a)} className="min-w-0 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <RiskBadge level={a.risk_level} />
                <span className="text-xs text-muted-foreground">{typeLabels[a.type]}</span>
                <span className="text-xs text-muted-foreground">· {new Date(a.created_at).toLocaleDateString()}</span>
              </div>
              <p className="mt-1 truncate text-sm text-foreground">{a.input_preview}</p>
            </button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete analysis"
              onClick={() => del.mutate(a.id)}
              disabled={del.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RiskBadge({ level }: { level: Analysis["risk_level"] }) {
  const styles =
    level === "Low Risk"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : level === "Medium Risk"
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : "bg-red-50 text-red-700 ring-red-200";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${styles}`}>
      {level}
    </span>
  );
}

function ResultModal({ analysis, onClose }: { analysis: Analysis; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-border bg-background p-6 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <RiskBadge level={analysis.risk_level} />
              <span className="text-xs text-muted-foreground">{typeLabels[analysis.type]}</span>
            </div>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">Risk score: {analysis.risk_score}/100</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={`h-full ${
              analysis.risk_level === "Low Risk"
                ? "bg-emerald-500"
                : analysis.risk_level === "Medium Risk"
                  ? "bg-amber-500"
                  : "bg-red-500"
            }`}
            style={{ width: `${analysis.risk_score}%` }}
          />
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-semibold">Summary</h4>
          <p className="mt-2 text-sm text-muted-foreground">{analysis.summary}</p>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-semibold text-red-700">Red flags</h4>
          {analysis.red_flags.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">None identified.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {analysis.red_flags.map((f, i) => (
                <li key={i} className="rounded-lg border border-red-200 bg-red-50/50 p-3 text-sm">
                  <p className="font-medium text-red-900">{f.title}</p>
                  <p className="mt-1 text-red-800/80">{f.explanation}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-semibold text-emerald-700">Positive indicators</h4>
          {analysis.positive_indicators.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">None identified.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {analysis.positive_indicators.map((f, i) => (
                <li key={i} className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 text-sm">
                  <p className="font-medium text-emerald-900">{f.title}</p>
                  <p className="mt-1 text-emerald-800/80">{f.explanation}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          OfferLens provides informational risk analysis and does not make legal or factual determinations about companies.
        </p>
      </div>
    </div>
  );
}
