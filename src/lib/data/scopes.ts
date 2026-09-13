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
    blurb: "PT220348-1 / PT211222 / PT230206. FOB China on Homes only. Kitchen / bath / split air pending confirmation.",
    items: ["01.01", "06.01", "07.04"],
  },
  {
    id: "distributor",
    label: "Distributor net (−10%)",
    short: "−10% net",
    blurb: "If the Government buys from KDK Hong Kong: 10% off list. If it buys from a licensed Belizean distributor: that company keeps the 10%.",
    items: ["01.02"],
  },
  {
    id: "ocean",
    label: "Ocean freight China → Belize",
    short: "Ocean",
    blurb: "$19,000 per 40HQ, China port to Belize. Off on Homes only (FOB China).",
    items: ["02.01"],
  },
  {
    id: "inland",
    label: "Inland delivery + duties",
    short: "Inland",
    blurb: "Site-gate convoy and HS 9406.20 allowance. Off on Homes only — Government’s own trucking if they pick up in China.",
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
  kicker?: string;
  pending?: string;
};

export const PRESETS: Preset[] = [
  {
    id: "homes",
    label: "Homes only — FOB China port",
    kicker: "FOB CHINA PORT",
    blurb:
      "Pickup at the China port. No ocean freight. No Belize inland. Government (or its forwarder) takes the boxes at the port and pays its own shipping.",
    pending:
      "Kitchen, bath (toilet + shower), and split air — to confirm. Not yet decided whether they travel with Homes only or are added later.",
    scopes: ["homes", "distributor"],
  },
  {
    id: "landed",
    label: "Landed Belize",
    blurb: "Homes plus KDK ocean freight and inland to the site gate. Still no slabs or set.",
    scopes: ["homes", "distributor", "ocean", "inland", "oncosts"],
  },
  {
    id: "pads",
    label: "Pads & set",
    blurb: "Landed, excavated, slabbed, and set on the pad.",
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
      label: "Factory list (no 10%)",
      blurb: "Diagnostic only — neither KDK nor a Belizean distributor takes the 10%.",
    };
  }
  if (mode === "gov_via_partner") {
    return {
      label: "Buy from a licensed Belizean distributor",
      blurb:
        "The Government contracts a Belizean company, not KDK Hong Kong. That distributor buys from KDK at net (−10%) and sells to the Government at factory list. The 10% is their margin on the homes only — not on slabs, MEP, or village works.",
    };
  }
  return {
    label: "Buy from KDK Hong Kong",
    blurb:
      "The Government contracts KDK Technology Ltd directly. KDK invoices at factory list less 10% on the three models. 100-home campaign only.",
  };
}
