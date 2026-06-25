import { ShieldCheck } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <span className="text-base font-semibold tracking-tight">OfferLens</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              AI-assisted analysis of internship and job opportunities for students and fresh graduates.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Explore</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="/#features" className="hover:text-foreground">Why OfferLens</a></li>
              <li><a href="/#how-it-works" className="hover:text-foreground">How it works</a></li>
              <li><a href="/#mission" className="hover:text-foreground">Mission</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} OfferLens. A decision-support tool — not a definitive verdict on any company or offer.</span>
        </div>
      </div>
    </footer>
  );
}
