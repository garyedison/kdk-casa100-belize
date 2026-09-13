import {
  STYLES,
  type Mix,
  type StyleId,
  VOLUME_DISCOUNT,
} from "./homes";
import { CAMPAIGN_RATES } from "./labour";
import { ITEM_SCOPE, SCOPE_IDS, type PricingMode, type ScopeId } from "./scopes";

export type Status = "QUOTED" | "EST." | "TBD" | "INCL." | "EXCL.";

export type BoqLine = {
  item: string;
  division: string;
  divisionNo: string;
  description: string;
  unit: string;
  /** Quantity per home of this style, or project LS qty in `projectQty`. */
  perHome: Record<StyleId, number>;
  rate: Record<StyleId, number> | number;
  status: Status;
  note: string;
  /** If true, qty is project lump / not scaled by mix. Uses perHome.br2 as the LS qty. */
  lump?: boolean;
  /** Labour / duration placeholders — shown but not summed. */
  tbd?: boolean;
  /** FF&E — summed separately from unfurnished all-in. */
  ffe?: boolean;
};

export const DIVISIONS = [
  { no: "01", name: "Factory modules" },
  { no: "02", name: "Logistics" },
  { no: "03", name: "Foundations & anchoring" },
  { no: "04", name: "Split air & solar PV — no battery" },
  { no: "05", name: "Electrical — village" },
  { no: "06", name: "Plumbing & sanitary" },
  { no: "07", name: "Interior finishes" },
  { no: "08", name: "Appliances" },
  { no: "09", name: "External works & civic" },
  { no: "10", name: "FF&E — furnished upgrade" },
  { no: "11", name: "Labour & duration" },
  { no: "12", name: "On-costs" },
] as const;

const per = (n: number): Record<StyleId, number> => ({ br1: n, br2: n, br3: n });
const rates = (a: number, b: number, c: number): Record<StyleId, number> => ({
  br1: a,
  br2: b,
  br3: c,
});

/**
 * Government 100-home campaign rates — not Moonlight Bay (2 custom waterfront homes).
 * Moonlight Bay used $20k slab, $5k inland, $2.5k crane, $20k flat contingency and
 * left solar/AC/deck/labour as TBD. CASA 100 uses volume factory, shared crane,
 * convoy inland, campaign slabs, included solar + split air, and 8% contingency.
 */
