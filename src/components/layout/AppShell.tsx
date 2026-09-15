import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { usd } from "@/lib/utils";
import { useVillage } from "@/lib/store";
import { computeTotals } from "@/lib/data/boq";
import { mixTotal } from "@/lib/data/homes";

const NAV = [
  { to: "/letter", label: "Letter" },
  { to: "/", label: "Overview" },
  { to: "/site", label: "Site map" },
  { to: "/catalog", label: "Catalog" },
  { to: "/civic", label: "Plaza" },
  { to: "/scopes", label: "Scopes" },
  { to: "/boq", label: "BOQ" },
  { to: "/compare", label: "vs Moonlight Bay" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const mix = useVillage((s) => s.mix);
  const offScopes = useVillage((s) => s.offScopes);
  const offItems = useVillage((s) => s.offItems);
  const pricingMode = useVillage((s) => s.pricingMode);
  const commissionRate = useVillage((s) => s.commissionRate);
  const totals = computeTotals(mix, { offScopes, offItems, pricingMode, commissionRate });
  const ok = mixTotal(mix) === 100;

  return (
    <div className="min-h-svh bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/92 backdrop-blur-md print:hidden">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 md:px-6">
          <Link to="/letter" className="flex min-w-0 items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-kdk text-[11px] font-semibold tracking-wide text-kdk-fg">
              KDK
            </span>
            <span className="min-w-0">
              <span className="block font-display text-[15px] font-semibold leading-tight tracking-tight">
                CASA 100
              </span>
              <span className="block truncate text-[11px] text-muted">
                For Ian Courtenay · Office of the Prime Minister
              </span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {NAV.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "rounded-[10px] px-3 py-2 text-sm transition-colors",
                    active ? "bg-kdk text-kdk-fg" : "text-ink-soft hover:bg-paper-2 hover:text-ink",
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto hidden items-baseline gap-2 rounded-[12px] bg-paper-2 px-3 py-2 lg:flex">
            <span className="text-[11px] uppercase tracking-wide text-muted">All-in</span>
            <span className="font-display text-lg font-semibold tabular leading-none">
              {usd(totals.unfurnishedAllIn)}
            </span>
            <span className="text-[11px] text-muted">this scope</span>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-line px-3 py-2 md:hidden">
          {NAV.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "shrink-0 rounded-full px-3 py-2 text-sm",
                  active ? "bg-kdk text-kdk-fg" : "bg-paper-2 text-ink-soft",
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </header>
      {!ok && (
        <div className="bg-warn/15 px-4 py-2 text-center text-sm text-warn print:hidden">
          Mix totals {mixTotal(mix)} homes — set the three styles to 100 to price the village.
        </div>
      )}
      <main>{children}</main>
      <footer className="border-t border-line px-4 py-8 text-center text-xs text-muted print:hidden">
        Prepared by KDK Technology Ltd for Mr. Ian Courtenay, Senior Investment & E-Governance
        Officer, Office of the Prime Minister, Sir Edney Cain Building, Belmopan. Working draft for
        government review — not a contract. USD. KDK list. Distributor net is 10% off
        the three models on a 100-home order. Assembly 42 / 80 / 80 hrs by style. Solar install hours TBD.
      </footer>
    </div>
  );
}
