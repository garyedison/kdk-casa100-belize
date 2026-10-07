import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { TRANSMITTAL, mailingBlock, financeMailingBlock } from "@/lib/data/transmittal";
import { packageTotals } from "@/lib/data/boq";
import { DEFAULT_MIX } from "@/lib/data/homes";
import { usd } from "@/lib/utils";
import { ArrowRight, Copy, Printer } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/letter")({ component: LetterPage });

const packages = packageTotals(DEFAULT_MIX);

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

          <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-ink">
            <p>Dear Mr. Courtenay,</p>
            <p>
              KDK offers the Government of Belize one hundred steel container homes. The price to
              start from is the shell only, at the China port.
            </p>
            <p className="rounded-[16px] bg-kdk px-5 py-5 text-kdk-fg">
              <span className="block text-[11px] uppercase tracking-[0.16em] text-kdk-fg/70">
                Shell only · FOB China · 100 homes · USD
              </span>
              <span className="mt-1 block font-display text-4xl font-semibold tabular">
                {usd(packages.shell.unfurnishedAllIn)}
              </span>
              <span className="mt-2 block text-sm text-kdk-fg/85">
                Pickup at the China port. No ocean freight, no inland trucking, and no Belize
                duties. Kitchen cabinet and sink, toilet, and shower are in the module. Split air,
                solar, pads, and the village are not.
              </span>
            </p>
            <p>
              Other prices in this proposal are rough estimates for a fully livable, walk-in house
              — about {usd(packages.installed.unfurnishedAllIn)} unfurnished to land, set, and finish
              the houses (still no village roads, power, water, or sewage plant). A turnkey village
              with that civil work is roughly {usd(packages.turnkey.unfurnishedAllIn)}. Those are
              estimates, not the offer. The live prices are on the Scopes and BOQ tabs.
            </p>
          </div>

          <section className="mt-8">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
              Summary of costs · USD, not BZ$
            </p>
            <table className="mt-3 w-full text-sm">
              <tbody>
                <tr className="border-y border-kdk bg-kdk/10">
                  <td className="py-3 pr-3 font-medium">
                    Shell only · FOB China
                    <span className="mt-0.5 block text-[12px] font-normal text-muted">
                      The number that matters. 100 homes. No shipping. No duties.
                    </span>
                  </td>
                  <td className="py-3 text-right font-display text-2xl font-semibold tabular">
                    {usd(packages.shell.unfurnishedAllIn)}
                  </td>
                </tr>
                <tr className="border-b border-line">
                  <td className="py-3 pr-3">
                    Rough estimate · walk-in houses, unfurnished
                    <span className="mt-0.5 block text-[12px] text-muted">
                      Landed, set, house services, solar equipment. No village civil. No furniture.
                    </span>
                  </td>
                  <td className="py-3 text-right tabular">{usd(packages.installed.unfurnishedAllIn)}</td>
                </tr>
                <tr className="border-b border-line">
                  <td className="py-3 pr-3">
                    Rough estimate · turnkey village
                    <span className="mt-0.5 block text-[12px] text-muted">
                      Walk-in houses plus roads, village power, water, and the sewage plant. No plaza.
                    </span>
                  </td>
                  <td className="py-3 text-right tabular">{usd(packages.turnkey.unfurnishedAllIn)}</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-3 text-[12px] text-muted">
              Hide a package or a single BOQ line on the other tabs and the total changes. This
              letter does not repeat those lines.
            </p>
          </section>

          <div className="mt-8 space-y-4 text-[15px] leading-relaxed">
            <p>
              We would welcome the chance to present the package at Sir Edney Cain Building.
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
              Enclosures: site plat · catalog · priced BOQ. Solar install hours are estimated.
              Preliminaries (surveys, design, permits, insurance) are shown at $0 until confirmed.
              Not an offer capable of acceptance until a purchase order is issued.
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