export const LINES: BoqLine[] = [
  {
    item: "01.01",
    division: "Factory modules",
    divisionNo: "01",
    description: "Container home unit — factory fitted, unfurnished (kitchen, toilet, shower)",
    unit: "home",
    perHome: per(1),
    rate: rates(
      STYLES.br1.factoryList,
      STYLES.br2.factoryList,
      STYLES.br3.factoryList,
    ),
    status: "QUOTED",
    note: "Factory list 7 Sep 2026. PT220348-1 / PT211222 / PT230206.",
  },
  {
    item: "01.02",
    division: "Factory modules",
    divisionNo: "01",
    description: `Distributor net — ${VOLUME_DISCOUNT * 100}% off factory list (100-home campaign)`,
    unit: "home",
    perHome: per(1),
    rate: rates(
      -STYLES.br1.factoryList * VOLUME_DISCOUNT,
      -STYLES.br2.factoryList * VOLUME_DISCOUNT,
      -STYLES.br3.factoryList * VOLUME_DISCOUNT,
    ),
    status: "EST.",
    note: "KDK 100-home distributor net, not a two-home discount. A Belizean reseller may sell to the Government at list; that 10% is their margin on the homes only.",
  },
  {
    item: "02.01",
    division: "Logistics",
    divisionNo: "02",
    description: "Ocean freight, China → Belize ($19,000 per 40HQ ÷ units/container)",
    unit: "home",
    perHome: per(1),
    rate: rates(
      STYLES.br1.freightPerHome,
      STYLES.br2.freightPerHome,
      STYLES.br3.freightPerHome,
    ),
    status: "QUOTED",
    note: "Load factors 3 / 2 / 1.82 per 40HQ. Full-container campaign — no lone-home penalty.",
  },
  {
    item: "02.02",
    division: "Logistics",
    divisionNo: "02",
    description: "Inland delivery to site gate + duties/taxes (HS 9406.20)",
    unit: "home",
    perHome: per(1),
    rate: 3_200,
    status: "EST.",
    note: "Moonlight Bay carried $5,000/home for two units. Convoy rate for 100.",
  },
  {
    item: "03.01",
    division: "Foundations & anchoring",
    divisionNo: "03",
    description: "Concrete slab + excavation + house MEP stub-up",
    unit: "home",
    perHome: per(1),
    rate: rates(11_500, 12_500, 13_000),
    status: "EST.",
    note: "Moonlight Bay $20,000/home. Campaign crew, government spec slab-on-grade.",
  },
  {
    item: "03.02",
    division: "Foundations & anchoring",
    divisionNo: "03",
    description: "Hurricane tie-downs / engineered anchoring to slab",
    unit: "home",
    perHome: per(1),
    rate: 1_800,
    status: "EST.",
    note: "Belize hurricane corridor. Confirm factory wind package separately.",
  },
  {
    item: "03.03",
    division: "Foundations & anchoring",
    divisionNo: "03",
    description: "Crane campaign — set container unit",
    unit: "home",
    perHome: per(1),
    rate: 800,
    status: "EST.",
    note: "Shared crawler plant hire only. Crew to set the container on the pad is 11.01 at $12.80/hr EST. mixed (80% Belizean / 20% China tech). Moonlight Bay day-hire was $2,500/home.",
  },
  {
    item: "04.01",
    division: "Split air & solar PV — no battery",
    divisionNo: "04",
    description: "Split-system air conditioner, installed",
    unit: "home",
    perHome: per(1),
    rate: rates(1_200, 1_800, 2_400),
    status: "EST.",
    note: "12k / 18k / 24k BTU. Included in every CASA 100 unit — not in Moonlight Bay base.",
  },
  {
    item: "04.02",
    division: "Split air & solar PV — no battery",
    divisionNo: "04",
    description: "Rooftop solar PV modules (panels only — equipment)",
    unit: "home",
    perHome: per(1),
    rate: rates(2_550, 3_400, 4_250),
    status: "EST.",
    note: "8 / 10 / 13 × 400 W modules = 3.2 / 4.0 / 5.2 kW array. Equipment only — no install labour. Install is 11.02 at $19.40/hr EST. (70% Belizean electrician / 30% China PV tech).",
  },
  {
    item: "04.03",
    division: "Split air & solar PV — no battery",
    divisionNo: "04",
    description: "Hybrid inverter, grid-tie — no battery (equipment)",
    unit: "home",
    perHome: per(1),
    rate: rates(1_650, 1_800, 1_950),
    status: "EST.",
    note: "3 / 4 / 5 kW hybrid inverter, grid-interactive. Equipment only — no install labour. No battery. Install is 11.02 at $19.40/hr EST.",
  },
  {
    item: "04.04",
    division: "Split air & solar PV — no battery",
    divisionNo: "04",
    description: "PV mounting hardware — rails, clamps, bonding kit (materials only)",
    unit: "home",
    perHome: per(1),
    rate: 300,
    status: "EST.",
    note: "Materials only. Roof install labour is 11.02 at $19.40/hr EST. (70% Belizean / 30% China) — not in this $300.",
  },
  {
    item: "04.05",
    division: "Split air & solar PV — no battery",
    divisionNo: "04",
    description: "Battery energy storage (LiFePO4) — NOT INCLUDED",
    unit: "home",
    perHome: per(1),
    rate: 0,
    status: "EXCL.",
    tbd: true,
    note: "No battery storage is included with the PV arrays. Grid-tie only. Optional later upgrade — rate left blank until the Government elects storage.",
  },
  {
    item: "05.01",
    division: "Electrical — village",
    divisionNo: "05",
    description: "Padmount transformers — 2 × 500 kVA, 11–13.2 kV / 400Y/230V",
    unit: "nr",
    perHome: per(0),
    rate: 48_000,
    lump: true,
    status: "EST.",
    note: "Scaled from RTOAC Div (o) dry-type / utility transformer logic. Village, not civic 1500 kVA.",
  },
  {
    item: "05.02",
    division: "Electrical — village",
    divisionNo: "05",
    description: "MV/LV distribution, laterals, service entrance, 100 meters",
    unit: "ls",
    perHome: per(0),
    rate: 520_000,
    lump: true,
    status: "EST.",
    note: "RTOAC Div (o) feeders + branch, scaled to 100 dwellings.",
  },
  {
    item: "05.03",
    division: "Electrical — village",
    divisionNo: "05",
    description: "Street lighting — LED, 80 nr along avenues",
    unit: "nr",
    perHome: per(0),
    rate: 1_200,
    lump: true,
    status: "EST.",
    note: "80 columns. Qty carried in projectQty via lumpQty.",
  },
  {
    item: "05.04",
    division: "Electrical — village",
    divisionNo: "05",
    description: "House consumer unit, branch wiring allowance (beyond factory)",
    unit: "home",
    perHome: per(1),
    rate: rates(850, 1_150, 1_250),
    status: "EST.",
    note: "Factory ships a fitted board; this is site hookup and extra devices.",
  },
  {
    item: "05.05",
    division: "Electrical — village",
    divisionNo: "05",
    description: "Civic pavilion + gatehouse electrical",
    unit: "ls",
    perHome: per(0),
    rate: 42_000,
    lump: true,
    status: "EST.",
    note: "RTOAC-inspired builders-work electrical, civic scale.",
  },
  {
    item: "05.06",
    division: "Electrical — village",
    divisionNo: "05",
    description: "Testing, commissioning, as-builts, coordination study",
    unit: "ls",
    perHome: per(0),
    rate: 55_000,
    lump: true,
    status: "EST.",
    note: "RTOAC Div (o) testing & closeout, scaled.",
  },
  {
    item: "06.01",
    division: "Plumbing & sanitary",
    divisionNo: "06",
    description: "Sanitaryware — toilet, shower, kitchen sink (factory fitted)",
    unit: "home",
    perHome: per(1),
    rate: 0,
    status: "INCL.",
    note: "In 01.01 factory unit. Shown for scope completeness.",
  },
  {
    item: "06.02",
    division: "Plumbing & sanitary",
    divisionNo: "06",
    description: "Village water — elevated tank, mains loop, disinfection",
    unit: "ls",
    perHome: per(0),
    rate: 410_000,
    lump: true,
    status: "EST.",
    note: "RTOAC plumbing distribution analog — potable loop for 100 lots.",
  },
  {
    item: "06.03",
    division: "Plumbing & sanitary",
    divisionNo: "06",
    description: "House water lateral + yard cistern stub",
    unit: "home",
    perHome: per(1),
    rate: 1_150,
    status: "EST.",
    note: "Single connection point per pad.",
  },
  {
    item: "06.04",
    division: "Plumbing & sanitary",
    divisionNo: "06",
    description: "Package wastewater treatment plant",
    unit: "ls",
    perHome: per(0),
    rate: 380_000,
    lump: true,
    status: "EST.",
    note: "Shared WWTP in lieu of 100 septic fields.",
  },
  {
    item: "06.05",
    division: "Plumbing & sanitary",
    divisionNo: "06",
    description: "Sewer laterals — pad to collector",
    unit: "home",
    perHome: per(1),
    rate: 980,
    status: "EST.",
    note: "",
  },
  {
    item: "07.01",
    division: "Interior finishes",
    divisionNo: "07",
    description: "Floor finishes — government spec (vinyl / sealed)",
    unit: "home",
    perHome: per(1),
    rate: rates(1_250, 2_200, 2_200),
    status: "EST.",
    note: "RTOAC Div (f) analog at housing spec, not Porcelanosa stone.",
  },
  {
    item: "07.02",
    division: "Interior finishes",
    divisionNo: "07",
    description: "Wall finishes / paint",
    unit: "home",
    perHome: per(1),
    rate: rates(620, 980, 1_050),
    status: "EST.",
    note: "RTOAC paint rates, housing area.",
  },
  {
    item: "07.03",
    division: "Interior finishes",
    divisionNo: "07",
    description: "Ceilings — factory + make-good",
    unit: "home",
    perHome: per(1),
    rate: rates(280, 420, 420),
    status: "EST.",
    note: "RTOAC Div (e) analog.",
  },
  {
    item: "07.04",
    division: "Interior finishes",
    divisionNo: "07",
    description: "Internal doors — factory sets",
    unit: "home",
    perHome: per(1),
    rate: 0,
    status: "INCL.",
    note: "In 01.01. RTOAC Div (h) analog already in the module.",
  },
  {
    item: "07.05",
    division: "Interior finishes",
    divisionNo: "07",
    description: "Kitchen millwork make-good (factory + local)",
    unit: "home",
    perHome: per(1),
    rate: rates(350, 480, 520),
    status: "EST.",
    note: "RTOAC Div (i) analog — factory kitchen already in 01.01.",
  },
  {
    item: "07.06",
    division: "Interior finishes",
    divisionNo: "07",
    description: "Light fixtures — LED house allowance",
    unit: "home",
    perHome: per(1),
    rate: rates(650, 1_100, 1_250),
    status: "EST.",
    note: "RTOAC Div (g) analog at housing count.",
  },
  {
    item: "08.01",
    division: "Appliances",
    divisionNo: "08",
    description: "Range / cooktop + refrigerator package",
    unit: "home",
    perHome: per(1),
    rate: rates(1_400, 1_800, 2_100),
    status: "EST.",
    note: "RTOAC Div (j) analog. Washer/dryer not in base.",
  },
  {
    item: "09.01",
    division: "External works & civic",
    divisionNo: "09",
    description: "Site clearing, stripping, enabling (~33 acres)",
    unit: "ls",
    perHome: per(0),
    rate: 185_000,
    lump: true,
    status: "EST.",
    note: "RTOAC Div (a) demolition analog — greenfield enabling.",
  },
  {
    item: "09.02",
    division: "External works & civic",
    divisionNo: "09",
    description: "Gravel avenues, lot access, drainage swales",
    unit: "ls",
    perHome: per(0),
    rate: 620_000,
    lump: true,
    status: "EST.",
    note: "RTOAC Div (m) external works analog.",
  },
  {
    item: "09.03",
    division: "External works & civic",
    divisionNo: "09",
    description: "Lot grading and pad preparation",
    unit: "home",
    perHome: per(1),
    rate: 420,
    status: "EST.",
    note: "",
  },
  {
    item: "09.04",
    division: "External works & civic",
    divisionNo: "09",
    description: "Perimeter fence + village gatehouse",
    unit: "ls",
    perHome: per(0),
    rate: 140_000,
    lump: true,
    status: "EST.",
    note: "RTOAC Div (l) security analog — gatehouse, not mantrap.",
  },
  {
    item: "09.05",
    division: "External works & civic",
    divisionNo: "09",
    description: "Civic plaza + pavilion (community hall)",
    unit: "ls",
    perHome: per(0),
    rate: 185_000,
    lump: true,
    status: "EST.",
    note: "RTOAC atrium/civic analog. One shared pavilion at the crossroads.",
  },
  {
    item: "09.06",
    division: "External works & civic",
    divisionNo: "09",
    description: "Street trees, lot grassing, civic green",
    unit: "ls",
    perHome: per(0),
    rate: 95_000,
    lump: true,
    status: "EST.",
    note: "",
  },
  {
    item: "09.07",
    division: "External works & civic",
    divisionNo: "09",
    description: "Stormwater — culverts, outfall, swale lining",
    unit: "ls",
    perHome: per(0),
    rate: 120_000,
    lump: true,
    status: "EST.",
    note: "",
  },
  {
    item: "10.01",
    division: "FF&E — furnished upgrade",
    divisionNo: "10",
    description: "Furniture / FF&E package — beds, seating, dining, linens",
    unit: "home",
    perHome: per(1),
    rate: rates(3_500, 5_500, 7_000),
    status: "EST.",
    ffe: true,
    note: "Priced separately. Base proposal is unfurnished. Equal add to any style.",
  },
  {
    item: "11.01",
    division: "Labour & duration",
    divisionNo: "11",
    description: "Container install on concrete pad — local crew (man-hours / home)",
    unit: "hr",
    perHome: per(1),
    rate: CAMPAIGN_RATES.padInstall,
    status: "TBD",
    tbd: true,
    note: "Hours TBD. Rate EST. $12.80/hr mixed: 80% Belizean structure @ $9.50 + 20% China factory tech on-site @ $26. Belizean pad crew is the standing workforce for 12 months or longer. Chinese techs train the first sets and stand down. Not in 03.03 plant hire.",
  },
  {
    item: "11.02",
    division: "Labour & duration",
    divisionNo: "11",
    description: "Solar PV + inverter install — local crew (man-hours / home)",
    unit: "hr",
    perHome: per(1),
    rate: CAMPAIGN_RATES.solarInstall,
    status: "TBD",
    tbd: true,
    note: "Hours TBD. Rate EST. $19.40/hr mixed: 70% Belizean electrician @ $14 + 30% China PV tech on-site @ $32. Belizean electricians run the roofs for the 12-month campaign. One Chinese tech commissions the first kits and trains. Not in 04.02–04.04 equipment.",
  },
  {
    item: "11.03",
    division: "Labour & duration",
    divisionNo: "11",
    description: "China factory engineer attendance",
    unit: "day",
    perHome: per(0),
    rate: 0,
    status: "TBD",
    tbd: true,
    lump: true,
    note: "Factory engineer as trainer/commissioner — not the standing workforce. Belizean foremen run the site after handover. Duration TBD.",
  },
  {
    item: "11.04",
    division: "Labour & duration",
    divisionNo: "11",
    description: "Duration — container set on pad",
    unit: "day",
    perHome: per(1),
    rate: 0,
    status: "TBD",
    tbd: true,
    note: "Calendar days on pad after crane. Fill with 11.01 labour next week.",
  },
  {
    item: "11.05",
    division: "Labour & duration",
    divisionNo: "11",
    description: "Duration — solar install",
    unit: "day",
    perHome: per(1),
    rate: 0,
    status: "TBD",
    tbd: true,
    note: "Calendar days for PV + inverter on the roof. Fill with 11.02 labour next week.",
  },
  {
    item: "11.06",
    division: "Labour & duration",
    divisionNo: "11",
    description: "FF&E installation labour",
    unit: "home",
    perHome: per(1),
    rate: 0,
    status: "TBD",
    tbd: true,
    ffe: true,
    note: "Only if the furnished upgrade is taken.",
  },
];

