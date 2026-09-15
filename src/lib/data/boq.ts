import {
  STYLES,
  type Mix,
  type StyleId,
  VOLUME_DISCOUNT,
  FREIGHT_CONTAINERS,
  FREIGHT_PER_40HQ,
} from "./homes";
import { ASSEMBLY, CHINA_CREW, FFE_INSTALL, SOLAR_INSTALL } from "./labour";
import { ITEM_SCOPE, SCOPE_IDS, offScopesForPreset, type PricingMode, type ScopeId } from "./scopes";
import { clampCommission, DEFAULT_COMMISSION, pctLabel } from "./commission";

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
  { no: "01", name: "Container homes" },
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
  { no: "13", name: "Preliminaries — allowances to confirm" },
] as const;

const per = (n: number): Record<StyleId, number> => ({ br1: n, br2: n, br3: n });
const rates = (a: number, b: number, c: number): Record<StyleId, number> => ({
  br1: a,
  br2: b,
  br3: c,
});

/**
 * Government 100-home campaign rates. Installed homes vs turnkey village (civil on, plaza off).
 */
export const LINES: BoqLine[] = [
  {
    item: "01.01",
    division: "Container homes",
    divisionNo: "01",
    description: "Basic shell module — KDK list, unfurnished (FOB China port)",
    unit: "home",
    perHome: per(1),
    rate: rates(
      STYLES.br1.factoryList,
      STYLES.br2.factoryList,
      STYLES.br3.factoryList,
    ),
    status: "QUOTED",
    note: "KDK list for the basic SHELL (FOB China). 10% campaign/distributor discount is 01.02. Kitchen, toilet, shower and house electrics are in the box. Split air, solar, range, fridge, furniture, pads and village works are not.",
  },
  {
    item: "01.02",
    division: "Container homes",
    divisionNo: "01",
    description: `Government volume discount / distributor margin — ${VOLUME_DISCOUNT * 100}% of shell list`,
    unit: "home",
    perHome: per(1),
    rate: rates(
      -STYLES.br1.factoryList * VOLUME_DISCOUNT,
      -STYLES.br2.factoryList * VOLUME_DISCOUNT,
      -STYLES.br3.factoryList * VOLUME_DISCOUNT,
    ),
    status: "EST.",
    note: "On the shell list only — not on slabs, solar, or village works. If the Government buys from KDK Hong Kong, this is a Government volume discount. If it buys through a licensed Belizean distributor, this is that company’s margin on the homes.",
  },
  {
    item: "02.01",
    division: "Logistics",
    divisionNo: "02",
    description: `Ocean freight, China → Belize (${FREIGHT_CONTAINERS} × 40HQ at $${FREIGHT_PER_40HQ.toLocaleString()} )`,
    unit: "home",
    perHome: per(1),
    rate: rates(
      STYLES.br1.freightPerHome,
      STYLES.br2.freightPerHome,
      STYLES.br3.freightPerHome,
    ),
    status: "QUOTED",
    note: `Whole containers, rounded up by style: 10 + 23 + 14 = ${FREIGHT_CONTAINERS} × 40HQ. Mixed loading not assumed. $${(FREIGHT_CONTAINERS * FREIGHT_PER_40HQ).toLocaleString()} campaign freight.`,
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
    note: "Site-gate convoy and HS 9406.20 duties/taxes allowance. Customs and port handling also listed at $0 under Div 13 until the Belize broker confirms.",
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
    note: "Campaign crew, government spec slab-on-grade. Includes excavation and house MEP stub-up.",
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
    note: "Shared crawler plant hire only. Crew to assemble the module on the pad is Div 11.01 — US$28/hr. Mix 80% Belizean / 20% China tech.",
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
    note: "12k / 18k / 24k BTU. In house MEP — not in Homes only (FOB China). Not in the standard module fittings.",
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
    note: "8 / 10 / 13 × 400 W modules = 3.2 / 4.0 / 5.2 kW array. Equipment only. Install is Div 11.02 (estimated hours). Grid-tie — needs village power (Turnkey village) or a later battery. No battery in this package.",
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
    note: "3 / 4 / 5 kW hybrid inverter, grid-interactive. Equipment only. No battery. Div 11.02 install is estimated. Arrays need the village electrical network (Turnkey village) to export.",
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
    note: "Rails, clamps, bonding. DC/AC home-run, isolators and utility interconnection are 04.06. Roof labour is Div 11.02 (estimated).",
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
    note: "No battery storage. Grid-tie only. Arrays depend on village electrical (in Turnkey village) or a later battery upgrade.",
  },
  {
    item: "04.06",
    division: "Split air & solar PV — no battery",
    divisionNo: "04",
    description: "PV balance-of-system + utility interconnection (isolators, DC/AC, earth)",
    unit: "home",
    perHome: per(1),
    rate: 0,
    status: "EST.",
    note: "Allowance $0 pending factory confirmation that BOS is not already in 04.04. Grid interconnection needs village power (Turnkey village).",
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
    description: "Sanitaryware — toilet, shower, kitchen sink (in the module)",
    unit: "home",
    perHome: per(1),
    rate: 0,
    status: "INCL.",
    note: "INCL. in the basic shell — $0 extra. Toilet, shower cube, wash-basin, kitchen sink and cabinet ship in the box. Split air is 04.01. Range/fridge is 08.01.",
  },
  {
    item: "06.02",
    division: "Plumbing & sanitary",
    divisionNo: "06",
    description: "Village potable water — elevated tank, mains to 100 lots, disinfection",
    unit: "ls",
    perHome: per(0),
    rate: 410_000,
    lump: true,
    status: "EST.",
    note: "Drinking-water loop for 100 lots: bulk source at the site boundary (municipal / well — Government to confirm), elevated tank, pumps, disinfection, mains to each lot. House laterals are 06.03. Not in Installed homes — in Turnkey village.",
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
    description: "WWTP — wastewater treatment plant (shared sewage plant for 100 lots)",
    unit: "ls",
    perHome: per(0),
    rate: 380_000,
    lump: true,
    status: "EST.",
    note: "WWTP = wastewater treatment plant. One shared sewage plant instead of 100 septic tanks. Includes collector mains, plant, commissioning and a treated-discharge arrangement (outfall / soakaway — Government to confirm receiving body). House laterals are 06.05. Not in Installed homes — in Turnkey village. Not civic (plaza/gate).",
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
    note: "Pad to collector. Collectors, WWTP and discharge are 06.04 (Turnkey village).",
  },
  {
    item: "06.06",
    division: "Plumbing & sanitary",
    divisionNo: "06",
    description: "Water source, tanks and pumps (in 06.02)",
    unit: "ls",
    perHome: per(0),
    rate: 0,
    lump: true,
    status: "INCL.",
    note: "INCL. in 06.02. Source (municipal tap or well) to be confirmed with the Government. $0 extra.",
  },
  {
    item: "06.07",
    division: "Plumbing & sanitary",
    divisionNo: "06",
    description: "Sewer collector mains (in 06.04)",
    unit: "ls",
    perHome: per(0),
    rate: 0,
    lump: true,
    status: "INCL.",
    note: "INCL. in 06.04. Not the house laterals (06.05).",
  },
  {
    item: "06.08",
    division: "Plumbing & sanitary",
    divisionNo: "06",
    description: "WWTP commissioning + treated discharge (in 06.04)",
    unit: "ls",
    perHome: per(0),
    rate: 0,
    lump: true,
    status: "INCL.",
    note: "INCL. in 06.04. Receiving body / permit to be confirmed. $0 extra on this line.",
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
    note: "RTOAC Div (i) analog — kitchen cabinet already in the module.",
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
    note: "Not in the basic shell. Gas stove is optional at the supplier and is not in this price. Washer/dryer not in base.",
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
    description: "Village roads — gravel avenues, lot access, drainage swales",
    unit: "ls",
    perHome: per(0),
    rate: 620_000,
    lump: true,
    status: "EST.",
    note: "RTOAC Div (m) external works analog. Gravel, not asphalt. Not in Homes only. Civic extras (gate/plaza) are 09.04–09.06.",
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
    note: "RTOAC Div (l) security analog — gatehouse, not mantrap. Civic extra. Not roads, water, power, or WWTP.",
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
    note: "Open-air single-storey pavilion at the crossroads, gravel plaza, benches, civic green. Conceptual rendering on /civic. Not a two-storey hall. Civic extra — not village utilities.",
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
    description: "Module assembly on the pad (man-hours / home)",
    unit: "hr",
    perHome: { br1: ASSEMBLY.hours.br1, br2: ASSEMBLY.hours.br2, br3: ASSEMBLY.hours.br3 },
    rate: ASSEMBLY.hourly,
    status: "QUOTED",
    note: `KDK assembly at 10-hour days, US$${ASSEMBLY.dayRate}/worker-day (US$${ASSEMBLY.hourly}/hr). Conservative if Belizean skilled labour is expensive. 1-bed ${ASSEMBLY.hours.br1} hrs / ${ASSEMBLY.days.br1} days (US$${ASSEMBLY.cost.br1.toLocaleString()}). 2-bed and 3-bed four workers, two days (US$${ASSEMBLY.cost.br2.toLocaleString()}). Mix 80% Belizean / 20% China tech. Not in 03.03 plant hire. Travel for the China trainers is Div 11.03.`,
  },
  {
    item: "11.02",
    division: "Labour & duration",
    divisionNo: "11",
    description: "Solar PV + inverter install — local crew (man-hours / home) — ESTIMATED",
    unit: "hr",
    perHome: { br1: SOLAR_INSTALL.hours.br1, br2: SOLAR_INSTALL.hours.br2, br3: SOLAR_INSTALL.hours.br3 },
    rate: SOLAR_INSTALL.hourly,
    status: "EST.",
    note: "ESTIMATED. 16 / 20 / 24 hours by style at $19.40/hr mixed (70% Belizean electrician / 30% China PV). Local electrician quote in a few days. Not in 04.02–04.04 equipment. Grid-tie — needs village power (Turnkey village).",
  },
  {
    item: "11.03",
    division: "Labour & duration",
    divisionNo: "11",
    description: "China technician attendance — mobilisation (4 workers, tickets, meals, hotel)",
    unit: "ls",
    perHome: per(0),
    rate: CHINA_CREW.mobilize4,
    status: "EST.",
    lump: true,
    note: "One-time travel for four workers (tickets, meals, hotel in transit, 3–4 days’ salary). Not pad labour — pad labour is Div 11.01 at $280/worker-day. Do not add the per-home travel table on top of 11.01; this line is the travel lump only.",
  },
  {
    item: "11.04",
    division: "Labour & duration",
    divisionNo: "11",
    description: "Duration — module assembly on pad",
    unit: "day",
    perHome: { br1: ASSEMBLY.days.br1, br2: ASSEMBLY.days.br2, br3: ASSEMBLY.days.br3 },
    rate: 0,
    status: "QUOTED",
    note: "Calendar crew-days at 10 hours/day. 1-bed 4.2 days; 2-bed and 3-bed two crew-days with four workers. Dollars sit on Div 11.01.",
  },
  {
    item: "11.05",
    division: "Labour & duration",
    divisionNo: "11",
    description: "Duration — solar install — ESTIMATED",
    unit: "day",
    perHome: { br1: SOLAR_INSTALL.days.br1, br2: SOLAR_INSTALL.days.br2, br3: SOLAR_INSTALL.days.br3 },
    rate: 0,
    status: "EST.",
    note: "ESTIMATED. 1.6 / 2 / 2.4 days by style. Dollars sit on Div 11.02. Local quote in a few days.",
  },
  {
    item: "11.06",
    division: "Labour & duration",
    divisionNo: "11",
    description: "FF&E installation labour — ESTIMATED",
    unit: "home",
    perHome: per(1),
    rate: FFE_INSTALL.rate,
    status: "EST.",
    ffe: true,
    note: "ESTIMATED. Only if the furnished upgrade is taken. ~8 hours per home.",
  },
  {
    item: "13.01",
    division: "Preliminaries — allowances to confirm",
    divisionNo: "13",
    description: "Surveys + geotechnical investigations",
    unit: "ls",
    perHome: per(0),
    rate: 0,
    lump: true,
    status: "EST.",
    note: "Allowance $0 — Belize subcontractor to confirm.",
  },
  {
    item: "13.02",
    division: "Preliminaries — allowances to confirm",
    divisionNo: "13",
    description: "Design and engineering",
    unit: "ls",
    perHome: per(0),
    rate: 0,
    lump: true,
    status: "EST.",
    note: "Allowance $0 — Belize engineer / factory drawings to confirm.",
  },
  {
    item: "13.03",
    division: "Preliminaries — allowances to confirm",
    divisionNo: "13",
    description: "Approvals and permit fees",
    unit: "ls",
    perHome: per(0),
    rate: 0,
    lump: true,
    status: "EST.",
    note: "Allowance $0 — confirm whether the Government carries permits.",
  },
  {
    item: "13.04",
    division: "Preliminaries — allowances to confirm",
    divisionNo: "13",
    description: "Temporary site facilities",
    unit: "ls",
    perHome: per(0),
    rate: 0,
    lump: true,
    status: "EST.",
    note: "Allowance $0 — compound, welfare, fencing of the works.",
  },
  {
    item: "13.05",
    division: "Preliminaries — allowances to confirm",
    divisionNo: "13",
    description: "Customs and port handling (beyond 02.02)",
    unit: "ls",
    perHome: per(0),
    rate: 0,
    lump: true,
    status: "EST.",
    note: "Allowance $0 — duties are in 02.02; this is broker / port handling if extra.",
  },
  {
    item: "13.06",
    division: "Preliminaries — allowances to confirm",
    divisionNo: "13",
    description: "Insurance — cargo + contractors’ all-risk",
    unit: "ls",
    perHome: per(0),
    rate: 0,
    lump: true,
    status: "EST.",
    note: "Allowance $0 — Belize broker to confirm.",
  },
  {
    item: "13.07",
    division: "Preliminaries — allowances to confirm",
    divisionNo: "13",
    description: "Testing, commissioning and as-builts (beyond village electrical 05.06)",
    unit: "ls",
    perHome: per(0),
    rate: 0,
    lump: true,
    status: "EST.",
    note: "Allowance $0. Village electrical closeout is 05.06. This is solar, water and WWTP closeout if not already in those lumps.",
  },
  {
    item: "13.08",
    division: "Preliminaries — allowances to confirm",
    divisionNo: "13",
    description: "Warranties and 12-month defects support",
    unit: "ls",
    perHome: per(0),
    rate: 0,
    lump: true,
    status: "EST.",
    note: "Allowance $0 — factory module warranty + Belize defects attendance to confirm.",
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
  /** Volume discount / licensed distributor margin on shell list. Default 10%. */
  commissionRate?: number;
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
  const commission = clampCommission(options.commissionRate ?? DEFAULT_COMMISSION);
  const flags = { offScopes, offItems, pricingMode };

  return LINES.map((raw) => {
    const line =
      raw.item === "01.02"
        ? {
            ...raw,
            description: `Government volume discount / distributor margin — ${pctLabel(commission)} of shell list`,
            rate: rates(
              -STYLES.br1.factoryList * commission,
              -STYLES.br2.factoryList * commission,
              -STYLES.br3.factoryList * commission,
            ),
            note: `On the shell list only. ${pctLabel(commission)} of KDK list. KDK Hong Kong path = Government volume discount. Licensed Belizean distributor path = that company’s margin on the homes. Not on slabs, solar, or village works.`,
          }
        : raw;
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
  commissionRate: number;
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
  const commission = clampCommission(options.commissionRate ?? DEFAULT_COMMISSION);
  const lines = priceLines(mix, { ...options, commissionRate: commission });
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

  const fullLines = priceLines(mix, { pricingMode: "kdk_net", commissionRate: commission });
  const fullWorks = fullLines
    .filter((l) => !l.ffe && !l.tbd)
    .reduce((s, l) => s + l.fullAmount, 0);
  const fullUnfurnishedAllIn = oncostsOf(fullWorks, true).allIn;
  const savingsVsFull = Math.max(0, fullUnfurnishedAllIn - unfurnishedAllIn);

  const factoryLine = lines.find((l) => l.item === "01.01");
  const factoryList = factoryLine?.fullAmount ?? 0;
  const homesOn = Boolean(factoryLine?.included);
  const distributorCredit = homesOn ? factoryList * commission : 0;
  const kdkNetHomes = homesOn ? factoryList - distributorCredit : 0;
  const partnerMargin = homesOn ? factoryList * commission : 0;

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
    commissionRate: commission,
    byScope,
  };
}

export const CONTINGENCY_RATE = CONTINGENCY;
export const PM_RATE = PM;

/** Fixed package totals for the header — not the live playground. */
export function packageTotals(mix: Mix, commissionRate?: number) {
  const opts = { commissionRate };
  const installed = computeTotals(mix, { ...opts, offScopes: offScopesForPreset("village") });
  const turnkey = computeTotals(mix, { ...opts, offScopes: offScopesForPreset("utilities") });
  return { installed, turnkey };
}

/** Moonlight Bay 2-home PT211222 working figures — for the comparison view. */
export const MOONLIGHT = {
  name: "Moonlight Bay — 2 homes (lots 127 & 115)",
  style: "Hip Cottage",
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
