import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { SiteCanvasHost } from "@/components/site/SiteCanvasHost";
import { Plat2D } from "@/components/site/Plat2D";
import { LotPanel } from "@/components/site/LotPanel";
import { MixControls } from "@/components/site/MixControls";
import { computeTotals } from "@/lib/data/boq";
import { useVillage } from "@/lib/store";
import { usd } from "@/lib/utils";
import { STYLE_LIST } from "@/lib/data/homes";

export const Route = createFileRoute("/site")({ component: SitePage });

function SitePage() {
  const mix = useVillage((s) => s.mix);
  const commissionRate = useVillage((s) => s.commissionRate);
  const totals = computeTotals(mix, { commissionRate });

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] px-4 py-5 md:px-6">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
          Interactive plat · 100 lots · ¼ acre each
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Village site map
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft md:text-base">
          Drag to orbit. Scroll to zoom. Hover a pad — or the 10×10 schematic — to read the style,
          solar kit and all-in figure. Mix sliders re-colour the whole village.
        </p>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-4 px-4 pb-10 lg:grid-cols-[minmax(0,1fr)_340px] md:px-6">
        <div className="overflow-hidden rounded-[22px] shadow-card">
          <div className="relative h-[min(68vh,760px)] min-h-[420px] bg-kdk-deep">
            <SiteCanvasHost />
            <div className="pointer-events-none absolute left-3 top-3 rounded-[12px] bg-paper/90 px-3 py-2 text-[11px] text-ink-soft">
              Drag to look · scroll to zoom · click a home
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <MixControls />
          <LotPanel />
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-4 px-4 pb-14 lg:grid-cols-[minmax(0,1fr)_1fr] md:px-6">
        <div>
          <h2 className="mb-2 font-display text-xl font-semibold">Schematic plat</h2>
          <Plat2D />
        </div>
        <div className="rounded-[18px] bg-paper-2 p-4 shadow-card">
          <h2 className="font-display text-xl font-semibold">Mix at this plat</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {STYLE_LIST.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2">
                  <i className="size-2.5 rounded-sm" style={{ background: s.color }} />
                  {mix[s.id]} × {s.name}
                </span>
                <span className="tabular text-ink-soft">{usd(totals.perStyleVillage[s.id])}/home</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-line pt-3 text-sm">
            Village unfurnished all-in{" "}
            <span className="tabular font-medium">{usd(totals.unfurnishedAllIn)}</span>
            <span className="block text-xs text-muted">
              Includes 8% contingency and 5.5% PM. FF&E {usd(totals.ffe)} extra. Assembly labour
              in; solar hours TBD.
            </span>
          </p>
        </div>
      </div>
    </AppShell>
  );
}