/** Lump quantities that are not 1. */
const LUMP_QTY: Record<string, number> = {
  "05.01": 2,
  "05.03": 80,
};

export type PricedLine = BoqLine & {
  qty: Record<StyleId, number>;
  amount: Record<StyleId, number>;
  projectQty: number;
  projectAmount: number;
  fullAmount: number;
  included: boolean;
  scopeId?: ScopeId;
};

export type PriceOptions = {
  offScopes?: Iterable<ScopeId>;
  offItems?: Iterable<string>;
  pricingMode?: PricingMode;
};

function asSet<T extends string>(v?: Iterable<T>): Set<T> {
  return new Set(v);
}

export function lineIncluded(
  item: string,
  opts: { offScopes: Set<ScopeId>; offItems: Set<string>; pricingMode: PricingMode },
): boolean {
  if (opts.offItems.has(item)) return false;
  const scope = ITEM_SCOPE[item];
  if (scope && opts.offScopes.has(scope)) return false;
  if (item === "01.02") {
    if (opts.pricingMode === "list" || opts.pricingMode === "gov_via_partner") return false;
    if (opts.offScopes.has("homes")) return false;
    if (opts.offItems.has("01.01")) return false;
  }
  if (item === "01.01" && opts.offScopes.has("homes")) return false;
  return true;
}

