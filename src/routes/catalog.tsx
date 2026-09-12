import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { STYLE_LIST } from "@/lib/data/homes";
import { computeTotals } from "@/lib/data/boq";
import { useVillage } from "@/lib/store";
import { usd, num } from "@/lib/utils";
import { FloorPlan } from "@/components/catalog/FloorPlan";

export const Route = createFileRoute("/catalog")({ component: CatalogPage });

function CatalogPage() {
  const mix = useVillage((s) => s.mix);
  const totals = computeTotals(mix);

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-6">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
          Factory catalog · Popular design price list 7 Sep 2026
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Three styles under 100 m²
        </h1>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Taken from the attached factory file. Kitchen, toilet and shower ship in the module.
          Split air, rooftop PV modules and a grid-tie inverter are added in the Belize BOQ as
          equipment. Solar install labour and container-on-pad labour are TBD — rates next week.
          Battery storage is not included. Furniture is not.
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
                      {s.itemNo} · factory {s.code}
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
                      <Row k="Factory list" v={usd(s.factoryList)} />
                      <Row k="Volume rate (−10%)" v={usd(s.volumeRate)} />
                      <Row k="Freight / home" v={usd(s.freightPerHome)} />
                      <Row k="Units per 40HQ" v={String(s.unitsPer40hq)} />
                      <Row k="PV modules" v={`${s.solarPanels} × ${s.panelWatt} W (${s.solarKw} kW)`} />
                      <Row k="Inverter" v={`${s.inverterKw} kW grid-tie`} />
                      <Row k="Battery" v="Not included" />
                      <Row k="Split air" v={s.acBtu} />
                      <Row k="Solar equipment (PV + inverter + rails)" v={usd(solar.kit)} />
                      <Row k="Solar install labour" v="TBD next week" />
                      <Row k="House package" v={usd(totals.perStyleHouse[s.id])} />
                      <Row k="Village all-in" v={usd(totals.perStyleVillage[s.id])} />
                      <Row k="FF&E upgrade" v={usd(totals.perStyleFfe[s.id])} />
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
    <div className="rounded-[12px] bg-paper-2 px-3 py-2">
      <dt className="text-[11px] uppercase tracking-wide text-muted">{k}</dt>
      <dd className="font-medium tabular">{v}</dd>
    </div>
  );
}
