import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { STYLE_LIST } from "@/lib/data/homes";
import { computeTotals } from "@/lib/data/boq";
import { SHELL_BLURB, SHELL_IN, SHELL_OUT, FACTORY_VS_LOCAL } from "@/lib/data/shell";
import { offScopesForPreset } from "@/lib/data/scopes";
import { useVillage } from "@/lib/store";
import { usd, num } from "@/lib/utils";
import { FloorPlan } from "@/components/catalog/FloorPlan";

export const Route = createFileRoute("/catalog")({ component: CatalogPage });

function CatalogPage() {
  const mix = useVillage((s) => s.mix);
  const commissionRate = useVillage((s) => s.commissionRate);
  const totals = computeTotals(mix, {
    commissionRate,
    offScopes: offScopesForPreset("village"),
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-6">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
          Catalog · basic shell · three styles under 100 m²
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Basic shell — what ships in the box
        </h1>
        <p className="mt-2 max-w-3xl text-ink-soft">{SHELL_BLURB}</p>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[18px] bg-paper p-5 shadow-card">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-kdk">
              In the shell price (FOB China)
            </p>
            {SHELL_IN.map((g) => (
              <div key={g.group} className="mt-4">
                <h2 className="font-display text-lg font-semibold">{g.group}</h2>
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-ink-soft">
                  {g.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="rounded-[18px] bg-paper-2 p-5 shadow-card">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              Not in the shell — Belize add-ons
            </p>
            {SHELL_OUT.map((g) => (
              <div key={g.group} className="mt-4">
                <h2 className="font-display text-lg font-semibold">{g.group}</h2>
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-ink-soft">
                  {g.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-[18px] bg-kdk px-5 py-5 text-kdk-fg shadow-card">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-kdk-fg/70">
              Factory-finished (in the box)
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-kdk-fg/90">
              {FACTORY_VS_LOCAL.factory.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-[18px] bg-paper-2 px-5 py-5 shadow-card">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-kdk">
              Completed in Belize (BOQ add-ons)
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
              {FACTORY_VS_LOCAL.belize.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </div>

        <h2 className="mt-12 font-display text-2xl font-semibold">The three styles</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Same shell kit on every home. Split air, solar equipment, range and fridge are Belize
          lines. Assembly hours (42 / 80 / 80) are quoted if KDK sets the box — not in Homes only.
          Solar install hours are estimated. Battery and furniture are not included.
        </p>

        <div className="mt-8 space-y-14">
          {STYLE_LIST.map((s) => {
            const solar = totals.perStyleSolar[s.id];
            return (
              <article key={s.id} className="space-y-4">
                <div className="grid overflow-hidden rounded-[22px] bg-paper shadow-card lg:grid-cols-2">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="h-full min-h-[260px] w-full object-cover outline outline-1 -outline-offset-1 outline-ink/10"
                  />
                  <div className="p-6 md:p-8">
                    <p className="text-[11px] uppercase tracking-wide text-muted">
                      {s.beds}-bed · basic shell · {s.look}
                    </p>
                    <h2 className="font-display text-3xl font-semibold">{s.name}</h2>
                    <p className="text-ink-soft">
                      {s.beds} bedroom / {s.baths} bath · {s.areaM2} m² ({num(s.areaSf)} sf) · {s.story}{" "}
                      · {s.look}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {s.rooms.map((r) => (
                        <li
                          key={r}
                          className="rounded-full bg-paper-2 px-2.5 py-1 text-[11px] text-ink-soft"
                        >
                          {r}
                        </li>
                      ))}
                    </ul>
                    <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <Row k="Shell list (FOB China)" v={usd(s.factoryList)} />
                      <Row
                        k={`Net after ${Math.round(commissionRate * 100)}% volume discount`}
                        v={usd(s.factoryList * (1 - commissionRate))}
                      />
                      <Row k="Kitchen / bath in shell" v="Yes — cabinet, sink, toilet, shower" />
                      <Row k="Range / fridge in shell" v="No — Belize add-on" />
                      <Row k="Split air in shell" v="No — Belize add-on" />
                      <Row k="Solar in shell" v="No — Belize add-on" />
                      <Row k="Units per 40HQ" v={String(s.unitsPer40hq)} />
                      <Row k="Freight / home (if landed)" v={usd(s.freightPerHome)} />
                      <Row k="PV modules (add-on)" v={`${s.solarPanels} × ${s.panelWatt} W (${s.solarKw} kW)`} />
                      <Row k="Inverter (add-on)" v={`${s.inverterKw} kW grid-tie · no battery`} />
                      <Row k="Split air (add-on)" v={s.acBtu} />
                      <Row k="Solar equipment (add-on)" v={usd(solar.kit)} />
                      <Row k="Assembly if KDK sets" v={`${s.assembleHours} hrs · ${s.assembleDays} days`} />
                      <Row k="Solar install labour" v="Hours TBD" />
                      <Row k="House package (landed+pads+MEP+solar)" v={usd(totals.perStyleHouse[s.id])} />
                      <Row k="Village all-in (no extra civil)" v={usd(totals.perStyleVillage[s.id])} />
                    </dl>
                    <p className="mt-4 text-sm text-ink-soft">{s.notes}</p>
                  </div>
                </div>
                <FloorPlan styleId={s.id} />
              </article>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-muted">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}
