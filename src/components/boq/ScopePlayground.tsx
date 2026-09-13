import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MixControls } from "@/components/site/MixControls";
import { computeTotals } from "@/lib/data/boq";
import {
  PRESETS,
  SCOPES,
  pricingCopy,
  type PricingMode,
  type ScopeId,
} from "@/lib/data/scopes";
import { useVillage } from "@/lib/store";
import { cn, usd } from "@/lib/utils";

const MODES: PricingMode[] = ["kdk_net", "gov_via_partner"];

export function ScopePlayground() {
  const mix = useVillage((s) => s.mix);
  const offScopes = useVillage((s) => s.offScopes);
  const offItems = useVillage((s) => s.offItems);
  const pricingMode = useVillage((s) => s.pricingMode);
  const presetId = useVillage((s) => s.presetId);
  const toggleScope = useVillage((s) => s.toggleScope);
  const applyPreset = useVillage((s) => s.applyPreset);
  const setPricingMode = useVillage((s) => s.setPricingMode);
  const reset = useVillage((s) => s.reset);

  const totals = computeTotals(mix, { offScopes, offItems, pricingMode });
  const ffeOn = !offScopes.includes("ffe");

  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-xl bg-kdk px-5 py-5 text-kdk-fg shadow-card">
          <p className="text-[11px] uppercase tracking-[0.16em] text-kdk-fg/70">
            {presetId === "homes"
              ? "Homes only · FOB China port · no ocean · no inland"
              : "Selected all-in · 100 homes · unfurnished"}
          </p>
          <p className="mt-1 font-display text-4xl font-semibold tabular tracking-tight md:text-5xl">
            {usd(totals.unfurnishedAllIn)}
          </p>
          <p className="mt-2 text-sm text-kdk-fg/85">
            {totals.savingsVsFull > 0 ? (
              <>
                {usd(totals.savingsVsFull)} lower than the full unfurnished village (
                {usd(totals.fullUnfurnishedAllIn)}).
              </>
            ) : (
              <>Full unfurnished village — {usd(totals.fullUnfurnishedAllIn)}.</>
            )}
            {ffeOn ? ` Plus FF&E ${usd(totals.ffe)} → ${usd(totals.furnishedAllIn)} furnished.` : ""}
          </p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            <Mini k="Works" v={usd(totals.unfurnishedWorks)} />
            <Mini k="On-costs" v={usd(totals.contingency + totals.pm)} />
            <Mini k="Hidden / off" v={usd(totals.hiddenWorks)} />
          </dl>
        </div>
        <MixControls />
      </div>

      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted">Presets</p>
            <h2 className="font-display text-2xl font-semibold">What is KDK hired to do?</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => reset()}>
            <RotateCcw className="size-4" />
            Reset village
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {PRESETS.map((p) => {
            const active = presetId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                className={cn(
                  "min-h-11 rounded-lg px-4 py-4 text-left shadow-card transition-colors duration-150",
                  active ? "bg-kdk text-kdk-fg" : "bg-paper hover:bg-paper-2",
                )}
              >
                <span className="block font-display text-lg font-semibold">{p.label}</span>
                {p.kicker ? (
                  <span
                    className={cn(
                      "mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]",
                      active ? "bg-kdk-fg/15 text-kdk-fg" : "bg-kdk/10 text-kdk",
                    )}
                  >
                    {p.kicker}
                  </span>
                ) : null}
                <span className={cn("mt-1 block text-sm", active ? "text-kdk-fg/80" : "text-ink-soft")}>
                  {p.blurb}
                </span>
                {p.pending ? (
                  <span className={cn("mt-2 block text-xs", active ? "text-kdk-fg/75" : "text-muted")}>
                    {p.pending}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        {presetId === "homes" ? (
          <div className="mt-4 rounded-lg border border-kdk/30 bg-paper-2 px-4 py-4 text-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-kdk">
              Homes only = FOB China port
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-soft">
              <li>
                <strong className="text-ink">Not included:</strong> ocean freight, Belize inland,
                duties, slabs, set, solar, village works.
              </li>
              <li>
                The Government (or its forwarder) picks up at the{" "}
                <strong className="text-ink">China port</strong> and pays its own shipping.
              </li>
              <li>
                <strong className="text-ink">To confirm:</strong> kitchen, bath (toilet + shower), and
                split air — whether they travel with Homes only or are added later. Price not
                changed until that is decided.
              </li>
            </ul>
          </div>
        ) : null}
      </section>

      <section>
        <p className="text-[11px] uppercase tracking-wide text-muted">Who sells to the Government</p>
        <h2 className="font-display text-2xl font-semibold">Hong Kong KDK, or a licensed Belizean distributor</h2>
        <p className="mt-1 max-w-3xl text-sm text-ink-soft">
          Each of the three models is 10% off factory list on a 100-home order. That 10% is how a
          licensed Belizean company can be the seller to the Government — if the Government prefers
          to buy from a Belizean entity rather than from KDK Technology Ltd (Hong Kong). The 10% is
          on the homes only, not on slabs, MEP, or village works.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {MODES.map((m) => {
            const copy = pricingCopy(m);
            const active = pricingMode === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setPricingMode(m)}
                className={cn(
                  "min-h-11 rounded-lg px-4 py-4 text-left shadow-card transition-colors duration-150",
                  active ? "bg-kdk-deep text-kdk-fg" : "bg-paper hover:bg-paper-2",
                )}
              >
                <span className="block font-display text-lg font-semibold">{copy.label}</span>
                <span className={cn("mt-1 block text-sm", active ? "text-kdk-fg/80" : "text-ink-soft")}>
                  {copy.blurb}
                </span>
              </button>
            );
          })}
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat k="Factory list (homes)" v={usd(totals.factoryList)} />
          <Stat k="KDK invoices (net)" v={usd(totals.kdkNetHomes)} />
          <Stat k="Belizean distributor 10%" v={usd(totals.partnerMargin)} />
          <Stat
            k={
              pricingMode === "gov_via_partner"
                ? "Government pays the Belizean seller"
                : "Government pays KDK Hong Kong"
            }
            v={usd(totals.unfurnishedAllIn)}
          />
        </dl>
        {pricingMode === "gov_via_partner" ? (
          <p className="mt-3 rounded-md bg-paper-2 px-4 py-3 text-sm text-ink-soft">
            Contract path: Government ↔ licensed Belizean distributor ↔ KDK Hong Kong. KDK invoices
            the distributor {usd(totals.kdkInvoice)} (homes at net, same switched-on scopes). The
            Government pays the Belizean seller {usd(totals.govPay)}. The difference{" "}
            {usd(totals.govPay - totals.kdkInvoice)} is the distributor’s 10% on the homes.
          </p>
        ) : (
          <p className="mt-3 rounded-md bg-paper-2 px-4 py-3 text-sm text-ink-soft">
            Contract path: Government ↔ KDK Technology Ltd (Hong Kong). The Government pays KDK the
            distributor net. No Belizean seller is in the chain, so that 10% is a campaign discount
            rather than a local margin.
          </p>
        )}
      </section>

      <section>
        <p className="text-[11px] uppercase tracking-wide text-muted">Packages</p>
        <h2 className="font-display text-2xl font-semibold">Tap a scope to hide it</h2>
        <p className="mt-1 max-w-3xl text-sm text-ink-soft">
          Off = that package is not in KDK’s price. The all-in above drops by that amount (plus
          on-costs if they are on). Labour hours stay TBD.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {SCOPES.map((scope) => (
            <ScopeCard
              key={scope.id}
              scope={scope.id}
              on={!offScopes.includes(scope.id)}
              amount={totals.byScope.find((s) => s.id === scope.id)?.fullAmount ?? 0}
              onToggle={() => toggleScope(scope.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function ScopeCard({
  scope,
  on,
  amount,
  onToggle,
}: {
  scope: ScopeId;
  on: boolean;
  amount: number;
  onToggle: () => void;
}) {
  const def = SCOPES.find((s) => s.id === scope);
  if (!def) return null;
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex min-h-11 items-start gap-3 rounded-lg px-4 py-4 text-left shadow-card transition-colors duration-150",
        on ? "bg-paper hover:bg-paper-2" : "bg-tbd/10 text-muted",
      )}
    >
      <span
        className={cn(
          "mt-0.5 grid size-9 shrink-0 place-items-center rounded-sm",
          on ? "bg-kdk text-kdk-fg" : "bg-paper-2 text-muted",
        )}
      >
        {on ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-3">
          <span className={cn("font-medium", !on && "line-through")}>{def.label}</span>
          <span className="shrink-0 font-display tabular">
            {scope === "oncosts" ? (on ? "on" : "off") : amount ? usd(amount) : "—"}
          </span>
        </span>
        <span className="mt-1 block text-sm text-ink-soft">{def.blurb}</span>
        {!on && amount > 0 && (
          <span className="mt-1 block text-sm text-warn">Hidden — all-in is {usd(amount)} lower on works.</span>
        )}
      </span>
    </button>
  );
}

function Mini({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md bg-kdk-fg/10 px-3 py-3">
      <dt className="text-[11px] uppercase tracking-wide text-kdk-fg/70">{k}</dt>
      <dd className="mt-1 font-display text-xl font-semibold tabular">{v}</dd>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg bg-paper px-4 py-4 shadow-card">
      <dt className="text-[11px] uppercase tracking-wide text-muted">{k}</dt>
      <dd className="mt-1 font-display text-2xl font-semibold tabular">{v}</dd>
    </div>
  );
}
