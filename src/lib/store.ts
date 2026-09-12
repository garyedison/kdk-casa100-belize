import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_MIX, type Mix, type StyleId } from "./data/homes";
import { buildLots, type Lot } from "./data/lots";

const IDS: StyleId[] = ["br1", "br2", "br3"];

function redistribute(mix: Mix, id: StyleId, value: number): Mix {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const others = IDS.filter((i) => i !== id);
  const rest = 100 - v;
  const currentOthers = others.reduce((s, i) => s + mix[i], 0) || 1;
  const next: Mix = { ...mix, [id]: v } as Mix;
  let allocated = 0;
  others.forEach((i, idx) => {
    if (idx === others.length - 1) {
      next[i] = rest - allocated;
    } else {
      const n = Math.round((rest * mix[i]) / currentOthers);
      next[i] = n;
      allocated += n;
    }
  });
  return next;
}

type VillageState = {
  mix: Mix;
  lots: Lot[];
  hovered: number | null;
  selected: number | null;
  setCount: (id: StyleId, value: number) => void;
  applyMix: (mix: Mix) => void;
  hover: (id: number | null) => void;
  select: (id: number | null) => void;
  reset: () => void;
};

export const useVillage = create<VillageState>()(
  persist(
    (set) => ({
      mix: DEFAULT_MIX,
      lots: buildLots(DEFAULT_MIX),
      hovered: null,
      selected: null,
      setCount: (id, value) => {
        const mix = redistribute(useVillage.getState().mix, id, value);
        set({ mix, lots: buildLots(mix) });
      },
      applyMix: (mix) => set({ mix, lots: buildLots(mix), selected: null }),
      hover: (id) => set({ hovered: id }),
      select: (id) => set({ selected: id }),
      reset: () =>
        set({
          mix: DEFAULT_MIX,
          lots: buildLots(DEFAULT_MIX),
          hovered: null,
          selected: null,
        }),
    }),
    {
      name: "kdk-casa-100",
      partialize: (s) => ({ mix: s.mix }),
      onRehydrateStorage: () => (state) => {
        if (state?.mix) state.lots = buildLots(state.mix);
      },
    },
  ),
);
