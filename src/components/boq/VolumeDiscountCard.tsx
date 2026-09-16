import { DEFAULT_COMMISSION, heldNetShare, pctLabel } from "@/lib/data/commission";
import { usd } from "@/lib/utils";

const RATES = [0.1, 0.15, 0.2] as const;

export function VolumeDiscountCard({ publishedList }: { publishedList: number }) {
  const atDefault = heldNetShare(publishedList, DEFAULT_COMMISSION);

  return (
    <section className="rounded-[18px] bg-paper p-5 shadow-card md:p-6">
      <p className="text-[11px] uppercase tracking-[0.16em] text-kdk">USD · shell list only</p>
      <h2 className="font-display text-2xl font-semibold">
        Government volume discount / licensed Belizean distributor margin
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-ink-soft">
        KDK’s default on this 100-home campaign is <strong className="text-ink">10% of the shell
        list only</strong> — not slabs, solar, freight, or village works. That 10% is the most KDK
        can grant without raising the published list. If the Government wants a larger volume
        discount, or a licensed Belizean distributor needs a larger seller’s margin, the list on
        the three models has to go up so KDK still invoices the same net.
      </p>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <Tile k="Published shell list · USD" v={usd(atDefault.publishedList)} />
        <Tile k="KDK invoices (net) · USD" v={usd(atDefault.kdkNet)} accent />
        <Tile k="10% default · USD" v={usd(atDefault.share)} />
      </dl>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg bg-paper-2 px-4 py-4 text-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Buy from KDK Hong Kong
          </p>
          <p className="mt-1 text-ink-soft">
            The Government contracts KDK directly and pays the net{" "}
            <strong className="text-ink">{usd(atDefault.kdkNet)}</strong> for the shells. The{" "}
            {usd(atDefault.share)} is a <strong className="text-ink">Government volume discount</strong>{" "}
            — the Government keeps it. There is no Belizean seller in the chain.
          </p>
        </div>
        <div className="rounded-lg bg-kdk/10 px-4 py-4 text-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-kdk">
            Buy through a licensed Belizean distributor
          </p>
          <p className="mt-1 text-ink-soft">
            The Government contracts a Belizean company and pays list{" "}
            <strong className="text-ink">{usd(atDefault.publishedList)}</strong> on the shells. That
            company buys from KDK at {usd(atDefault.kdkNet)}. The{" "}
            <strong className="text-ink">{usd(atDefault.share)}</strong> is the licensed distributor’s
            margin — a Belizean entity is the seller.
          </p>
        </div>
      </div>

      <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
        If more than 10% is required — list rises, KDK net does not fall
      </p>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-wide text-muted">
              <th className="py-2 pr-3 font-medium">Share of shell</th>
              <th className="py-2 pr-3 font-medium">Selling list</th>
              <th className="py-2 pr-3 font-medium">KDK invoices (held)</th>
              <th className="py-2 pr-3 font-medium">Discount / margin</th>
              <th className="py-2 font-medium">Extra on the list</th>
            </tr>
          </thead>
          <tbody>
            {RATES.map((rate) => {
              const s = heldNetShare(publishedList, rate);
              return (
                <tr key={rate} className="border-b border-line/70">
                  <td className="py-2 pr-3 font-medium">
                    {pctLabel(rate)}
                    {rate === DEFAULT_COMMISSION ? (
                      <span className="ml-2 text-[11px] font-normal uppercase tracking-wide text-kdk">
                        default
                      </span>
                    ) : null}
                  </td>
                  <td className="py-2 pr-3 tabular">{usd(s.sellingList)}</td>
                  <td className="py-2 pr-3 tabular">{usd(s.kdkNet)}</td>
                  <td className="py-2 pr-3 tabular">{usd(s.share)}</td>
                  <td className="py-2 tabular">
                    {s.listUplift > 0 ? `+${usd(s.listUplift)}` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 max-w-3xl text-xs text-muted">
        Example: 15% for a Belizean distributor is not 15% off today’s list. It is a higher selling
        price so KDK still invoices {usd(atDefault.kdkNet)}. Same if the Government wants more than
        a 10% volume discount from KDK Hong Kong. Not applied to slabs, solar, or village works.
      </p>
    </section>
  );
}

function Tile({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className={accent ? "rounded-lg bg-kdk px-4 py-3 text-kdk-fg" : "rounded-lg bg-paper-2 px-4 py-3"}>
      <p className={`text-[11px] uppercase tracking-wide ${accent ? "text-kdk-fg/70" : "text-muted"}`}>
        {k}
      </p>
      <p className="mt-1 font-display text-xl font-semibold tabular">{v}</p>
    </div>
  );
}