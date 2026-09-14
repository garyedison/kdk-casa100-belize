import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { MOONLIGHT, computeTotals } from "@/lib/data/boq";
import { STYLES } from "@/lib/data/homes";
import { useVillage } from "@/lib/store";
import { usd } from "@/lib/utils";

export const Route = createFileRoute("/compare")({ component: ComparePage });

function ComparePage() {
  const mix = useVillage((s) => s.mix);
  const totals = computeTotals(mix);
  const cottage = STYLES.br2;
  const casaHouse = totals.perStyleHouse.br2;
  const casaVillage = totals.perStyleVillage.br2;

  const mbLines = [
    ["List price (working vs campaign)", usd(MOONLIGHT.factoryWorking), usd(cottage.volumeRate)],
    ["Ocean freight / home", usd(MOONLIGHT.freight), usd(cottage.freightPerHome)],
    ["Inland + duties", usd(MOONLIGHT.inland), usd(3200)],
    ["Slab + excavation + MEP", usd(MOONLIGHT.slab), usd(12500)],
    ["Hurricane anchoring", usd(MOONLIGHT.hurricane), usd(1800)],
    ["Crane", usd(MOONLIGHT.crane), usd(800)],
    ["Split air", "not in base", usd(1800)],
    ["Solar PV modules", "not in base", usd(3400)],
    ["Hybrid inverter (grid-tie, no battery)", "not in base", usd(1800)],
    ["PV mounting & tie-in", "not in base", usd(300)],
    ["Battery storage", "not in base", "not included"],
    ["Interior / lights / appliances", "in the module + TBD", "priced in Div 07–08"],
    ["Village infrastructure share", "n/a (2 private lots)", usd(totals.siteSharePerHome)],
    ["Contingency", usd(MOONLIGHT.contingency) + " flat", "8% of works"],
    ["Labour / deck / FF&E", "TBD", "labour TBD; no luxury deck"],
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-[1100px] px-4 py-8 md:px-6">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
          Why this BOQ is not Moonlight Bay
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Two homes on the lagoon vs a hundred for the state
        </h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Moonlight Bay lots 127 & 115 were a two-unit waterfront enquiry against the 2-bed cottage,
          with a $20,000 slab, $20,000 flat contingency and luxury deck left TBD. CASA 100 is a
          government campaign on a square ¼-acre plat: volume list, shared kit, village electrical
          and plumbing taken from the RTOAC scope list, and solar + split air in the unfurnished
          price.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <figure className="rounded-[18px] bg-paper-2 p-5 shadow-card">
            <p className="text-[11px] uppercase tracking-wide text-muted">Moonlight Bay</p>
            <p className="font-display text-2xl font-semibold">2 × Hip Cottage</p>
            <p className="mt-2 text-sm text-ink-soft">{MOONLIGHT.name}</p>
            <p className="mt-4 font-display text-3xl tabular">{usd(MOONLIGHT.allInExTbd)}</p>
            <p className="text-xs text-muted">all-in per home, excl. deck / labour / FF&E / solar</p>
          </figure>
          <figure className="rounded-[18px] bg-kdk p-5 text-kdk-fg shadow-card">
            <p className="text-[11px] uppercase tracking-wide text-kdk-fg/70">CASA 100 · 2-bed</p>
            <p className="font-display text-2xl font-semibold">100 × mix · 2-bed</p>
            <p className="mt-2 text-sm text-kdk-fg/80">
              House package {usd(casaHouse)} · village all-in {usd(casaVillage)}
            </p>
            <p className="mt-4 font-display text-3xl tabular">{usd(casaVillage)}</p>
            <p className="text-xs text-kdk-fg/70">
              per 2-bed including pro-rata roads, power, water, WWTP, solar and split air
            </p>
          </figure>
        </div>

        <div className="mt-8 overflow-x-auto rounded-[18px] bg-paper shadow-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-kdk text-kdk-fg">
              <tr className="text-[11px] uppercase tracking-wide">
                <th className="px-4 py-3 font-medium">Line</th>
                <th className="px-4 py-3 font-medium">Moonlight Bay / home</th>
                <th className="px-4 py-3 font-medium">CASA 100 2-bed / home</th>
              </tr>
            </thead>
            <tbody>
              {mbLines.map(([k, a, b]) => (
                <tr key={k} className="border-t border-line">
                  <td className="px-4 py-2.5">{k}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{a}</td>
                  <td className="px-4 py-2.5 font-medium">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-[18px] bg-paper-2 p-5 shadow-card">
            <h2 className="font-display text-xl font-semibold">What CASA 100 adds</h2>
            <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-ink-soft">
              <li>Split air, rooftop PV modules and a grid-tie inverter on every pad</li>
              <li>No battery storage in the unfurnished price</li>
              <li>Village electrical (RTOAC Div o, scaled to dwellings)</li>
              <li>Water loop, WWTP, laterals</li>
              <li>Avenues, drainage, gatehouse, civic pavilion</li>
              <li>8% contingency instead of $20k flat</li>
              <li>10% distributor net on 100 units</li>
            </ul>
          </div>
          <div className="rounded-[18px] bg-paper-2 p-5 shadow-card">
            <h2 className="font-display text-xl font-semibold">What we still hold TBD</h2>
            <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-ink-soft">
              <li>11.01 Module assembly — 80 hrs / 8 days on the 2-bed at US$28/hr (US$2,240). Crew 80% Belizean.</li>
              <li>11.02 Solar install — $19.40/hr EST. (70% Belizean electrician / 30% China PV); hours TBD</li>
              <li>Belizean standing crew for 12 months or longer; Chinese cadre trains then stands down</li>
              <li>11.03 China technician attendance (days)</li>
              <li>11.05 Duration — solar install (days)</li>
              <li>11.06 FF&E install labour</li>
              <li>Battery storage behind the PV arrays (excluded from this BOQ)</li>
              <li>Belize duty/GST confirmation with broker</li>
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
