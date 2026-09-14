import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { TRANSMITTAL, mailingBlock, financeMailingBlock } from "@/lib/data/transmittal";
import { computeTotals } from "@/lib/data/boq";
import { DEFAULT_MIX, STYLE_LIST, TOTAL_HOMES } from "@/lib/data/homes";
import { offScopesForPreset } from "@/lib/data/scopes";
import { usd } from "@/lib/utils";
import { ArrowRight, Copy, Printer } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/letter")({ component: LetterPage });

const totals = computeTotals(DEFAULT_MIX, { offScopes: offScopesForPreset("village") });

function LetterPage() {
  const [copied, setCopied] = useState<"opm" | "mof" | null>(null);

  function copy(which: "opm" | "mof") {
    const text = which === "opm" ? mailingBlock() : financeMailingBlock();
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(which);
      window.setTimeout(() => setCopied(null), 1600);
    });
  }

  return (
    <AppShell>
      <div className="border-b border-line bg-paper-2 print:hidden">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
          <p className="text-sm text-ink-soft">
            Letter of transmittal · {TRANSMITTAL.ref} · working draft for government review
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => window.print()}>
              <Printer className="size-4" />
              Print letter
            </Button>
            <Button size="sm" asChild>
              <Link to="/boq">
                Open the BOQ <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1100px] gap-8 px-4 py-8 md:grid-cols-[minmax(0,1fr)_280px] md:px-6 md:py-12">
        <article className="rounded-[22px] bg-paper px-5 py-8 shadow-card md:px-10 md:py-12 print:rounded-none print:p-0 print:shadow-none">
          <header className="flex items-start justify-between gap-4 border-b border-line pb-6">
            <div>
              <p className="grid size-11 place-items-center rounded-[10px] bg-kdk text-xs font-semibold tracking-wide text-kdk-fg">
                KDK
              </p>
              <p className="mt-3 font-display text-xl font-semibold">{TRANSMITTAL.from.company}</p>
              <p className="text-sm text-muted">{TRANSMITTAL.from.footprint}</p>
            </div>
            <div className="text-right text-sm text-ink-soft">
              <p>{TRANSMITTAL.date}</p>
              <p className="mt-1 font-mono text-[11px] tracking-wide">{TRANSMITTAL.ref}</p>
            </div>
          </header>

          <section className="mt-8 grid gap-6 text-sm md:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted">To</p>
              <p className="mt-2 font-semibold">{TRANSMITTAL.to.name}</p>
              <p className="text-ink-soft">{TRANSMITTAL.to.title}</p>
              <p className="mt-2 whitespace-pre-line text-ink-soft">
                {TRANSMITTAL.to.office}
                {"\n"}
                {TRANSMITTAL.to.floor}
                {"\n"}
                {TRANSMITTAL.to.building}, {TRANSMITTAL.to.compound}
                {"\n"}
                {TRANSMITTAL.to.city}, {TRANSMITTAL.to.district}
                {"\n"}
                {TRANSMITTAL.to.country}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Re</p>
              <p className="mt-2 font-medium">{TRANSMITTAL.subject}</p>
            </div>
          </section>

          <div className="prose-letter mt-8 space-y-4 text-[15px] leading-relaxed text-ink">
            <p>Dear Mr. Courtenay,</p>
            <p>
              KDK Technology Ltd submits this working proposal to the Office of the Prime Minister for a
              one-hundred-home modular village — CASA 100 — basic-shell container dwellings on a
              square ¼-acre plat. The shell includes kitchen cabinet and sink, toilet, shower and
              house electrics. Split air and rooftop solar (PV modules and a grid-tie inverter — no
              battery storage) are Belize add-ons, not in the FOB shell.
            </p>
            <p>
              The package is sized for a government campaign, not a two-home waterfront enquiry. List
              is dated 7 September 2026. Each of the three models is offered at a 10% distributor
              net on the 100-home order. The Government may contract KDK Technology Ltd (Hong Kong)
              directly at that net, or contract a licensed Belizean distributor who buys from KDK at
              net and sells to the Government at list — so a Belizean entity is the seller and keeps
              the 10% on the homes (officials can model 5%, 15% or 20% on the set-aside calculator).
              Officials can hide scopes on the attached playground to see a
              homes-only floor, pads-and-set, house MEP, or the full village (unfurnished, no extra
              civil). Village roads, village power, water, WWTP, trees, plaza and gatehouse are
              optional add-ons — not in that all-in. Solar kit prices are
              equipment only. Module assembly (11.01) uses supplier hours: 42 / 80 / 80 man-hours
              (4.2 / 8 / 8 days) at US$28/hr (US$280 per 10-hour day). Crew mix is 80% Belizean /
              20% China tech — Belizeans are the standing workforce. Solar install (11.02) is
              estimated at US$19.40/hr mixed — 70% Belizean electricians; those hours are still
              blank. KDK recommends Belizean crews as the standing workforce for 12 months or
              longer; Chinese technicians train the first pads and stand down. This is a working
              draft for review — not a contract.
            </p>
          </div>

          <dl className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              { k: "Homes", v: `${TOTAL_HOMES}` },
              { k: "Submitted mix", v: `${DEFAULT_MIX.br1} / ${DEFAULT_MIX.br2} / ${DEFAULT_MIX.br3}` },
              { k: "Unfurnished all-in (no extra civil)", v: usd(totals.unfurnishedAllIn) },
              { k: "Per ¼-acre lot (avg)", v: usd(totals.unfurnishedAllIn / totals.homeCount) },
              { k: "FF&E upgrade (optional)", v: usd(totals.ffe) },
              { k: "Furnished all-in", v: usd(totals.furnishedAllIn) },
              { k: "Belizean jobs", v: "12 months or longer" },
              { k: "Pad-set mix", v: "80% Belizean / 20% China tech" },
              { k: "Solar-install mix", v: "70% Belizean / 30% China PV" },
            ].map((row) => (
              <div key={row.k} className="rounded-[14px] bg-paper-2 px-4 py-3">
                <dt className="text-[11px] uppercase tracking-wide text-muted">{row.k}</dt>
                <dd className="mt-1 font-display text-xl font-semibold tabular">{row.v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-[12px] text-muted">
            Mix = Compact Terrace / Hip Cottage / Family Gable. USD. Contingency 8% and project
            management 5.5% sit on unfurnished works. This all-in is Full village unfurnished: no
            extra civil — no roads, village power, water mains, WWTP, trees, plaza, or gatehouse.
            Those packages are optional on the scope playground.
          </p>

          <table className="mt-8 w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-muted">
                <th className="py-2 font-medium">Style</th>
                <th className="py-2 font-medium">Beds</th>
                <th className="py-2 text-right font-medium">Qty</th>
                <th className="py-2 text-right font-medium">Village / home</th>
              </tr>
            </thead>
            <tbody>
              {STYLE_LIST.map((s) => (
                <tr key={s.id} className="border-b border-line/70">
                  <td className="py-2.5">
                    {s.name}{" "}
                    <span className="text-muted">
                      {s.beds}-bed · {s.assembleHours} hrs
                    </span>
                  </td>
                  <td className="py-2.5">
                    {s.beds}BR/{s.baths}BA · {s.areaM2} m²
                  </td>
                  <td className="py-2.5 text-right tabular">{DEFAULT_MIX[s.id]}</td>
                  <td className="py-2.5 text-right tabular">{usd(totals.perStyleVillage[s.id])}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-8 space-y-4 text-[15px] leading-relaxed">
            <p>
              enclosed: an interactive 10 × 10 plat, the home catalog, a priced
              bill of quantities written as a greenfield village, and a side-by-side against the
              two-home Moonlight Bay enquiry so the campaign rates are transparent.
            </p>
            <p>
              We would welcome the chance to present the package at Sir Edney Cain Building at a time
              of your choosing.
            </p>
            <p>Respectfully submitted,</p>
            <p className="pt-4">
              <span className="font-display text-lg font-semibold">{TRANSMITTAL.from.principal}</span>
              <br />
              {TRANSMITTAL.from.title}
              <br />
              {TRANSMITTAL.from.company}
            </p>
          </div>

          <section className="mt-10 border-t border-line pt-6 text-sm text-ink-soft">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Copies</p>
            <ul className="mt-2 space-y-1">
              {TRANSMITTAL.copies.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="mt-4 text-[12px] text-muted">
              Enclosures: site plat · catalog · priced BOQ · Moonlight Bay comparison. Labour and
              duration lines left open. Not an offer capable of acceptance until a purchase order is
              issued.
            </p>
          </section>
        </article>

        <aside className="space-y-4 print:hidden">
          <div className="rounded-[18px] bg-kdk p-5 text-kdk-fg">
            <p className="text-[11px] uppercase tracking-[0.16em] text-kdk-fg/70">Deliver to</p>
            <p className="mt-2 font-display text-xl font-semibold">{TRANSMITTAL.to.name}</p>
            <p className="text-sm text-kdk-fg/80">{TRANSMITTAL.to.title}</p>
            <p className="mt-3 whitespace-pre-line text-sm text-kdk-fg/85">{mailingBlock()}</p>
            <p className="mt-3 text-sm">
              OPM {TRANSMITTAL.opm.phone}
              <br />
              {TRANSMITTAL.opm.emailCeo}
            </p>
            <Button
              size="sm"
              variant="invert"
              className="mt-4 w-full"
              onClick={() => copy("opm")}
            >
              <Copy className="size-4" />
              {copied === "opm" ? "Copied" : "Copy OPM address"}
            </Button>
          </div>

          <div className="rounded-[18px] bg-paper-2 p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
              Ministry of Finance
            </p>
            <p className="mt-2 text-sm font-medium">{TRANSMITTAL.finance.minister}</p>
            <p className="text-sm text-ink-soft">{TRANSMITTAL.finance.ministerTitle}</p>
            <p className="mt-3 whitespace-pre-line text-sm text-ink-soft">
              {financeMailingBlock()}
            </p>
            <p className="mt-3 text-sm text-ink-soft">
              {TRANSMITTAL.finance.phone}
              <br />
              {TRANSMITTAL.finance.email}
              <br />
              {TRANSMITTAL.finance.hours}
            </p>
            <Button
              size="sm"
              variant="secondary"
              className="mt-4 w-full"
              onClick={() => copy("mof")}
            >
              <Copy className="size-4" />
              {copied === "mof" ? "Copied" : "Copy Finance address"}
            </Button>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
