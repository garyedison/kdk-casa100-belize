import { STYLE_LIST } from "@/lib/data/homes";
import {
  COMMISSION_MAX,
  COMMISSION_MIN,
  COMMISSION_PRESETS,
  DEFAULT_COMMISSION,
  heldNetShare,
  pctLabel,
} from "@/lib/data/commission";
import { computeTotals } from "@/lib/data/boq";
import { useVillage } from "@/lib/store";
import { cn, usd } from "@/lib/utils";

export function CommissionCalculator() {
  const mix = useVillage((s) => s.mix);
  const offScopes = useVillage((s) => s.offScopes);
  const offItems = useVillage((s) => s.offItems);
  const pinnedOn = useVillage((s) => s.pinnedOn);
  const pricingMode = useVillage((s) => s.pricingMode);
  const commissionRate = useVillage((s) => s.commissionRate);
  const setCommissionRate = useVillage((s) => s.setCommissionRate);

  const totals = computeTotals(mix, {
    offScopes,
    offItems,
    pinnedOn,
    pricingMode,
    commissionRate,
  });
  const shell = heldNetShare(totals.factoryList, commissionRate);
  const homesOff = offScopes.includes("homes");
  const over = shell.overDefault;

  return (
    <section className="rounded-xl bg-paper p-5 shadow-card md:p-6">
      <p className="text-[11px] uppercase tracking-[0.16em] text-kdk">
        Pricing desk · internal
      </p>
      <h2 className="font-display text-2xl font-semibold">
        Government volume discount / licensed distributor margin
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-ink-soft">
        KDK’s net on the shells is held at{" "}
        <strong className="text-ink">10% off the published list</strong> (
        {usd(heldNetShare(totals.factoryList, DEFAULT_COMMISSION).kdkNet)} on this mix). Clicking
        15% or 20% does <strong className="text-ink">not</strong> reduce what KDK invoices. It
        raises the price the Government pays, so a Belizean distributor can keep a larger margin.
        Shells only — not slabs, solar, or village works.
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
          aria-label="Distributor or volume-discount percent"
        />
      </label>

      {homesOff ? (
        <p className="mt-4 rounded-md bg-tbd/15 px-4 py-3 text-sm">
          Homes are hidden — shell price is $0 because the percentage is on the shell list.
        </p>
      ) : (
        <>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Tile k="Government pays (shells)" v={usd(shell.sellingList)} accent />
            <Tile k="KDK net (held)" v={usd(shell.kdkNet)} />
            <Tile
              k={`${pctLabel(commissionRate)} discount / margin`}
              v={usd(shell.share)}
            />
            <Tile
              k="Gov. pays per lot (shell)"
              v={usd(shell.sellingList / Math.max(1, totals.homeCount))}
            />
          </dl>
          {over ? (
            <p className="mt-3 rounded-md bg-tbd/15 px-4 py-3 text-sm text-ink">
              {pctLabel(commissionRate)} is above KDK’s 10% ceiling. Published list stays{" "}
              {usd(shell.publishedList)}. Selling price to the Government rises by{" "}
              {usd(shell.listUplift)} to {usd(shell.sellingList)}. KDK still invoices{" "}
              {usd(shell.kdkNet)} — not {usd(shell.publishedList * (1 - shell.rate))}.
            </p>
          ) : commissionRate + 1e-9 < DEFAULT_COMMISSION ? (
            <p className="mt-3 rounded-md bg-paper-2 px-4 py-3 text-sm text-ink-soft">
              {pctLabel(commissionRate)} is under the 10% default, so KDK invoices more (
              {usd(shell.kdkNet)}) and the Government’s shell price stays {usd(shell.sellingList)}.
            </p>
          ) : null}

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-wide text-muted">
                  <th className="py-2 pr-3 font-medium">Style</th>
                  <th className="py-2 pr-3 font-medium">Qty</th>
                  <th className="py-2 pr-3 font-medium">Gov. pays / home</th>
                  <th className="py-2 pr-3 font-medium">KDK net / home</th>
                  <th className="py-2 font-medium">Margin</th>
                </tr>
              </thead>
              <tbody>
                {STYLE_LIST.map((s) => {
                  const row = heldNetShare(s.factoryList, commissionRate);
                  return (
                    <tr key={s.id} className="border-b border-line/70">
                      <td className="py-2 pr-3 font-medium">{s.name}</td>
                      <td className="py-2 pr-3 tabular">{mix[s.id]}</td>
                      <td className="py-2 pr-3 tabular">{usd(row.sellingList)}</td>
                      <td className="py-2 pr-3 tabular">{usd(row.kdkNet)}</td>
                      <td className="py-2 tabular">{usd(row.share * mix[s.id])}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td className="py-2 pr-3 font-semibold" colSpan={2}>
                    100 homes at {pctLabel(commissionRate)}
                  </td>
                  <td className="py-2 pr-3 font-display text-lg font-semibold tabular">
                    {usd(shell.sellingList)}
                  </td>
                  <td className="py-2 pr-3 font-display text-lg font-semibold tabular">
                    {usd(shell.kdkNet)}
                  </td>
                  <td className="py-2 font-display text-lg font-semibold tabular">
                    {usd(shell.share)}
                  </td>
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
                The Government pays KDK{" "}
                <strong className="text-ink">{usd(shell.kdkNet)}</strong> for the shells. That net
                does not fall when the percentage goes above 10%. A higher percentage is a larger
                discount off a higher sticker — not a cheaper invoice.
              </p>
            </div>
            <div className="rounded-lg bg-kdk/10 px-4 py-4 text-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-kdk">
                Buy through a Belizean distributor
              </p>
              <p className="mt-1 text-ink-soft">
                The Government pays{" "}
                <strong className="text-ink">{usd(shell.sellingList)}</strong> for the shells. The
                distributor keeps <strong className="text-ink">{usd(shell.share)}</strong>. KDK
                still invoices {usd(shell.kdkNet)}.
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