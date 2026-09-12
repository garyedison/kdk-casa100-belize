import { STYLES, GRID } from "@/lib/data/homes";
import { useVillage } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Plat2D() {
  const lots = useVillage((s) => s.lots);
  const hovered = useVillage((s) => s.hovered);
  const selected = useVillage((s) => s.selected);
  const hover = useVillage((s) => s.hover);
  const select = useVillage((s) => s.select);

  return (
    <div className="rounded-[18px] bg-paper-2 p-2 shadow-card">
      <div
        className="grid aspect-square w-full gap-[3px] rounded-[12px] bg-[#5C594F] p-[3px]"
        style={{ gridTemplateColumns: `repeat(${GRID}, minmax(0, 1fr))` }}
      >
        {lots.map((lot) => {
          const style = STYLES[lot.styleId];
          const on = lot.id === hovered || lot.id === selected;
          return (
            <button
              key={lot.id}
              type="button"
              aria-label={`${lot.label}, ${style.short} ${style.code}`}
              onMouseEnter={() => hover(lot.id)}
              onMouseLeave={() => hover(null)}
              onFocus={() => hover(lot.id)}
              onBlur={() => hover(null)}
              onClick={() => select(lot.id === selected ? null : lot.id)}
              className={cn(
                "relative min-h-7 rounded-[3px] transition-transform duration-150",
                on && "z-10 scale-[1.12] ring-2 ring-ink",
              )}
              style={{ background: on ? "#E7F0C8" : style.color }}
            >
              <span className="pointer-events-none absolute inset-0 grid place-items-center text-[8px] font-medium text-paper/90 md:text-[9px]">
                {lot.id}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3 px-1 text-[11px] text-muted">
        {(["br1", "br2", "br3"] as const).map((id) => (
          <span key={id} className="inline-flex items-center gap-1.5">
            <i className="size-2.5 rounded-sm" style={{ background: STYLES[id].color }} />
            {STYLES[id].short} · {STYLES[id].code}
          </span>
        ))}
      </div>
    </div>
  );
}
