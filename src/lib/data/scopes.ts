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

export const SCOPE_GROUPS: { id: string; title: string; blurb: string; ids: ScopeId[] }[] = [
  {
    id: "module",
    title: "The houses",
    blurb: "Factory boxes. Homes only is FOB China port — no shipping.",
    ids: ["homes", "distributor"],
  },
  {
    id: "logistics",
    title: "Shipping",
    blurb: "Off on Homes only. On from Landed Belize onward.",
    ids: ["ocean", "inland"],
  },
  {
    id: "site",
    title: "On each lot",
    blurb: "Off on Homes only and Landed Belize. On from Pads & set.",
    ids: ["site_enable", "slabs", "set", "house_mep", "solar"],
  },
  {
    id: "village",
    title: "Village infrastructure",
    blurb:
      "NOT in Full village. Optional add-on. WWTP = wastewater treatment plant (shared sewage plant, not 100 septic tanks). Civic extras (gate, plaza, trees) are not roads, water, or power.",
    ids: ["roads", "village_elec", "village_wet", "civic"],
  },
  {
    id: "fitout",
    title: "Interior fit-out",
    blurb: "Paint, floors, and range + fridge are on in Full village. Furniture (FF&E) is not.",
    ids: ["finishes", "appliances", "ffe"],
  },
  {
    id: "oncosts",
    title: "Allowances",
    blurb: "8% contingency and 5.5% project management on the scopes still switched on.",
    ids: ["oncosts"],
  },
];

export const SCOPES: ScopeDef[] = [
  {
    id: "homes",
    label: "Factory container homes",
    short: "Homes",
    blurb: "1-bed, 2-bed and 3-bed under 100 m². FOB China on Homes only. Kitchen, toilet and shower included. Split air is house MEP.",
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
    blurb: "Shared crane plant. Assembly hours on 11.01 from the supplier sheets (42 / 80 / 80 hrs).",
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
    label: "Village electrical (power to the lots)",
    short: "Village power",
    blurb:
      "Transformers, underground/overhead cables to each of the 100 lots, 80 street lights, testing. Village power — not rooftop solar, not the house split air. NOT in Full village.",
    items: ["05.01", "05.02", "05.03", "05.06"],
  },
  {
    id: "village_wet",
    label: "Village water + WWTP (sewage plant)",
    short: "Water + WWTP",
    blurb:
      "Potable water: elevated tank, mains to the lots, disinfection. WWTP = wastewater treatment plant — one shared sewage plant for the 100 lots instead of 100 septic tanks. NOT in Full village.",
    items: ["06.02", "06.04"],
  },
  {
    id: "roads",
    label: "Village roads + storm drainage",
    short: "Roads",
    blurb:
      "Gravel avenues through the subdivision, access to each ¼-acre lot, culverts and drainage. Not asphalt paving. NOT in Full village.",
    items: ["09.02", "09.07"],
  },
  {
    id: "civic",
    label: "Civic extras — gate, plaza, trees",
    short: "Civic extras",
    blurb:
      "Optional add-on: perimeter fence, gatehouse, community plaza and pavilion, street trees. Not roads. Not water. Not village power. Not the WWTP. NOT in Full village.",
    items: ["09.04", "09.05", "09.06", "05.05"],
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

export const HOUSE_CAMPAIGN: ScopeId[] = [
  "homes",
  "distributor",
  "ocean",
  "inland",
  "site_enable",
  "slabs",
  "set",
  "house_mep",
  "solar",
  "finishes",
  "appliances",
  "oncosts",
];

export const CIVIL_SCOPES: ScopeId[] = ["roads", "village_elec", "village_wet", "civic"];

/** Plain-language extras so a reviewer can read a price and know what is in it. */
export const PRICE_LENS: { id: ScopeId; kind: "civil" | "civic" | "ffe"; label: string }[] = [
  { id: "roads", kind: "civil", label: "Village roads (gravel avenues + drainage)" },
  { id: "village_elec", kind: "civil", label: "Village power to the lots + street lights" },
  { id: "village_wet", kind: "civil", label: "Potable water + WWTP (shared sewage plant)" },
  { id: "civic", kind: "civic", label: "Civic extras — plaza, pavilion, gatehouse, trees" },
  { id: "ffe", kind: "ffe", label: "Furniture (beds, sofas, dining, linens)" },
];

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
      "Kitchen, toilet and shower are included in the module. Split air is not — it sits in house MEP.",
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
    blurb: "Previous, plus rooftop PV and inverter. No battery. Still no village roads, water, power, or WWTP.",
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
    label: "Full village — unfurnished",
    kicker: "NO EXTRA CIVIL",
    blurb:
      "The 100 homes landed, set, MEP, and solar. No furniture. NO roads. NO village power. NO water mains. NO WWTP (sewage plant). NO trees, plaza, or gatehouse. Add those as separate packages.",
    scopes: HOUSE_CAMPAIGN,
  },
  {
    id: "utilities",
    label: "Add village civil",
    blurb:
      "Full village plus roads, village power, potable water, and WWTP (sewage plant). Still no plaza, trees, or gate.",
    scopes: [...HOUSE_CAMPAIGN, "roads", "village_elec", "village_wet"],
  },
  {
    id: "withCivic",
    label: "Village civil + civic extras",
    blurb: "Village civil plus gate, plaza, pavilion, and trees.",
    scopes: [...HOUSE_CAMPAIGN, "roads", "village_elec", "village_wet", "civic"],
  },
  {
    id: "furnished",
    label: "Furnished homes (no extra civil)",
    blurb:
      "Full village unfurnished plus beds, seating, dining, linens. Still no roads, village power, water, WWTP, plaza, or trees.",
    scopes: [...HOUSE_CAMPAIGN, "ffe"],
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
