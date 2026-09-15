import {
  ASSEMBLY,
  CHINA_CREW,
  CHINA_QUOTE_POINTS,
  chinaQuotedCampaign,
} from "@/lib/data/labour";
import { STYLE_LIST } from "@/lib/data/homes";
import { useVillage } from "@/lib/store";
import { usd } from "@/lib/utils";

export function ChinaCrewCard() {
  const mix = useVillage((s) => s.mix);
  const homes = mix.br1 + mix.br2 + mix.br3 || 100;
  const boqTotal =
    mix.br1 * ASSEMBLY.cost.br1 + mix.br2 * ASSEMBLY.cost.br2 + mix.br3 * ASSEMBLY.cost.br3;
  const quoted = chinaQuotedCampaign(homes);
  const q20 = chinaQuotedCampaign(20);
  const labour2bed = CHINA_CREW.workersTypical * CHINA_CREW.daysPerHome * CHINA_CREW.dayRate;

  return (
    <section className="rounded-[18px] bg-paper p-5 shadow-card md:p-6">
      <p className="text-[11px] uppercase tracking-[0.16em] text-kdk">
        Division 11.01 · assembling the home on the pad
      </p>
      <h2 className="font-display text-2xl font-semibold">
        How long to build one home, and what the labour costs
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-ink-soft">
        <strong className="text-ink">Div 11.01</strong> is the crew that puts the container home
        together on its concrete pad after it arrives. A 2-bed / 1-bath home takes{" "}
        <strong className="text-ink">four workers, two days</strong> at {usd(CHINA_CREW.dayRate)} per
        worker-day — conservative if Belizean skilled labour is expensive —{" "}
        <strong className="text-ink">{usd(labour2bed)}</strong> labour for that home.
        Round-trip for four workers is a one-time{" "}
        <strong className="text-ink">{usd(CHINA_CREW.mobilize4)}</strong> (tickets, meals, hotel in
        transit). Do not add the table below on top of Div 11.01 — it is the same assembly work,
        with travel spread over more homes.
      </p>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tile k="One 2-bed home" v="2 days" />
        <Tile k="Crew" v="4 workers" />
        <Tile k="Div 11.01 labour / 2-bed" v={usd(ASSEMBLY.cost.br2)} />
        <Tile k="20 homes, labour + travel" v={usd(q20.perHome)} accent />
      </dl>

      <p className="mt-4 rounded-md bg-kdk/10 px-4 py-3 text-sm">
        At <strong>20 homes</strong> labour plus the one-time travel is{" "}
        <strong>{usd(q20.total)}</strong> — about <strong>{usd(q20.perHome)}</strong> per home. Div
        11.01 on a 2-bed is {usd(ASSEMBLY.cost.br2)} (labour only). Same order of magnitude. On 100
        homes the travel is spread thinner; we still keep Div 11.01 in the all-in as the campaign
        labour line.
      </p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-wide text-muted">
              <th className="py-2 pr-3 font-medium">Homes</th>
              <th className="py-2 pr-3 font-medium">Travel (4 workers)</th>
              <th className="py-2 pr-3 font-medium">Labour</th>
              <th className="py-2 pr-3 font-medium">KDK total</th>
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
        As more homes are built, the one-time travel is spread and the cost per home falls. Div
        11.01 stays in the all-in.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg bg-paper-2 px-4 py-4 text-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            First two homes — training
          </p>
          <p className="mt-1 text-ink-soft">
            Two Chinese trainers plus two Belizean helpers.{" "}
            <strong className="text-ink">7–10 days to finish two homes</strong> while the local crew
            learns the method. After that, Belizeans take the standing work.
          </p>
        </div>
        <div className="rounded-lg bg-kdk/10 px-4 py-4 text-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-kdk">
            Then Belizean crews — 12 months or longer
          </p>
          <p className="mt-1 text-ink-soft">
            Same two-day pad cycle. Chinese technicians stand down. Div 11.01 remains the campaign
            labour line ({usd(boqTotal)} on this mix). Belizeans are the workforce the Government
            sees on site.
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-ink-soft">
        Div 11.01 by style: {STYLE_LIST.map((s) => `${s.short} ${usd(ASSEMBLY.cost[s.id])}`).join(" · ")}
        . 1-bed is a shorter pad (4.2 days); 2-bed and 3-bed are two crew-days with four workers.
      </p>
    </section>
  );
}

function Tile({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className={accent ? "rounded-lg bg-kdk px-4 py-4 text-kdk-fg" : "rounded-lg bg-paper-2 px-4 py-4"}>
      <dt
        className={
          accent ? "text-[11px] uppercase tracking-wide text-kdk-fg/70" : "text-[11px] uppercase tracking-wide text-muted"
        }
      >
        {k}
      </dt>
      <dd className="mt-1 font-display text-2xl font-semibold tabular">{v}</dd>
    </div>
  );
}
