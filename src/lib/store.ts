import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_MIX, type Mix, type StyleId } from "./data/homes";
import { buildLots, type Lot } from "./data/lots";
import {
  offScopesForPreset,
  type PricingMode,
  type ScopeId,
} from "./data/scopes";
import type { PriceOptions } from "./data/boq";

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
  offScopes: ScopeId[];
  offItems: string[];
  pricingMode: PricingMode;
  presetId: string;
  setCount: (id: StyleId, value: number) => void;
  applyMix: (mix: Mix) => void;
  hover: (id: number | null) => void;
  select: (id: number | null) => void;
  toggleScope: (id: ScopeId) => void;
  toggleItem: (item: string) => void;
  applyPreset: (id: string) => void;
  setPricingMode: (mode: PricingMode) => void;
  priceOptions: () => PriceOptions;
  reset: () => void;
};

export const useVillage = create<VillageState>()(
  persist(
    (set, get) => ({
      mix: DEFAULT_MIX,
      lots: buildLots(DEFAULT_MIX),
      hovered: null,
      selected: null,
      offScopes: offScopesForPreset("village"),
      offItems: [],
      pricingMode: "kdk_net",
      presetId: "village",
      setCount: (id, value) => {
        const mix = redistribute(get().mix, id, value);
        set({ mix, lots: buildLots(mix) });
      },
      applyMix: (mix) => set({ mix, lots: buildLots(mix), selected: null }),
      hover: (id) => set({ hovered: id }),
      select: (id) => set({ selected: id }),
      toggleScope: (id) => {
        const cur = new Set(get().offScopes);
        if (cur.has(id)) cur.delete(id);
        else cur.add(id);
        set({ offScopes: [...cur], presetId: "custom" });
      },
      toggleItem: (item) => {
        const cur = new Set(get().offItems);
        if (cur.has(item)) cur.delete(item);
        else cur.add(item);
        set({ offItems: [...cur], presetId: "custom" });
      },
      applyPreset: (id) =>
        set({
          presetId: id,
          offScopes: offScopesForPreset(id),
          offItems: [],
        }),
      setPricingMode: (mode) => set({ pricingMode: mode }),
      priceOptions: () => {
        const s = get();
        return {
          offScopes: s.offScopes,
          offItems: s.offItems,
          pricingMode: s.pricingMode,
        };
      },
      reset: () =>
        set({
          mix: DEFAULT_MIX,
          lots: buildLots(DEFAULT_MIX),
          hovered: null,
          selected: null,
          offScopes: offScopesForPreset("village"),
          offItems: [],
          pricingMode: "kdk_net",
          presetId: "village",
        }),
    }),
    {
      name: "kdk-casa-100-v2",
      partialize: (s) => ({
        mix: s.mix,
        offScopes: s.offScopes,
        offItems: s.offItems,
        pricingMode: s.pricingMode,
        presetId: s.presetId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.mix) state.lots = buildLots(state.mix);
      },
    },
  ),
);
