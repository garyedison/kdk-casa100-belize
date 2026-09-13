/** Toggleable packages for the Government scope playground. */

export type ScopeId =
  | "homes"
  | "distributor"
  | "ocean"
  | "inland"
  | "site_enable"
  | "slabs"
  | "set"
  | "house_mep"
  | "solar"
  | "village_elec"
  | "village_wet"
  | "roads"
  | "civic"
  | "finishes"
  | "appliances"
  | "ffe"
  | "oncosts";

export type PricingMode = "kdk_net" | "list" | "gov_via_partner";

export type ScopeDef = {
  id: ScopeId;
  label: string;
  short: string;
  blurb: string;
  items: string[];
};

export const SCOPES: ScopeDef[] = [
  {
    id: "homes",
    label: "Factory container homes",
    short: "Homes",
    blurb: "PT220348-1 / PT211222 / PT230206 — kitchen, toilet, shower. Unfurnished.",
    items: ["01.01", "06.01", "07.04"],
  },
  {
    id: "distributor",
    label: "Distributor net (−10%)",
    short: "−10% net",
    blurb: "100-home KDK net: 10% off factory list. Not a two-home discount.",
    items: ["01.02"],
  },
  {
    id: "ocean",
    label: "Ocean freight China → Belize",
    short: "Ocean",
    blurb: "$19,000 per 40HQ, split by load factor.",
    items: ["02.01"],
  },
  {
    id: "inland",
    label: "Inland delivery + duties",
    short: "Inland",
    blurb: "Site-gate convoy and HS 9406.20 allowance.",
    items: ["02.02"],
  },
  {
    id: "site_enable",
    label: "Site enabling & pad prep",
    short: "Enabling",
    blurb: "Clearing, stripping, lot grading.",
    items: ["09.01", "09.03"],
  },
  {
    id: "slabs",
    label: "Excavation, slabs, anchoring",
    short: "Slabs",
    blurb: "Campaign slab-on-grade, MEP stub-up, hurricane ties.",
    items: ["03.01", "03.02"],
  },
  {
    id: "set",
    label: "Set home on the pad",
    short: "Set",
    blurb: "Shared crane plant. Pad-crew hours (11.01) still TBD.",
    items: ["03.03", "11.01", "11.03", "11.04"],
  },
  {
    id: "house_mep",
    label: "House MEP + split air",
    short: "House MEP",
    blurb: "Consumer unit, water/sewer laterals, split AC. Not village mains.",
    items: ["04.01", "05.04", "06.03", "06.05"],
  },
  {
    id: "solar",
    label: "Solar PV + inverter (no battery)",
    short: "Solar",
    blurb: "Panels, grid-tie inverter, rails. Install labour 11.02 TBD. No battery.",
    items: ["04.02", "04.03", "04.04", "04.05", "11.02", "11.05"],
  },
  {
    id: "village_elec",
    label: "Village electrical",
    short: "Village elec.",
    blurb: "Transformers, MV/LV, street lights, civic power, commissioning.",
    items: ["05.01", "05.02", "05.03", "05.05", "05.06"],
  },
  {
    id: "village_wet",
    label: "Village water & wastewater",
    short: "Water / WW",
    blurb: "Tank and loop, package WWTP.",
    items: ["06.02", "06.04"],
  },
  {
    id: "roads",
    label: "Avenues & stormwater",
    short: "Roads",
    blurb: "Gravel avenues, lot access, drainage.",
    items: ["09.02", "09.07"],
  },
  {
    id: "civic",
    label: "Gate, plaza, trees",
    short: "Civic",
    blurb: "Fence, gatehouse, pavilion, civic green.",
    items: ["09.04", "09.05", "09.06"],
  },
  {
    id: "finishes",
    label: "Interior make-good",
    short: "Finishes",
    blurb: "Floors, paint, ceilings, kitchen make-good, house lights.",
    items: ["07.01", "07.02", "07.03", "07.05", "07.06"],
  },
  {
    id: "appliances",
    label: "Range + refrigerator",
    short: "Appliances",
    blurb: "Washer/dryer not in base.",
    items: ["08.01"],
  },
  {
    id: "ffe",
    label: "FF&E furnished upgrade",
    short: "FF&E",
    blurb: "Beds, seating, dining, linens. Optional.",
    items: ["10.01", "11.06"],
  },
  {
    id: "oncosts",
    label: "Contingency 8% + PM 5.5%",
    short: "On-costs",
    blurb: "Applied only to the scopes still switched on.",
    items: [],
  },
];

export const SCOPE_IDS = SCOPES.map((s) => s.id);

export const ITEM_SCOPE: Record<string, ScopeId> = Object.fromEntries(
  SCOPES.flatMap((s) => s.items.map((item) => [item, s.id])),
) as Record<string, ScopeId>;

export type Preset = {
  id: string;
  label: string;
  blurb: string;
  scopes: ScopeId[];
};

export const PRESETS: Preset[] = [
  {
    id: "homes",
    label: "Homes only",
    blurb: "Lowest KDK price — factory boxes at distributor net. No site work.",
    scopes: ["homes", "distributor"],
  },
  {
    id: "pads",
    label: "Pads & set",
    blurb: "Homes landed, excavated, slabbed, and set on the pad.",
    scopes: ["homes", "distributor", "ocean", "inland", "site_enable", "slabs", "set", "oncosts"],
  },
  {
    id: "mep",
    label: "Pads + house MEP",
    blurb: "Pads & set, plus house electrical, laterals, and split air.",
    scopes: [
      "homes",
      "distributor",
      "ocean",
      "inland",
      "site_enable",
      "slabs",
      "set",
      "house_mep",
      "oncosts",
    ],
  },
  {
    id: "solar",
    label: "Pads + MEP + solar",
    blurb: "Previous, plus rooftop PV and inverter. No battery.",
    scopes: [
      "homes",
      "distributor",
      "ocean",
      "inland",
      "site_enable",
      "slabs",
      "set",
      "house_mep",
      "solar",
      "oncosts",
    ],
  },
  {
    id: "village",
    label: "Full village",
    blurb: "Unfurnished campaign — roads, water, WWTP, village electrical, civic.",
    scopes: SCOPE_IDS.filter((id) => id !== "ffe"),
  },
  {
    id: "furnished",
    label: "Furnished village",
    blurb: "Full village plus FF&E.",
    scopes: [...SCOPE_IDS],
  },
];

export function offScopesForPreset(presetId: string): ScopeId[] {
  const preset = PRESETS.find((p) => p.id === presetId);
  if (!preset) return [];
  const on = new Set(preset.scopes);
  return SCOPE_IDS.filter((id) => !on.has(id));
}

export function pricingCopy(mode: PricingMode) {
  if (mode === "list") {
    return {
      label: "Factory list",
      blurb: "No 10% off. KDK invoices the Government at the 7 Sep 2026 list.",
    };
  }
  if (mode === "gov_via_partner") {
    return {
      label: "Gov. price via local distributor",
      blurb:
        "Government pays factory list. KDK invoices a Belizean reseller at net (−10%). The 10% is the reseller’s margin on the homes only — not on civil or MEP.",
    };
  }
  return {
    label: "KDK distributor net",
    blurb: "KDK invoices at factory list less 10% on the three models. 100-home campaign only.",
  };
}