function rateOf(line: BoqLine, id: StyleId) {
  return typeof line.rate === "number" ? line.rate : line.rate[id];
}

export function priceLines(mix: Mix, options: PriceOptions = {}): PricedLine[] {
  const ids: StyleId[] = ["br1", "br2", "br3"];
  const offScopes = asSet(options.offScopes);
  const offItems = asSet(options.offItems);
  const pricingMode: PricingMode = options.pricingMode ?? "kdk_net";
  const flags = { offScopes, offItems, pricingMode };

  return LINES.map((line) => {
    const qty = { br1: 0, br2: 0, br3: 0 } as Record<StyleId, number>;
    const amount = { br1: 0, br2: 0, br3: 0 } as Record<StyleId, number>;
    let projectQty = 0;
    let fullAmount = 0;

    if (line.lump) {
      const q = LUMP_QTY[line.item] ?? 1;
      projectQty = q;
      const r = rateOf(line, "br2");
      fullAmount = line.tbd ? 0 : q * r;
    } else {
      for (const id of ids) {
        const q = line.perHome[id] * mix[id];
        const r = rateOf(line, id);
        qty[id] = q;
        const a = line.tbd ? 0 : q * r;
        amount[id] = a;
        projectQty += q;
        fullAmount += a;
      }
    }

    const included = lineIncluded(line.item, flags);
    if (!included) {
      amount.br1 = 0;
      amount.br2 = 0;
      amount.br3 = 0;
    }
    const projectAmount = included ? fullAmount : 0;

    return {
      ...line,
      qty,
      amount,
      projectQty,
      projectAmount,
      fullAmount,
      included,
      scopeId: ITEM_SCOPE[line.item],
    };
  });
}

