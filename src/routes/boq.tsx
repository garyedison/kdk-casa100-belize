import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { computeTotals, CONTINGENCY_RATE, PM_RATE, type PricedLine } from "@/lib/data/boq";
import { ALL_IN, ASSEMBLY, CHINA_CREW, EMPLOYMENT, LABOUR_NOTES, SOLAR_INSTALL } from "@/lib/data/labour";
import { STYLE_LIST, type StyleId } from "@/lib/data/homes";
import { useVillage } from "@/lib/store";
import { usd, num } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { MixControls } from "@/components/site/MixControls";
import { FloorPlanStrip } from "@/components/catalog/FloorPlan";
import { ChinaCrewCard } from "@/components/boq/ChinaCrewCard";

export const Route = createFileRoute("/boq")({ component: BoqPage });

function rateLabel(line: PricedLine, id: StyleId) {
  if (line.status === "EXCL.") return "excl.";
  if (line.lump) return "—";
  const r = typeof line.rate === "number" ? line.rate : line.rate[id];
  if (line.tbd) {
    if (r > 0) return `${usd(r, 2)} EST.`;
    return "TBD";
  }
  if (r === 0 && line.status === "INCL.") return "incl.";
  return usd(r);
}

function amtLabel(line: PricedLine, id: StyleId) {
  if (line.status === "EXCL.") return "excl.";
  if (line.tbd) return "TBD";
  if (line.lump) return "—";
  return usd(line.amount[id]);
}

