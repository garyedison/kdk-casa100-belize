import {
  ASSEMBLY,
  CHINA_CREW,
  CHINA_QUOTE_POINTS,
  chinaFirstTwo,
  chinaQuotedCampaign,
  casa100Ramp,
} from "@/lib/data/labour";
import { STYLE_LIST } from "@/lib/data/homes";
import { useVillage } from "@/lib/store";
import { usd } from "@/lib/utils";

export function ChinaCrewCard() {
  const mix = useVillage((s) => s.mix);
  const homes = mix.br1 + mix.br2 + mix.br3 || 100;
  const boqTotal =
    mix.br1 * ASSEMBLY.cost.br1 + mix.br2 * ASSEMBLY.cost.br2 + mix.br3 * ASSEMBLY.cost.br3;
  const boqAvg = boqTotal / homes;
  const quoted = chinaQuotedCampaign(homes);
  const q20 = chinaQuotedCampaign(20);
  const first = chinaFirstTwo();
  const avgHours =
    (mix.br1 * ASSEMBLY.hours.br1 +
      mix.br2 * ASSEMBLY.hours.br2 +
      mix.br3 * ASSEMBLY.hours.br3) /
    homes;
  const ramp = casa100Ramp(homes, avgHours);
  const onSitePerHome = CHINA_CREW.workersTypical * CHINA_CREW.daysPerHome * CHINA_CREW.dayRate;

  return (
    <section className="rounded-[18px] bg-paper p-5 shadow-card md:p-6">
      <p className="text-[11px] uppercase tracking-[0.16em] text-kdk">
        Factory-net Chinese pad crew · no KDK markup
      </p>
      <h2 className="font-display text-2xl font-semibold">
        Four Chinese workers — in the same band as BOQ 11.01
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-ink-soft">
        Standing method: <strong className="text-ink">4 workers, 2 days per home</strong> at{" "}
        {usd(CHINA_CREW.dayRate)}/day factory-net (Greython/Maatern office quotes{" "}
        {usd(CHINA_CREW.greythonDay)}/day — that is the {usd(ASSEMBLY.hourly)}/hr on 11.01). Round-trip
        travel for four is a one-time <strong className="text-ink">{usd(CHINA_CREW.mobilize4)}</strong>{" "}
        (tickets, meals, hotel in transit, plus 3–4 days’ salary).{" "}
        <strong className="text-ink">Do not add this table on top of 11.01</strong> — it is the same
        assembly work, priced the factory way.
      </p>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tile k="On-site labour / home (4 × 2 × $220)" v={usd(onSitePerHome)} />
        <Tile k="11.01 2-bed / 3-bed" v={usd(ASSEMBLY.cost.br2)} />
        <Tile k="20 homes, factory sheet" v={usd(q20.perHome)} accent />
        <Tile k={`11.01 this mix (${homes} homes)`} v={usd(boqAvg)} />
      </dl>

      <p className="mt-4 rounded-md bg-kdk/10 px-4 py-3 text-sm">
        At <strong>20 homes</strong> the factory 4-worker package is{" "}
        <strong>{usd(q20.total)}</strong> including travel — about{" "}
        <strong>{usd(q20.perHome)}</strong> per home. 11.01 on a 2-bed is {usd(ASSEMBLY.cost.br2)}{" "}
        (labour only, no airfare). Same order of magnitude. On CASA 100 the travel lump amortises
        and the factory sheet falls below 11.01; we still keep 11.01 in the all-in as the
        conservative line.
      </p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-wide text-muted">
              <th className="py-2 pr-3 font-medium">Homes</th>
              <th className="py-2 pr-3 font-medium">Travel (4 workers)</th>
              <th className="py-2 pr-3 font-medium">On-site ($220 × 4 × days)</th>
              <th className="py-2 pr-3 font-medium">Factory-net total</th>
              <th className="py-2 font-medium">Per home</th>
            </tr>
          </thead>
          <tbody>
            {CHINA_QUOTE_POINTS.map((n) => {
              const row = chinaQuotedCampaign(n);
              const highlight = n === 20;
              return (
                <tr
                  key={n}
                  className={highlight ? "border-b border-line bg-kdk/10" : "border-b border-line/70"}
                >
                  <td className="py-2 pr-3 font-medium">{n}</td>
                  <td className="py-2 pr-3 tabular">{usd(row.travel)}</td>
                  <td className="py-2 pr-3 tabular">{usd(row.labor)}</td>
                  <td className="py-2 pr-3 tabular font-medium">{usd(row.total)}</td>
                  <td className="py-2 tabular font-semibold">{usd(row.perHome)}</td>
                </tr>
              );
            })}
            <tr>
              <td className="py-2 pr-3 font-semibold">This mix ({homes})</td>
              <td className="py-2 pr-3 tabular">{usd(quoted.travel)}</td>
              <td className="py-2 pr-3 tabular">{usd(quoted.labor)}</td>
              <td className="py-2 pr-3 tabular font-medium">{usd(quoted.total)}</td>
              <td className="py-2 tabular font-semibold">{usd(quoted.perHome)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-muted">
        Factory arithmetic: travel {usd(CHINA_CREW.mobilize4)} + (homes ÷ 2) × 4 × {usd(CHINA_CREW.dayRate)}.
        10 homes {usd(chinaQuotedCampaign(10).perHome)} · 20 homes {usd(q20.perHome)} · 50 homes{" "}
        {usd(chinaQuotedCampaign(50).perHome)} · 100 homes {usd(chinaQuotedCampaign(100).perHome)}.
        Net factory cost — no KDK commission.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg bg-paper-2 px-4 py-4 text-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            First two homes — 2 Chinese + 2 Belizean helpers
          </p>
          <p className="mt-1 text-ink-soft">
            Two Chinese trainers (not four). Hotel, food and tickets in the travel line. With two
            Belizean helpers, <strong className="text-ink">7–10 days to finish two homes</strong>.
            About <strong className="text-ink">{usd(first.perHomeUser)}</strong> per home for the
            Chinese side (user figure). After those pads, Belizeans take the method.
          </p>
        </div>
        <div className="rounded-lg bg-kdk/10 px-4 py-4 text-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-kdk">
            After training — CASA 100 recommended
          </p>
          <p className="mt-1 text-ink-soft">
            First two homes at the trainer cost, then {ramp.restHomes} homes Belizean-majority.
            Campaign labour on that ramp ≈ <strong className="text-ink">{usd(ramp.total)}</strong>{" "}
            ({usd(ramp.perHome)}/home) vs 11.01 {usd(boqTotal)} ({usd(boqAvg)}/home). We still price
            11.01 in the all-in. The savings show up once Belizeans are the standing crew for 12
            months or longer.
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-ink-soft">
        11.01 by style on this mix:{" "}
        {STYLE_LIST.map((s) => `${s.short} ${usd(ASSEMBLY.cost[s.id])}`).join(" · ")}.
      </p>
    </section>
  );
}

function Tile({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className={accent ? "rounded-lg bg-kdk px-4 py-4 text-kdk-fg" : "rounded-lg bg-paper-2 px-4 py-4"}>
      <dt className={accent ? "text-[11px] uppercase tracking-wide text-kdk-fg/70" : "text-[11px] uppercase tracking-wide text-muted"}>
        {k}
      </dt>
      <dd className="mt-1 font-display text-2xl font-semibold tabular">{v}</dd>
    </div>
  );
}
