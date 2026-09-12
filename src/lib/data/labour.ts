/**
 * Campaign labour rates — researched Sep 2026.
 * Gross payroll vs contractor all-in (SSB, tools, transport, OH&P, scarcity).
 * Hours remain TBD. Rates are EST. until local quotes land next week.
 *
 * Sources:
 * - Belize min wage BZ$5.00/hr = US$2.50 (Ministry of Labour; peg 2:1)
 * - 45-hour week, OT 1.5× (Labour Act Cap. 297)
 * - Employer SSB 8.13% of insurable earnings
 * - WorldSalaries 2026 Belize construction occupations (annual BZD → USD/hr @ 45×52)
 * - SIB Labour Force Survey Apr 2025 (avg monthly BZ$1,498)
 * - Love FM / Ministry of Labour, May 2026 — construction labour shortage, imports of skill
 * - China NBS 2025 Migrant Worker Monitor — construction CNY 5,880/mo
 * - SalaryExpert Aug 2026 — China construction electrician ¥86.60/hr
 */

export type LabourGrade = {
  id: string;
  label: string;
  belizeGross: number;
  belizeAllIn: number;
  chinaDomestic: number;
  chinaOnSite: number;
  mixed: number;
  mixNote: string;
};

export const FX = {
  bzdPerUsd: 2,
  cnyPerUsd: 7.2,
  belizeWeekHrs: 45,
} as const;

/** Gross payroll USD/hr (take-home scale, 45-hr Belize week / ~208-hr China month). */
export const GROSS = {
  belizeMin: 2.5,
  belizeLabourer: 2.59,
  belizeMason: 3.11,
  belizeCarpenter: 3.12,
  belizePlumber: 3.37,
  belizeElectrician: 5.02,
  chinaConstruction: 3.49,
  chinaElectrician: 12.03,
} as const;

/**
 * Contractor all-in USD/hr billed to CASA 100.
 * Belize: ~2.5–3× gross (SSB 8%, tools, site transport, 25–30% OH&P, 2026 scarcity).
 * China domestic: factory-gate.
 * China on Belize pad: wage + per diem + flights + permit + lodging.
 */
export const ALL_IN: Record<string, LabourGrade> = {
  helper: {
    id: "helper",
    label: "Helper / general labour",
    belizeGross: 2.59,
    belizeAllIn: 6.5,
    chinaDomestic: 3.5,
    chinaOnSite: 22,
    mixed: 9.6,
    mixNote: "80% Belize / 20% China on-site",
  },
  structure: {
    id: "structure",
    label: "Framing, concrete, pad set",
    belizeGross: 3.12,
    belizeAllIn: 9.5,
    chinaDomestic: 4.2,
    chinaOnSite: 26,
    mixed: 12.8,
    mixNote: "80% Belize structure / 20% China factory tech",
  },
  electrical: {
    id: "electrical",
    label: "Electrical / solar PV",
    belizeGross: 5.02,
    belizeAllIn: 14,
    chinaDomestic: 12,
    chinaOnSite: 32,
    mixed: 19.4,
    mixNote: "70% Belize electrician / 30% China PV tech",
  },
  plumbing: {
    id: "plumbing",
    label: "Plumbing / sanitary",
    belizeGross: 3.37,
    belizeAllIn: 12.5,
    chinaDomestic: 8,
    chinaOnSite: 28,
    mixed: 17.2,
    mixNote: "70% Belize plumber / 30% China MEP tech",
  },
  foreman: {
    id: "foreman",
    label: "Lead / factory engineer",
    belizeGross: 6.5,
    belizeAllIn: 16,
    chinaDomestic: 14,
    chinaOnSite: 38,
    mixed: 27,
    mixNote: "50% Belize foreman / 50% China engineer (11.03)",
  },
};

export const CAMPAIGN_RATES = {
  padInstall: ALL_IN.structure.mixed,
  solarInstall: ALL_IN.electrical.mixed,
} as const;

/** Recommended crew mix and local-jobs pledge for the Government. Hours still TBD. */
export const EMPLOYMENT = {
  campaignMonths: 12,
  campaignSpan: "12 months or longer",
  concurrentBelizeJobs: "35–50",
  chineseCadre: "3–5 trainers, first 4 months, then 1–2 for commissioning",
  pledge:
    "KDK recommends Belizean crews as the standing workforce for 12 months or longer. Chinese technicians train, commission the first pads, and stand down. Village civil (roads, water, WWTP, laterals) is almost entirely Belizean for the full campaign.",
  pad: {
    item: "11.01",
    title: "Container install on the concrete pad",
    rate: CAMPAIGN_RATES.padInstall,
    belizePct: 80,
    chinaPct: 20,
    belizeRate: ALL_IN.structure.belizeAllIn,
    chinaRate: ALL_IN.structure.chinaOnSite,
    belizeCrew: "8–12 masons, carpenters, helpers",
    chinaCrew: "2 factory techs (months 1–4), then 1",
    chinaRole: "Show the first sets, hand the method to the Belizean pad crew, then leave.",
  },
  solar: {
    item: "11.02",
    title: "Solar PV + inverter install",
    rate: CAMPAIGN_RATES.solarInstall,
    belizePct: 70,
    chinaPct: 30,
    belizeRate: ALL_IN.electrical.belizeAllIn,
    chinaRate: ALL_IN.electrical.chinaOnSite,
    belizeCrew: "4–6 electricians",
    chinaCrew: "1 PV tech on the first arrays",
    chinaRole: "Commission the first kits and train Belizean electricians. Not a standing Chinese roof crew.",
  },
  village: {
    belizePct: 95,
    chinaPct: 5,
    note: "Avenues, drainage, water loop, WWTP, village electrical — Belizean civil for the full 12+ months.",
  },
} as const;

export const LABOUR_NOTES = {
  shortage:
    "May 2026: Ministry of Labour (Tanya Santos) reported a nationwide shortage of manual and skilled construction labour; employers are already importing skill.",
  burden:
    "All-in = gross + SSB 8.13% + tools/PPE + site transport + contractor OH&P. Not take-home.",
  chinaOnSite:
    "A Chinese crew in Guangdong is cheap. The same person on a Belmopan pad carries airfare, work permit, lodging and per diem — typically 6–8× the domestic rate.",
} as const;
