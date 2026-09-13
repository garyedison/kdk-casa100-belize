import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import {
  CIVIC_IMAGES,
  CIVIC_LINES,
  CIVIC_TOTAL,
  PLAZA_EXCLUDES,
  PLAZA_INCLUDES,
  UNFURNISHED,
} from "@/lib/data/civic";
import { usd } from "@/lib/utils";

export const Route = createFileRoute("/civic")({ component: CivicPage });

function CivicPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-6">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
          Civic extras · optional add-on · not in Full village
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Plaza, pavilion, and gatehouse
        </h1>
        <p className="mt-2 max-w-3xl text-ink-soft">
          These drawings are conceptual — a government-budget civic green, not a resort. Civic extras
          are <strong>not</strong> in the Full village price ({usd(CIVIC_TOTAL)} EST. if you add
          them). Full village is unfurnished homes with no extra civil. Turn civic on from{" "}
          <Link to="/scopes" className="text-kdk underline-offset-4 hover:underline">
            Scopes
          </Link>{" "}
          (Village civil + civic extras) if the Government wants the plaza.
        </p>

        <section className="mt-8">
          <p className="text-[11px] uppercase tracking-wide text-muted">Full village</p>
          <h2 className="font-display text-2xl font-semibold">What “unfurnished” means</h2>
          <p className="mt-2 max-w-3xl text-ink-soft">{UNFURNISHED.means}</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-paper px-4 py-4 shadow-card">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-kdk">
                Still in Full village (no extra civil)
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
                {UNFURNISHED.stillIn.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-paper px-4 py-4 shadow-card">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                Not in unfurnished
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
                {UNFURNISHED.notIn.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold">Renderings</h2>
          <p className="mt-1 max-w-3xl text-sm text-ink-soft">
            Working illustrations of what {usd(185_000)} plaza + pavilion, {usd(140_000)} fence +
            gatehouse, and {usd(95_000)} civic green are meant to buy. Not a construction drawing.
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {CIVIC_IMAGES.map((img) => (
              <figure key={img.src} className="overflow-hidden rounded-xl bg-paper shadow-card">
                <img src={img.src} alt={img.alt} className="aspect-[16/9] w-full object-cover" />
                <figcaption className="px-4 py-3 text-sm text-ink-soft">{img.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold">What the plaza includes</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-soft">
              {PLAZA_INCLUDES.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">What it does not include</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-soft">
              {PLAZA_EXCLUDES.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold">In the BOQ</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Civic extras total {usd(CIVIC_TOTAL)} EST. — <strong>not</strong> inside Full village.
            Off unless the reviewer chooses Village civil + civic extras.
          </p>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-muted">
                <th className="py-2 pr-3">Item</th>
                <th className="py-2 pr-3">Description</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {CIVIC_LINES.map((l) => (
                <tr key={l.item} className="border-b border-line/70">
                  <td className="py-3 pr-3 font-medium tabular">{l.item}</td>
                  <td className="py-3 pr-3">{l.label}</td>
                  <td className="py-3 text-right tabular">{usd(l.amount)}</td>
                </tr>
              ))}
              <tr>
                <td className="py-3 pr-3" />
                <td className="py-3 pr-3 font-medium">Civic extras</td>
                <td className="py-3 text-right font-display text-lg tabular">{usd(CIVIC_TOTAL)}</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-4 text-sm">
            <Link to="/site" className="text-kdk underline-offset-4 hover:underline">
              See the pavilion on the 3D plat
            </Link>
            <span className="text-muted"> — it sits at the crossroads of the 10×10 grid.</span>
          </p>
        </section>
      </div>
    </AppShell>
  );
}
