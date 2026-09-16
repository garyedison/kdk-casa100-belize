import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { STYLE_LIST } from "@/lib/data/homes";
import { computeTotals, packageTotals } from "@/lib/data/boq";
import { TRANSMITTAL } from "@/lib/data/transmittal";
import { useVillage } from "@/lib/store";
import { usd, num } from "@/lib/utils";
import { offScopesForPreset } from "@/lib/data/scopes";
import { VolumeDiscountCard } from "@/components/boq/VolumeDiscountCard";
import { ArrowRight, FileText, FileSpreadsheet, Map, Sun, Wind } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const mix = useVillage((s) => s.mix);
  const commissionRate = useVillage((s) => s.commissionRate);
  const totals = computeTotals(mix, {
    offScopes: offScopesForPreset("village"),
    commissionRate,
  });
  const packages = packageTotals(mix, commissionRate);

  return (
    <AppShell>
      <section className="border-b border-line bg-paper-2">
        <div className="mx-auto grid max-w-[1400px] gap-4 px-4 py-5 md:grid-cols-[1fr_auto] md:items-center md:px-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
              Letter of transmittal · {TRANSMITTAL.ref}
            </p>
            <p className="mt-1 font-display text-2xl font-semibold tracking-tight">
              {TRANSMITTAL.to.name}
            </p>
            <p className="text-sm text-ink-soft">
              {TRANSMITTAL.to.title} · {TRANSMITTAL.to.office}
              <br />
              {TRANSMITTAL.to.floor}, {TRANSMITTAL.to.building}, {TRANSMITTAL.to.city}
            </p>
          </div>
          <Button asChild>
            <Link to="/letter">
              Open the letter <FileText className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <img
          src="/homes/village-aerial.jpg"
          alt="Aerial of the proposed 100-home village"
          className="h-[min(72vh,720px)] w-full object-cover outline outline-1 -outline-offset-1 outline-ink/10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-kdk-deep/90 via-kdk-deep/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1400px] px-4 pb-10 md:px-6 md:pb-14">
          <p className="text-xs uppercase tracking-[0.18em] text-paper/80">
            KDK Technology Ltd · Office of the Prime Minister, Belize · prices in USD
          </p>
          <h1 className="mt-2 max-w-3xl font-display text-4xl font-semibold tracking-tight text-paper md:text-6xl">
            CASA 100
          </h1>
          <p className="mt-3 max-w-xl text-base text-paper/85 md:text-lg">
            One hundred finished-ready container homes. Start with the shell only — FOB China port —
            then add Belize works if the Government wants them. All figures are United States
            dollars (USD), not Belize dollars (BZ$).
          </p>
          <p className="mt-4 font-display text-3xl font-semibold tabular text-paper md:text-4xl">
            {usd(packages.shell.unfurnishedAllIn)}{" "}
            <span className="text-lg font-normal text-paper/75">USD · shell only · FOB China</span>
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/site">
                Open the site map <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="invert">
              <Link to="/scopes">Play with scopes</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/boq">Read the BOQ</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-kdk px-4 py-2 text-center text-sm text-kdk-fg md:px-6">
        All prices are <strong>United States dollars (USD)</strong>. Not Belize dollars (BZ$). USD 1
        ≈ BZ$ 2 — do not read these figures as Belize dollars.
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-3 px-4 py-8 md:grid-cols-4 md:px-6">
        <div className="rounded-[18px] bg-kdk px-4 py-4 text-kdk-fg shadow-card md:col-span-1">
          <p className="text-[11px] uppercase tracking-wide text-kdk-fg/70">
            Shell only · FOB China · USD
          </p>
          <p className="mt-1 font-display text-2xl font-semibold tabular">
            {usd(packages.shell.unfurnishedAllIn)}
          </p>
          <p className="mt-1 text-[11px] text-kdk-fg/75">
            100 boxes at the China port. Kitchen, toilet, shower in the module. No ocean, no pads,
            no village civil.
          </p>
        </div>
        {[
          { k: "Installed homes · USD", v: usd(packages.installed.unfurnishedAllIn) },
          { k: "Turnkey village · USD", v: usd(packages.turnkey.unfurnishedAllIn) },
          { k: "FF&E upgrade · USD", v: usd(totals.ffe) },
        ].map((s) => (
          <div key={s.k} className="rounded-[18px] bg-paper-2 px-4 py-4 shadow-card">
            <p className="text-[11px] uppercase tracking-wide text-muted">{s.k}</p>
            <p className="mt-1 font-display text-2xl font-semibold tabular">{s.v}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pb-10 md:px-6">
        <p className="mb-6 text-sm text-ink-soft">
          <strong className="text-ink">Shell only</strong> = FOB China port — pickup at the factory
          port, 100 homes, 10% volume discount on.{" "}
          <strong className="text-ink">Installed homes</strong> = landed in Belize, set, house MEP,
          solar equipment, interior make-good. No village roads, power, water or WWTP.{" "}
          <strong className="text-ink">Turnkey village</strong> = installed homes plus that civil
          infrastructure. Plaza, trees and furniture stay optional. All totals are{" "}
          <strong className="text-ink">USD</strong>, not BZ$.
        </p>
        <VolumeDiscountCard publishedList={packages.shell.factoryList} />
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-6 px-4 pb-10 md:grid-cols-3 md:px-6">
        {STYLE_LIST.map((s) => (
          <article key={s.id} className="overflow-hidden rounded-[22px] bg-paper shadow-card">
            <img
              src={s.image}
              alt={s.name}
              className="h-48 w-full object-cover outline outline-1 -outline-offset-1 outline-ink/10"
            />
            <div className="p-5">
              <p className="text-[11px] uppercase tracking-wide text-muted">
                {s.beds}-bed · {s.assembleHours} assembly hrs
              </p>
              <h2 className="font-display text-2xl font-semibold">
                {s.name}{" "}
                <span className="text-ink-soft">
                  {s.beds}BR/{s.baths}BA
                </span>
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                {s.areaM2} m² / {num(s.areaSf)} sf · {s.look} · {s.unitsPer40hq}/40HQ
              </p>
              <p className="mt-3 text-sm">
                Mix {mix[s.id]} homes · village all-in{" "}
                <span className="tabular font-medium">{usd(totals.perStyleVillage[s.id])}</span>
              </p>
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-4 px-4 pb-16 md:grid-cols-3 md:px-6">
        <Link
          to="/site"
          className="rounded-[18px] bg-kdk p-5 text-kdk-fg shadow-card transition-colors hover:bg-kdk-deep"
        >
          <Map className="size-5" />
          <h3 className="mt-3 font-display text-xl font-semibold">Interactive plat</h3>
          <p className="mt-1 text-sm text-kdk-fg/80">
            10 × 10 grid. Hover any lot. Orbit the 3D village. Change the mix and watch the colours
            move.
          </p>
        </Link>
        <Link to="/boq" className="rounded-[18px] bg-paper-2 p-5 shadow-card hover:bg-line/60">
          <FileSpreadsheet className="size-5 text-kdk" />
          <h3 className="mt-3 font-display text-xl font-semibold">Priced BOQ</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Item numbers by style. RTOAC-inspired scopes — electrical, plumbing, finishes, civic —
            written as a greenfield village, not a two-home waterfront enquiry.
          </p>
        </Link>
        <div className="rounded-[18px] bg-paper-2 p-5 shadow-card">
          <div className="flex gap-3">
            <Sun className="size-5 text-kdk" />
            <Wind className="size-5 text-kdk" />
          </div>
          <h3 className="mt-3 font-display text-xl font-semibold">On every home</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Split air, rooftop PV modules and a grid-tie inverter, toilet, shower and kitchen.
            Battery storage is not included. Furniture is a separate FF&E line. Solar install hours
            are estimated. Prices in USD.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