function BoqPage() {
  const mix = useVillage((s) => s.mix);
  const offScopes = useVillage((s) => s.offScopes);
  const offItems = useVillage((s) => s.offItems);
  const pricingMode = useVillage((s) => s.pricingMode);
  const commissionRate = useVillage((s) => s.commissionRate);
  const toggleItem = useVillage((s) => s.toggleItem);
  const totals = computeTotals(mix, { offScopes, offItems, pricingMode, commissionRate });
  const ids: StyleId[] = ["br1", "br2", "br3"];

  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-6">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
          Priced bill of quantities · CASA 100 · draft
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Government village BOQ
        </h1>
        <p className="mt-2 max-w-3xl text-ink-soft">
          Hide a line to drop it from this playground total. Header always shows Installed homes
          and Turnkey village. Module assembly (Div 11.01) is 42 / 80 / 80 hrs at $280/worker-day.
          Solar install hours are estimated. Government volume discount (default 10% of shell list)
          can be modelled on Scopes.
        </p>
        <p className="mt-3 text-sm">
          <a
            href="/CASA100_BOQ_worksheet.xlsx"
            download
            className="text-kdk underline-offset-4 hover:underline"
          >
            Download the BOQ worksheet (Excel)
          </a>
          <span className="text-muted"> — 11.01 vs 4-worker China crew, line-by-line, shell vs add-ons.</span>
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat k="Works (this playground)" v={usd(totals.unfurnishedWorks)} />
            <Stat k={`Contingency ${CONTINGENCY_RATE * 100}%`} v={usd(totals.contingency)} />
            <Stat k={`PM ${PM_RATE * 100}%`} v={usd(totals.pm)} />
            <Stat k="All-in (this playground)" v={usd(totals.unfurnishedAllIn)} />
            <Stat k="FF&E upgrade" v={usd(totals.ffe)} />
            <Stat k="Furnished all-in" v={usd(totals.furnishedAllIn)} />
            <Stat k="Hidden works" v={usd(totals.hiddenWorks)} />
            <Stat k="vs all scopes on" v={`−${usd(totals.savingsVsFull)}`} />
          </div>
          <MixControls />
        </div>

        <section className="mt-6 rounded-[18px] bg-kdk px-5 py-5 text-kdk-fg shadow-card">
          <p className="text-[11px] uppercase tracking-[0.16em] text-kdk-fg/70">
            Local employment · recommended mix
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold">
            Belizeans on the payroll for {EMPLOYMENT.campaignSpan}
          </h2>
          <p className="mt-2 max-w-4xl text-sm text-kdk-fg/90">{EMPLOYMENT.pledge}</p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-kdk-fg/10 px-3 py-3">
              <dt className="text-[11px] uppercase tracking-wide text-kdk-fg/70">Standing crew</dt>
              <dd className="mt-1 font-display text-xl font-semibold">
                {EMPLOYMENT.concurrentBelizeJobs} Belizeans
              </dd>
              <p className="mt-1 text-[11px] text-kdk-fg/75">Concurrent, full campaign</p>
            </div>
            <div className="rounded-xl bg-kdk-fg/10 px-3 py-3">
              <dt className="text-[11px] uppercase tracking-wide text-kdk-fg/70">Chinese cadre</dt>
              <dd className="mt-1 font-display text-xl font-semibold">Train, then stand down</dd>
              <p className="mt-1 text-[11px] text-kdk-fg/75">{EMPLOYMENT.chineseCadre}</p>
            </div>
            <div className="rounded-xl bg-kdk-fg/10 px-3 py-3">
              <dt className="text-[11px] uppercase tracking-wide text-kdk-fg/70">Village civil</dt>
              <dd className="mt-1 font-display text-xl font-semibold">
                {EMPLOYMENT.village.belizePct}% Belizean
              </dd>
              <p className="mt-1 text-[11px] text-kdk-fg/75">{EMPLOYMENT.village.note}</p>
            </div>
          </dl>
        </section>

        <section className="mt-8">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted">Division 04 · solar kit</p>
              <h2 className="font-display text-2xl font-semibold">Panels and inverters, priced apart</h2>
            </div>
            <p className="max-w-xl text-sm text-ink-soft">
              Equipment only — panels, inverter, rails. No battery. Install labour sits on the line
              below at {usd(EMPLOYMENT.solar.rate, 2)}/hr EST., {EMPLOYMENT.solar.belizePct}% Belizean
              electricians.
            </p>
          </div>
          <div className="overflow-x-auto rounded-[18px] bg-paper shadow-card">
            <table className="min-w-[720px] w-full text-left text-sm">
              <thead className="bg-kdk text-kdk-fg">
                <tr className="text-[11px] uppercase tracking-wide">
                  <th className="px-3 py-3 font-medium">Kit</th>
                  {STYLE_LIST.map((s) => (
                    <th key={s.id} className="px-3 py-3 font-medium">
                      {s.short}
                      <span className="block font-normal normal-case opacity-80">
                        {s.solarKw} kW · {s.solarPanels} × {s.panelWatt} W
                      </span>
                    </th>
                  ))}
                  <th className="px-3 py-3 font-medium">Project</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-line">
                  <td className="px-3 py-2">04.02 Solar PV modules</td>
                  {ids.map((id) => (
                    <td key={id} className="px-3 py-2 tabular">
                      {usd(totals.perStyleSolar[id].pv)}
                    </td>
                  ))}
                  <td className="px-3 py-2 font-medium tabular">{usd(totals.solarProject.pv)}</td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-3 py-2">04.03 Hybrid inverter (grid-tie)</td>
                  {ids.map((id) => (
                    <td key={id} className="px-3 py-2 tabular">
                      {usd(totals.perStyleSolar[id].inverter)}
                    </td>
                  ))}
                  <td className="px-3 py-2 font-medium tabular">{usd(totals.solarProject.inverter)}</td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-3 py-2">04.04 Mounting hardware (materials)</td>
                  {ids.map((id) => (
                    <td key={id} className="px-3 py-2 tabular">
                      {usd(totals.perStyleSolar[id].mount)}
                    </td>
                  ))}
                  <td className="px-3 py-2 font-medium tabular">{usd(totals.solarProject.mount)}</td>
                </tr>
                <tr className="border-t-2 border-kdk bg-paper-2">
                  <td className="px-3 py-2 font-medium">Solar equipment / home (no battery, no labour)</td>
                  {ids.map((id) => (
                    <td key={id} className="px-3 py-2 tabular font-medium">
                      {usd(totals.perStyleSolar[id].kit)}
                    </td>
                  ))}
                  <td className="px-3 py-2 font-medium tabular">{usd(totals.solarProject.kit)}</td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-3 py-2">
                    <span className="font-medium">
                      {EMPLOYMENT.solar.item} {EMPLOYMENT.solar.title} — ESTIMATED
                    </span>
                    <span className="mt-1 block text-[11px] text-muted">
                      Not in the kit. {SOLAR_INSTALL.hours.br1} / {SOLAR_INSTALL.hours.br2} /{" "}
                      {SOLAR_INSTALL.hours.br3} hrs ESTIMATED. Local quote in a few days. Mixed crew{" "}
                      {usd(SOLAR_INSTALL.hourly, 2)}/hr. Grid-tie — needs village power (Turnkey
                      village).
                    </span>
                    <MixBar belize={EMPLOYMENT.solar.belizePct} china={EMPLOYMENT.solar.chinaPct} />
                  </td>
                  {ids.map((id) => (
                    <td key={id} className="px-3 py-2 tabular">
                      <span className="block text-[11px] text-muted">
                        {SOLAR_INSTALL.hours[id]} hrs EST.
                      </span>
                      {usd(SOLAR_INSTALL.hourly, 2)}/hr
                    </td>
                  ))}
                  <td className="px-3 py-2 font-medium tabular">
                    {usd(
                      mix.br1 * SOLAR_INSTALL.hours.br1 * SOLAR_INSTALL.hourly +
                        mix.br2 * SOLAR_INSTALL.hours.br2 * SOLAR_INSTALL.hourly +
                        mix.br3 * SOLAR_INSTALL.hours.br3 * SOLAR_INSTALL.hourly,
                    )}
                  </td>
                </tr>
                <tr className="border-t border-line bg-tbd/10">
                  <td className="px-3 py-2" colSpan={4}>
                    04.05 Battery energy storage — <span className="font-medium">not included</span>.
                    Arrays are grid-tie only. Need village electrical (Turnkey village) or a later
                    battery. No LiFePO4 in this proposal.
                  </td>
                  <td className="px-3 py-2 font-medium">EXCL.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted">
                Division 03 + 11.01 · set on pad
              </p>
              <h2 className="font-display text-2xl font-semibold">Setting the container home on the pad</h2>
            </div>
            <p className="max-w-xl text-sm text-ink-soft">
              Crane 03.03 is plant hire only. The crew that assembles the module is 11.01 — supplier
              hours at {usd(ASSEMBLY.hourly)}/hr (US${ASSEMBLY.dayRate} per 10-hour day).{" "}
              {EMPLOYMENT.pad.belizePct}% Belizean structure crew for the full campaign.
            </p>
          </div>
          <div className="overflow-x-auto rounded-[18px] bg-paper shadow-card">
            <table className="min-w-[720px] w-full text-left text-sm">
              <thead className="bg-kdk text-kdk-fg">
                <tr className="text-[11px] uppercase tracking-wide">
                  <th className="px-3 py-3 font-medium">Item</th>
                  <th className="px-3 py-3 font-medium">Scope</th>
                  <th className="px-3 py-3 font-medium">Rate</th>
                  <th className="px-3 py-3 font-medium">Mix</th>
                  <th className="px-3 py-3 font-medium">Project</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-line">
                  <td className="px-3 py-2 font-mono text-xs">03.03</td>
                  <td className="px-3 py-2">
                    Crane campaign — plant hire
                    <span className="block text-[11px] text-muted">Shared crawler. Not crew time.</span>
                  </td>
                  <td className="px-3 py-2 tabular">{usd(800)} / home</td>
                  <td className="px-3 py-2 text-muted">Plant</td>
                  <td className="px-3 py-2 font-medium tabular">{usd(800 * totals.homeCount)}</td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-3 py-2 font-mono text-xs">{EMPLOYMENT.pad.item}</td>
                  <td className="px-3 py-2">
                    <span className="font-medium">{EMPLOYMENT.pad.title}</span>
                    <span className="mt-1 block text-[11px] text-muted">
                      Supplier assembly hours. Line is priced at {usd(ASSEMBLY.hourly)}/hr.{" "}
                      {EMPLOYMENT.pad.belizeCrew} standing; {EMPLOYMENT.pad.chinaCrew}.
                    </span>
                  </td>
                  <td className="px-3 py-2 tabular font-medium">{usd(ASSEMBLY.hourly)}/hr</td>
                  <td className="px-3 py-2">
                    <MixBar belize={EMPLOYMENT.pad.belizePct} china={EMPLOYMENT.pad.chinaPct} />
                  </td>
                  <td className="px-3 py-2 font-medium tabular">
                    {usd(
                      mix.br1 * ASSEMBLY.cost.br1 +
                        mix.br2 * ASSEMBLY.cost.br2 +
                        mix.br3 * ASSEMBLY.cost.br3,
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-8">
          <ChinaCrewCard />
        </div>

        <section className="mt-8">
          <div className="mb-3">
            <p className="text-[11px] uppercase tracking-wide text-muted">Division 11 · labour</p>
            <h2 className="font-display text-2xl font-semibold">
              Assembly hours quoted · solar hours ESTIMATED
            </h2>
            <p className="mt-1 max-w-3xl text-sm text-ink-soft">
              Module assembly at US${ASSEMBLY.dayRate}/worker-day — conservative if Belizean skilled
              labour is expensive. Solar install hours are estimated pending a local quote in a few
              days. {LABOUR_NOTES.burden} {LABOUR_NOTES.chinaOnSite}
            </p>
          </div>
          <div className="overflow-x-auto rounded-[18px] bg-paper shadow-card">
            <table className="min-w-[720px] w-full text-left text-sm">
              <thead className="bg-kdk-deep text-kdk-fg">
                <tr className="text-[11px] uppercase tracking-wide">
                  <th className="px-3 py-3 font-medium">Item</th>
                  <th className="px-3 py-3 font-medium">Scope</th>
                  <th className="px-3 py-3 font-medium">Unit</th>
                  <th className="px-3 py-3 font-medium">Man-hours</th>
                  <th className="px-3 py-3 font-medium">Rate</th>
                  <th className="px-3 py-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-line">
                  <td className="px-3 py-2 font-mono text-xs">11.01</td>
                  <td className="px-3 py-2">
                    Module assembly on the pad
                    <span className="block text-[11px] text-muted">
                      {EMPLOYMENT.pad.belizeCrew}. {EMPLOYMENT.pad.chinaRole}
                    </span>
                    <MixBar belize={EMPLOYMENT.pad.belizePct} china={EMPLOYMENT.pad.chinaPct} />
                  </td>
                  <td className="px-3 py-2 text-muted">hr / home</td>
                  <td className="px-3 py-2 tabular">
                    {ASSEMBLY.hours.br1} / {ASSEMBLY.hours.br2} / {ASSEMBLY.hours.br3}
                  </td>
                  <td className="px-3 py-2 tabular font-medium">{usd(ASSEMBLY.hourly)}</td>
                  <td className="px-3 py-2 font-medium tabular">
                    {usd(
                      mix.br1 * ASSEMBLY.cost.br1 +
                        mix.br2 * ASSEMBLY.cost.br2 +
                        mix.br3 * ASSEMBLY.cost.br3,
                    )}
                  </td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-3 py-2 font-mono text-xs">11.02</td>
                  <td className="px-3 py-2">
                    Solar PV + inverter install — ESTIMATED
                    <span className="block text-[11px] text-muted">
                      {EMPLOYMENT.solar.belizeCrew}. {EMPLOYMENT.solar.chinaRole} Local quote in a
                      few days.
                    </span>
                    <MixBar belize={EMPLOYMENT.solar.belizePct} china={EMPLOYMENT.solar.chinaPct} />
                  </td>
                  <td className="px-3 py-2 text-muted">hr / home</td>
                  <td className="px-3 py-2 tabular">
                    {SOLAR_INSTALL.hours.br1} / {SOLAR_INSTALL.hours.br2} / {SOLAR_INSTALL.hours.br3}
                  </td>
                  <td className="px-3 py-2 tabular font-medium">
                    {usd(SOLAR_INSTALL.hourly, 2)} EST.
                  </td>
                  <td className="px-3 py-2 font-medium tabular">
                    {usd(
                      mix.br1 * SOLAR_INSTALL.hours.br1 * SOLAR_INSTALL.hourly +
                        mix.br2 * SOLAR_INSTALL.hours.br2 * SOLAR_INSTALL.hourly +
                        mix.br3 * SOLAR_INSTALL.hours.br3 * SOLAR_INSTALL.hourly,
                    )}
                  </td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-3 py-2 font-mono text-xs">11.04</td>
                  <td className="px-3 py-2">Duration — module assembly on pad</td>
                  <td className="px-3 py-2 text-muted">day / home</td>
                  <td className="px-3 py-2 tabular">
                    {ASSEMBLY.days.br1} / {ASSEMBLY.days.br2} / {ASSEMBLY.days.br3}
                  </td>
                  <td className="px-3 py-2">—</td>
                  <td className="px-3 py-2 font-medium">in 11.01</td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-3 py-2 font-mono text-xs">11.03</td>
                  <td className="px-3 py-2">China technician mobilisation (travel)</td>
                  <td className="px-3 py-2 text-muted">ls</td>
                  <td className="px-3 py-2">1</td>
                  <td className="px-3 py-2">—</td>
                  <td className="px-3 py-2 font-medium tabular">{usd(CHINA_CREW.mobilize4)}</td>
                </tr>
                <tr className="border-t border-line">
                  <td className="px-3 py-2 font-mono text-xs">11.05</td>
                  <td className="px-3 py-2">Duration — solar install — ESTIMATED</td>
                  <td className="px-3 py-2 text-muted">day / home</td>
                  <td className="px-3 py-2 tabular">
                    {SOLAR_INSTALL.days.br1} / {SOLAR_INSTALL.days.br2} / {SOLAR_INSTALL.days.br3}
                  </td>
                  <td className="px-3 py-2">—</td>
                  <td className="px-3 py-2 font-medium">in 11.02</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 overflow-x-auto rounded-[18px] bg-paper shadow-card">
            <table className="min-w-[720px] w-full text-left text-sm">
              <thead className="bg-kdk text-kdk-fg">
                <tr className="text-[11px] uppercase tracking-wide">
                  <th className="px-3 py-3 font-medium">Trade</th>
                  <th className="px-3 py-3 font-medium">Belize all-in</th>
                  <th className="px-3 py-3 font-medium">Mixed crew</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(ALL_IN).map((g) => (
                  <tr key={g.id} className="border-t border-line">
                    <td className="px-3 py-2">
                      {g.label}
                      <span className="block text-[11px] text-muted">{g.mixNote}</span>
                    </td>
                    <td className="px-3 py-2 tabular font-medium">{usd(g.belizeAllIn, 2)}</td>
                    <td className="px-3 py-2 tabular font-medium">{usd(g.mixed, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-line px-3 py-2 text-[11px] text-muted">
              USD per hour, contractor all-in. Electrical and plumbing run above framing and
              concrete. {LABOUR_NOTES.shortage}
            </p>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted">Factory floor layouts</p>
              <h2 className="font-display text-2xl font-semibold">One, two and three bedroom</h2>
            </div>
            <Link to="/catalog" className="text-sm text-kdk underline-offset-4 hover:underline">
              Open the catalog
            </Link>
          </div>
          <FloorPlanStrip />
        </section>

        <div className="mt-8 overflow-x-auto rounded-[18px] bg-paper shadow-card">
          <table className="min-w-[1080px] w-full text-left text-sm">
            <thead className="sticky top-0 bg-kdk text-kdk-fg">
              <tr className="text-[11px] uppercase tracking-wide">
                <th className="px-3 py-3 font-medium">Item</th>
                <th className="px-3 py-3 font-medium">Description</th>
                <th className="px-3 py-3 font-medium">Unit</th>
                {STYLE_LIST.map((s) => (
                  <th key={s.id} className="px-3 py-3 font-medium">
                    {s.itemNo}
                    <span className="block font-normal normal-case opacity-80">
                      {s.short} × {mix[s.id]}
                    </span>
                  </th>
                ))}
                <th className="px-3 py-3 font-medium">Project</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">In price</th>
              </tr>
            </thead>
            <tbody>
              {totals.byDivision.map((div) => {
                const rows = totals.lines.filter((l) => l.divisionNo === div.no);
                return (
                  <DivisionBlock key={div.no} no={div.no} name={div.name} amount={div.amount} ffe={div.ffe} tbd={div.tbd}>
                    {rows.map((line) => (
                      <tr
                        key={line.item}
                        className={cn(
                          "border-t border-line",
                          line.status === "EXCL." && "bg-tbd/10",
                          line.tbd && line.status !== "EXCL." && "bg-tbd/10",
                          line.ffe && "bg-reef/8",
                          !line.included && "bg-tbd/10 text-muted",
                        )}
                      >
                        <td className="px-3 py-2 font-mono text-xs tabular">{line.item}</td>
                        <td className="px-3 py-2">
                          <span className={cn("block", !line.included && "line-through")}>
                            {line.description}
                          </span>
                          {line.note && (
                            <span className="block text-[11px] text-muted">{line.note}</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-muted">{line.unit}</td>
                        {ids.map((id) => (
                          <td key={id} className="px-3 py-2 tabular">
                            <span className="block text-[11px] text-muted">
                              {line.status === "EXCL."
                                ? "excl."
                                : line.tbd
                                  ? typeof line.rate === "number" && line.rate > 0
                                    ? `hrs TBD × ${rateLabel(line, id)}`
                                    : "TBD"
                                  : line.lump
                                    ? "—"
                                    : `${num(line.qty[id])} × ${rateLabel(line, id)}`}
                            </span>
                            {amtLabel(line, id)}
                          </td>
                        ))}
                        <td className="px-3 py-2 font-medium tabular">
                          {line.status === "EXCL."
                            ? "excl."
                            : line.tbd
                              ? "TBD"
                              : line.included
                                ? usd(line.projectAmount)
                                : "hidden"}
                          <span className="block text-[11px] font-normal text-muted">
                            {line.lump ? `qty ${num(line.projectQty)}` : ""}
                            {!line.included && line.fullAmount
                              ? ` was ${usd(line.fullAmount)}`
                              : ""}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <StatusChip status={line.status} />
                        </td>
                        <td className="px-3 py-2">
                          {line.status === "EXCL." ? (
                            <span className="text-[11px] text-muted">n/a</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => toggleItem(line.item)}
                              className="min-h-11 rounded-sm px-3 text-sm text-kdk hover:bg-paper-2"
                            >
                              {line.included ? "Hide" : "Show"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </DivisionBlock>
                );
              })}
              <tr className="border-t-2 border-kdk bg-paper-2">
                <td className="px-3 py-3" colSpan={3}>
                  Unfurnished works
                </td>
                {ids.map((id) => (
                  <td key={id} className="px-3 py-3 tabular font-medium">
                    {usd(totals.perStyleHouse[id])}
                    <span className="block text-[11px] font-normal text-muted">/ home package</span>
                  </td>
                ))}
                <td className="px-3 py-3 font-medium tabular">{usd(totals.unfurnishedWorks)}</td>
                <td />
                <td />
              </tr>
              <tr className="border-t border-line bg-paper-2">
                <td className="px-3 py-2" colSpan={6}>
                  Contingency {CONTINGENCY_RATE * 100}% on works in this playground
                </td>
                <td className="px-3 py-2 tabular">{usd(totals.contingency)}</td>
                <td />
                <td />
              </tr>
              <tr className="border-t border-line bg-paper-2">
                <td className="px-3 py-2" colSpan={6}>
                  Project management {PM_RATE * 100}%
                </td>
                <td className="px-3 py-2 tabular">{usd(totals.pm)}</td>
                <td />
                <td />
              </tr>
              <tr className="border-t-2 border-kdk bg-kdk text-kdk-fg">
                <td className="px-3 py-3 font-medium" colSpan={3}>
                  ALL-IN UNFURNISHED (this playground · solar labour ESTIMATED · no battery)
                </td>
                {ids.map((id) => (
                  <td key={id} className="px-3 py-3 tabular font-medium">
                    {usd(totals.perStyleVillage[id])}
                    <span className="block text-[11px] font-normal opacity-80">village / home</span>
                  </td>
                ))}
                <td className="px-3 py-3 font-medium tabular">{usd(totals.unfurnishedAllIn)}</td>
                <td />
                <td />
              </tr>
              <tr className="border-t border-line">
                <td className="px-3 py-3" colSpan={3}>
                  Plus FF&E (optional)
                </td>
                {ids.map((id) => (
                  <td key={id} className="px-3 py-3 tabular">
                    {usd(totals.perStyleFfe[id])}
                  </td>
                ))}
                <td className="px-3 py-3 tabular">{usd(totals.ffe)}</td>
                <td />
                <td />
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4 max-w-3xl text-xs text-muted">
          Status key: QUOTED = KDK list, freight, or pad assembly hours. EST. = campaign estimate
          (solar hours labelled ESTIMATED pending a local quote). INCL. = already inside the module
          or a parent lump. EXCL. = battery — not in this proposal. Div 13 preliminaries are $0 until
          the Belize subcontractor confirms. HS 9406.20 steel modular. Working draft — not a client
          contract.
        </p>
      </div>
    </AppShell>
  );
}

function DivisionBlock({
  no,
  name,
  amount,
  ffe,
  tbd,
  children,
}: {
  no: string;
  name: string;
  amount: number;
  ffe: number;
  tbd: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <tr className="bg-kdk-deep text-kdk-fg">
        <td className="px-3 py-2 font-mono text-xs" colSpan={6}>
          Division {no} — {name}
        </td>
        <td className="px-3 py-2 tabular text-sm">
          {tbd && amount === 0 && ffe === 0 ? "TBD" : usd(amount + ffe)}
        </td>
        <td />
        <td />
      </tr>
      {children}
    </>
  );
}

function MixBar({ belize, china }: { belize: number; china: number }) {
  return (
    <div className="mt-2 max-w-[220px]">
      <div className="flex h-2 overflow-hidden rounded-full bg-paper-2">
        <div className="bg-br1" style={{ width: `${belize}%` }} />
        <div className="bg-warn/80" style={{ width: `${china}%` }} />
      </div>
      <p className="mt-1 text-[11px] text-ink-soft">
        {belize}% Belizean · {china}% Chinese
      </p>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-[16px] bg-paper-2 px-3 py-3 shadow-card">
      <p className="text-[11px] uppercase tracking-wide text-muted">{k}</p>
      <p className="mt-1 font-display text-xl font-semibold tabular">{v}</p>
    </div>
  );
}

function StatusChip({ status }: { status: PricedLine["status"] }) {
  const map: Record<PricedLine["status"], string> = {
    QUOTED: "bg-kdk/15 text-kdk",
    "EST.": "bg-paper-2 text-ink-soft",
    TBD: "bg-tbd/20 text-tbd",
    "INCL.": "bg-br1/15 text-br1",
    "EXCL.": "bg-warn/15 text-warn",
  };
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", map[status])}>
      {status}
    </span>
  );
}
