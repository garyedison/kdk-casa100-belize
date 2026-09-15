import { STYLE_LIST } from "@/lib/data/homes";
import {
  COMMISSION_MAX,
  COMMISSION_MIN,
  COMMISSION_PRESETS,
  pctLabel,
} from "@/lib/data/commission";
import { computeTotals } from "@/lib/data/boq";
import { useVillage } from "@/lib/store";
import { cn, usd } from "@/lib/utils";

export function CommissionCalculator() {
  const mix = useVillage((s) => s.mix);
  const offScopes = useVillage((s) => s.offScopes);
  const offItems = useVillage((s) => s.offItems);
  const pricingMode = useVillage((s) => s.pricingMode);
  const commissionRate = useVillage((s) => s.commissionRate);
  const setCommissionRate = useVillage((s) => s.setCommissionRate);

  const totals = computeTotals(mix, {
    offScopes,
    offItems,
    pricingMode,
    commissionRate,
  });
  const setAside = totals.partnerMargin;
  const homesOff = offScopes.includes("homes");

  return (
    <section className="rounded-xl bg-paper p-5 shadow-card md:p-6">
      <p className="text-[11px] uppercase tracking-[0.16em] text-kdk">
        Pricing desk · internal
      </p>
      <h2 className="font-display text-2xl font-semibold">
        Government volume discount / licensed distributor margin
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-ink-soft">
        Default is 10% of the <strong className="text-ink">shell list only</strong> — not slabs,
        solar, or village works. If the Government buys through a licensed Belizean distributor,
        this amount is that seller’s margin. If it buys from KDK Hong Kong, the same percentage is
        a Government volume discount. Not shown on the Minister letter.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {COMMISSION_PRESETS.map((r) => {
          const active = Math.abs(commissionRate - r) < 0.001;
          return (
            <button
              key={r}
              type="button"
              onClick={() => setCommissionRate(r)}
              className={cn(
                "min-h-11 min-w-20 rounded-lg px-4 text-sm font-semibold tabular shadow-card transition-colors",
                active ? "bg-kdk text-kdk-fg" : "bg-paper-2 text-ink hover:bg-line",
              )}
            >
              {pctLabel(r)}
            </button>
          );
        })}
      </div>

      <label className="mt-5 block max-w-xl">
        <span className="text-[11px] uppercase tracking-wide text-muted">
          Or slide 0–25% · now {pctLabel(commissionRate)}
        </span>
        <input
          type="range"
          min={COMMISSION_MIN * 100}
          max={COMMISSION_MAX * 100}
          step={1}
          value={Math.round(commissionRate * 100)}
          onChange={(e) => setCommissionRate(Number(e.target.value) / 100)}
          className="mt-2 h-11 w-full cursor-pointer accent-kdk"
          aria-label="Set-aside percent"
        />
      </label>

      {homesOff ? (
        <p className="mt-4 rounded-md bg-tbd/15 px-4 py-3 text-sm">
          Homes are hidden — volume discount is $0 because it is a percentage of the shell list.
        </p>
      ) : (
        <>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Tile k="Shell list (100 homes)" v={usd(totals.factoryList)} />
            <Tile k={`KDK net after ${pctLabel(commissionRate)}`} v={usd(totals.kdkNetHomes)} />
            <Tile
              k={`${pctLabel(commissionRate)} discount / margin`}
              v={usd(setAside)}
              accent
            />
            <Tile k="Per ¼-acre lot (avg)" v={usd(setAside / Math.max(1, totals.homeCount))} />
          </dl>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-wide text-muted">
                  <th className="py-2 pr-3 font-medium">Style</th>
                  <th className="py-2 pr-3 font-medium">Qty</th>
                  <th className="py-2 pr-3 font-medium">List / home</th>
                  <th className="py-2 pr-3 font-medium">Margin / home</th>
                  <th className="py-2 font-medium">Campaign margin</th>
                </tr>
              </thead>
              <tbody>
                {STYLE_LIST.map((s) => {
                  const each = s.factoryList * commissionRate;
                  return (
                    <tr key={s.id} className="border-b border-line/70">
                      <td className="py-2 pr-3 font-medium">{s.name}</td>
                      <td className="py-2 pr-3 tabular">{mix[s.id]}</td>
                      <td className="py-2 pr-3 tabular">{usd(s.factoryList)}</td>
                      <td className="py-2 pr-3 tabular">{usd(each)}</td>
                      <td className="py-2 tabular">{usd(each * mix[s.id])}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td className="py-2 pr-3 font-semibold" colSpan={4}>
                    Total at {pctLabel(commissionRate)}
                  </td>
                  <td className="py-2 font-display text-lg font-semibold tabular">{usd(setAside)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg bg-paper-2 px-4 py-4 text-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                Buy from KDK Hong Kong
              </p>
              <p className="mt-1 text-ink-soft">
                The Government keeps the {pctLabel(commissionRate)} as a Government volume discount.
                Pays KDK <strong className="text-ink">{usd(totals.kdkNetHomes)}</strong> for the
                shells.
              </p>
            </div>
            <div className="rounded-lg bg-kdk/10 px-4 py-4 text-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-kdk">
                Buy through a Belizean distributor
              </p>
              <p className="mt-1 text-ink-soft">
                The Government pays list on the shells. The licensed Belizean distributor receives{" "}
                <strong className="text-ink">{usd(setAside)}</strong>. KDK still invoices that
                company {usd(totals.kdkNetHomes)} for the shells.
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function Tile({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className={cn("rounded-lg px-4 py-4", accent ? "bg-kdk text-kdk-fg" : "bg-paper-2")}>
      <dt className={cn("text-[11px] uppercase tracking-wide", accent ? "text-kdk-fg/70" : "text-muted")}>
        {k}
      </dt>
      <dd className="mt-1 font-display text-2xl font-semibold tabular">{v}</dd>
    </div>
  );
}