export type SolarKit = {
  pv: number;
  inverter: number;
  mount: number;
  kit: number;
};

export type Totals = {
  lines: PricedLine[];
  byDivision: {
    no: string;
    name: string;
    amount: number;
    ffe: number;
    tbd: boolean;
  }[];
  unfurnishedWorks: number;
  ffe: number;
  contingency: number;
  pm: number;
  unfurnishedAllIn: number;
  furnishedAllIn: number;
  perStyleHouse: Record<StyleId, number>;
  perStyleVillage: Record<StyleId, number>;
  perStyleFfe: Record<StyleId, number>;
  perStyleSolar: Record<StyleId, SolarKit>;
  solarProject: SolarKit;
  siteSharePerHome: number;
  homeCount: number;
  hiddenWorks: number;
  fullUnfurnishedAllIn: number;
  savingsVsFull: number;
  factoryList: number;
  distributorCredit: number;
  kdkNetHomes: number;
  partnerMargin: number;
  kdkInvoice: number;
  govPay: number;
  byScope: { id: ScopeId; amount: number; fullAmount: number; on: boolean }[];
};

const CONTINGENCY = 0.08;
const PM = 0.055;

function oncostsOf(works: number, on: boolean) {
  if (!on) return { contingency: 0, pm: 0, allIn: works };
  const contingency = works * CONTINGENCY;
  const pm = (works + contingency) * PM;
  return { contingency, pm, allIn: works + contingency + pm };
}

