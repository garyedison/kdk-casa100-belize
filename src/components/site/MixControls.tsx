import { STYLES, type Mix } from "@/lib/data/homes";
import { useVillage } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PRESETS: { name: string; mix: Mix }[] = [
  { name: "Balanced", mix: { br1: 30, br2: 45, br3: 25 } },
  { name: "Workforce", mix: { br1: 50, br2: 40, br3: 10 } },
  { name: "Family", mix: { br1: 20, br2: 50, br3: 30 } },
  { name: "Starter", mix: { br1: 60, br2: 30, br3: 10 } },
];

export function MixControls() {
  const mix = useVillage((s) => s.mix);
  const setCount = useVillage((s) => s.setCount);
  const applyMix = useVillage((s) => s.applyMix);

  return (
    <div className="rounded-[18px] bg-paper p-4 shadow-card">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-semibold">Unit mix</h3>
        <p className="text-xs text-muted">Always 100 homes · ¼-acre lots</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => {
          const on = p.mix.br1 === mix.br1 && p.mix.br2 === mix.br2 && p.mix.br3 === mix.br3;
          return (
            <Button
              key={p.name}
              type="button"
              size="sm"
              variant={on ? "primary" : "secondary"}
              onClick={() => applyMix(p.mix)}
            >
              {p.name}
            </Button>
          );
        })}
      </div>
      <div className="mt-4 space-y-3">
        {(["br1", "br2", "br3"] as const).map((id) => {
          const s = STYLES[id];
          return (
            <label key={id} className="block">
              <span className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2">
                  <i className="size-2.5 rounded-sm" style={{ background: s.color }} />
                  {s.short} · {s.code}
                </span>
                <span className="tabular font-medium">{mix[id]}</span>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={mix[id]}
                onChange={(e) => setCount(id, Number(e.target.value))}
                className={cn("mt-1 h-2 w-full cursor-pointer appearance-none rounded-full bg-paper-2")}
                style={{ accentColor: s.color }}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
