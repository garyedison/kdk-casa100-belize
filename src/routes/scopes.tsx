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
          Reviewers can hide a package — or a single BOQ line — and watch the all-in fall. Homes
          only is FOB China port: pickup at the port, no ocean, no inland. Kitchen, toilet and
          shower are in the module. Split air is house MEP, not Homes only. Village roads, village
          power, potable water and the WWTP (wastewater treatment plant — shared sewage plant) are
          not in Homes only and <strong>not in Full village</strong>. Full village is unfurnished
          homes with <strong>no extra civil</strong> (no roads, village power, water, WWTP, trees,
          plaza, or gate). Add those on this page.{" "}
          <Link to="/civic" className="text-kdk underline-offset-4 hover:underline">
            Plaza rendering
          </Link>
          . Working draft, not a contract.
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