export function computeTotals(mix: Mix, options: PriceOptions = {}): Totals {
  const offScopes = asSet(options.offScopes);
  const pricingMode: PricingMode = options.pricingMode ?? "kdk_net";
  const lines = priceLines(mix, options);
  const homeCount = mix.br1 + mix.br2 + mix.br3 || 1;
  const oncostsOn = !offScopes.has("oncosts");

  const unfurnishedWorks = lines
    .filter((l) => !l.ffe && !l.tbd)
    .reduce((s, l) => s + l.projectAmount, 0);
  const ffe = lines
    .filter((l) => l.ffe && !l.tbd)
    .reduce((s, l) => s + l.projectAmount, 0);
  const hiddenWorks = lines
    .filter((l) => !l.included && !l.ffe && !l.tbd)
    .reduce((s, l) => s + l.fullAmount, 0);

  const { contingency, pm, allIn: unfurnishedAllIn } = oncostsOf(unfurnishedWorks, oncostsOn);
  const furnishedAllIn = unfurnishedAllIn + ffe;

  const fullLines = priceLines(mix, { pricingMode: "kdk_net" });
  const fullWorks = fullLines
    .filter((l) => !l.ffe && !l.tbd)
    .reduce((s, l) => s + l.fullAmount, 0);
  const fullUnfurnishedAllIn = oncostsOf(fullWorks, true).allIn;
  const savingsVsFull = Math.max(0, fullUnfurnishedAllIn - unfurnishedAllIn);

  const factoryLine = lines.find((l) => l.item === "01.01");
  const factoryList = factoryLine?.fullAmount ?? 0;
  const homesOn = Boolean(factoryLine?.included);
  const distributorCredit = homesOn ? factoryList * VOLUME_DISCOUNT : 0;
  const kdkNetHomes = homesOn ? factoryList - distributorCredit : 0;
  const partnerMargin = homesOn ? factoryList * VOLUME_DISCOUNT : 0;

  const otherWorks = lines
    .filter((l) => !l.ffe && !l.tbd && l.item !== "01.01" && l.item !== "01.02")
    .reduce((s, l) => s + l.projectAmount, 0);

  const kdkInvoice = oncostsOf(kdkNetHomes + otherWorks, oncostsOn).allIn;
  const govPay = oncostsOf((homesOn ? factoryList : 0) + otherWorks, oncostsOn).allIn;

  const byDivision = DIVISIONS.map((d) => {
    const subset = lines.filter((l) => l.divisionNo === d.no);
    return {
      no: d.no,
      name: d.name,
      amount: subset
        .filter((l) => !l.ffe && !l.tbd)
        .reduce((s, l) => s + l.projectAmount, 0),
      ffe: subset
        .filter((l) => l.ffe && !l.tbd)
        .reduce((s, l) => s + l.projectAmount, 0),
      tbd: subset.some((l) => l.tbd),
    };
  });

  const siteLump = lines
    .filter((l) => l.lump && !l.ffe && !l.tbd)
    .reduce((s, l) => s + l.projectAmount, 0);
  const siteSharePerHome = siteLump / homeCount;

  const perStyleHouse = { br1: 0, br2: 0, br3: 0 } as Record<StyleId, number>;
  const perStyleFfe = { br1: 0, br2: 0, br3: 0 } as Record<StyleId, number>;
  const ids: StyleId[] = ["br1", "br2", "br3"];
  for (const line of lines) {
    if (line.lump || line.tbd || !line.included) continue;
    for (const id of ids) {
      const r = rateOf(line, id) * line.perHome[id];
      if (line.ffe) perStyleFfe[id] += r;
      else perStyleHouse[id] += r;
    }
  }
  const perStyleVillage = { br1: 0, br2: 0, br3: 0 } as Record<StyleId, number>;
  for (const id of ids) {
    const house = perStyleHouse[id];
    const withSite = house + siteSharePerHome;
    if (!oncostsOn) {
      perStyleVillage[id] = withSite;
      continue;
    }
    const c = withSite * CONTINGENCY;
    const p = (withSite + c) * PM;
    perStyleVillage[id] = withSite + c + p;
  }

  const solarItems = {
    pv: lines.find((l) => l.item === "04.02"),
    inverter: lines.find((l) => l.item === "04.03"),
    mount: lines.find((l) => l.item === "04.04"),
  };
  const kitOf = (id: StyleId): SolarKit => {
    const pv = solarItems.pv?.included ? rateOf(solarItems.pv, id) : 0;
    const inverter = solarItems.inverter?.included ? rateOf(solarItems.inverter, id) : 0;
    const mount = solarItems.mount?.included ? rateOf(solarItems.mount, id) : 0;
    return { pv, inverter, mount, kit: pv + inverter + mount };
  };
  const perStyleSolar = {
    br1: kitOf("br1"),
    br2: kitOf("br2"),
    br3: kitOf("br3"),
  };
  const solarProject: SolarKit = {
    pv: solarItems.pv?.projectAmount ?? 0,
    inverter: solarItems.inverter?.projectAmount ?? 0,
    mount: solarItems.mount?.projectAmount ?? 0,
    kit: 0,
  };
  solarProject.kit = solarProject.pv + solarProject.inverter + solarProject.mount;

  const byScope = SCOPE_IDS.map((id) => {
    if (id === "oncosts") {
      const selectedOn = oncostsOf(unfurnishedWorks, true);
      return {
        id,
        amount: oncostsOn ? contingency + pm : 0,
        fullAmount: selectedOn.contingency + selectedOn.pm,
        on: oncostsOn,
      };
    }
    const subset = lines.filter((l) => l.scopeId === id);
    return {
      id,
      amount: subset.filter((l) => !l.tbd).reduce((s, l) => s + l.projectAmount, 0),
      fullAmount: subset.filter((l) => !l.tbd).reduce((s, l) => s + l.fullAmount, 0),
      on: !offScopes.has(id),
    };
  });

  return {
    lines,
    byDivision,
    unfurnishedWorks,
    ffe,
    contingency,
    pm,
    unfurnishedAllIn,
    furnishedAllIn,
    perStyleHouse,
    perStyleVillage,
    perStyleFfe,
    perStyleSolar,
    solarProject,
    siteSharePerHome,
    homeCount,
    hiddenWorks,
    fullUnfurnishedAllIn,
    savingsVsFull,
    factoryList,
    distributorCredit,
    kdkNetHomes,
    partnerMargin,
    kdkInvoice,
    govPay,
    byScope,
  };
}

export const CONTINGENCY_RATE = CONTINGENCY;
export const PM_RATE = PM;

/** Moonlight Bay 2-home PT211222 working figures — for the comparison view. */
export const MOONLIGHT = {
  name: "Moonlight Bay — 2 homes (lots 127 & 115)",
  style: "PT211222",
  factoryWorking: 20_000,
  factoryList: 23_100,
  freight: 9_500,
  inland: 5_000,
  slab: 20_000,
  hurricane: 2_000,
  crane: 2_500,
  contingency: 20_000,
  allInExTbd: 82_000,
  tbd: ["Exterior deck/fence/screens", "Set-up labour", "FF&E", "Solar", "Split air"],
};
