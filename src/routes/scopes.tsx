import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ScopePlayground } from "@/components/boq/ScopePlayground";

export const Route = createFileRoute("/scopes")({ component: ScopesPage });

function ScopesPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-6">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
          Scope playground · CASA 100
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Build the price the Government wants
        </h1>
        <p className="mt-2 max-w-3xl text-ink-soft">
          The green number is only what is switched on. Read the lines under it. They say whether
          ocean freight and Belize duties are in that figure. The letter price is shell only, FOB
          China — no shipping and no duties.
        </p>
        <p className="mt-3 text-sm">
          <Link to="/boq" className="text-kdk underline-offset-4 hover:underline">
            Open the line-by-line BOQ
          </Link>
          <span className="text-muted"> — hide any row there the same way.</span>
        </p>
        <div className="mt-8">
          <ScopePlayground />
        </div>
      </div>
    </AppShell>
  );
}
