import { useVillage } from "@/lib/store";
import { STYLES } from "@/lib/data/homes";
import { computeTotals } from "@/lib/data/boq";
import { usd } from "@/lib/utils";
import { FloorPlan } from "@/components/catalog/FloorPlan";

export function LotPanel() {
  const lots = useVillage((s) => s.lots);
  const hovered = useVillage((s) => s.hovered);
  const selected = useVillage((s) => s.selected);
  const mix = useVillage((s) => s.mix);
  const commissionRate = useVillage((s) => s.commissionRate);
  const id = selected ?? hovered;
  const lot = lots.find((l) => l.id === id);
  const totals = computeTotals(mix, { commissionRate });

  if (!lot) {
    return (
      <div className="rounded-[18px] bg-paper p-4 shadow-card">
        <p className="font-display text-lg font-semibold">Hover a lot</p>
        <p className="mt-1 text-sm text-ink-soft">
          One hundred quarter-acre lots. Scroll the plat or the 3D model — each pad is a finished
          (unfurnished) home with kitchen, toilet, shower, split air and solar PV + inverter. No
          battery storage.
        </p>
      </div>
    );
  }

  const s = STYLES[lot.styleId];
  const village = totals.perStyleVillage[lot.styleId];
  const house = totals.perStyleHouse[lot.styleId];
  const ffe = totals.perStyleFfe[lot.styleId];
  const solar = totals.perStyleSolar[lot.styleId];

  return (
    <div className="overflow-hidden rounded-[18px] bg-paper shadow-card">
      <img
        src={s.image}
        alt={s.name}
        className="h-36 w-full object-cover outline outline-1 -outline-offset-1 outline-ink/10"
      />
      <div className="p-4">
        <p className="text-[11px] uppercase tracking-wide text-muted">
          {lot.label} · {s.beds}-bed
        </p>
        <h3 className="font-display text-xl font-semibold tracking-tight">
          {s.name}{" "}
          <span className="text-ink-soft">
            {s.beds}BR / {s.baths}BA
          </span>
        </h3>
        <p className="mt-1 text-sm text-ink-soft">
          {s.areaM2} m² / {s.areaSf} sf · {s.look}
        </p>
        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-muted">House package</dt>
            <dd className="font-medium tabular">{usd(house)}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-muted">Village all-in</dt>
            <dd className="font-medium tabular">{usd(village)}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-muted">PV modules</dt>
            <dd>
              {s.solarPanels} × {s.panelWatt} W · {usd(solar.pv)}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-muted">Inverter</dt>
            <dd>
              {s.inverterKw} kW grid-tie · {usd(solar.inverter)}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-muted">Battery</dt>
            <dd>Not included</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-muted">Split air</dt>
            <dd>{s.acBtu}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-muted">Install labour</dt>
            <dd>
              {s.assembleHours} hrs / {s.assembleDays} days assembly. Solar hours TBD.
            </dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-muted">FF&E (optional)</dt>
            <dd className="tabular">{usd(ffe)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-muted">{s.notes}</p>
      </div>
      <FloorPlan styleId={lot.styleId} compact />
    </div>
  );
}
