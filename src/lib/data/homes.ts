export type StyleId = "br1" | "br2" | "br3";

export type HomeStyle = {
  id: StyleId;
  itemNo: string;
  code: string;
  name: string;
  short: string;
  beds: 1 | 2 | 3;
  baths: number;
  areaM2: number;
  areaSf: number;
  story: "Single";
  look: string;
  factoryList: number;
  unitsPer40hq: number;
  freightPerHome: number;
  volumeRate: number;
  image: string;
  color: string;
  colorMuted: string;
  roof: string;
  wall: string;
  accent: string;
  solarKw: number;
  solarPanels: number;
  panelWatt: number;
  inverterKw: number;
  acBtu: string;
  notes: string;
  rooms: string[];
  /** Supplier assembly man-hours per home (10-hour days). */
  assembleHours: number;
  /** Calendar days on a 10-hour crew-day. */
  assembleDays: number;
};

/** 10% KDK distributor net on factory list for a 100-home government order. */
export const VOLUME_DISCOUNT = 0.1;
export const FREIGHT_PER_40HQ = 19_000;

export const STYLES: Record<StyleId, HomeStyle> = {
  br1: {
    id: "br1",
    itemNo: "CASA-01.01",
    code: "PT220348-1",
    name: "Compact Terrace",
    short: "1-bed",
    beds: 1,
    baths: 1,
    areaM2: 29,
    areaSf: 312,
    story: "Single",
    look: "Skillion roof + terrace",
    factoryList: 15_850,
    unitsPer40hq: 3,
    freightPerHome: FREIGHT_PER_40HQ / 3,
    volumeRate: 15_850 * (1 - VOLUME_DISCOUNT),
    image: "/homes/1bed.jpg",
    color: "#5C7A62",
    colorMuted: "#C5D4C4",
    roof: "#1A1C1A",
    wall: "#5C4033",
    accent: "#C4B7A2",
    solarKw: 3,
    solarPanels: 8,
    panelWatt: 400,
    inverterKw: 3,
    acBtu: "12,000 BTU split",
    notes: "Compact 1BR/1BA. Kitchen, toilet and shower included. 42 assembly hours (4.2 days).",
    rooms: ["Bedroom", "Bath (toilet + shower)", "Kitchen", "Living", "Terrace (excl. area)"],
    assembleHours: 42,
    assembleDays: 4.2,
  },
  br2: {
    id: "br2",
    itemNo: "CASA-01.02",
    code: "PT211222",
    name: "Hip Cottage",
    short: "2-bed",
    beds: 2,
    baths: 2,
    areaM2: 54,
    areaSf: 581,
    story: "Single",
    look: "Hip roof — premium look",
    factoryList: 23_100,
    unitsPer40hq: 2,
    freightPerHome: FREIGHT_PER_40HQ / 2,
    volumeRate: 23_100 * (1 - VOLUME_DISCOUNT),
    image: "/homes/2bed.jpg",
    color: "#2F6B5C",
    colorMuted: "#D7E2DA",
    roof: "#2A2C2A",
    wall: "#E6E1D4",
    accent: "#8A8F84",
    solarKw: 4,
    solarPanels: 10,
    panelWatt: 400,
    inverterKw: 4,
    acBtu: "18,000 BTU split",
    notes: "2BR/2BA hip-roof cottage. Kitchen, toilets and showers included. 80 assembly hours (8 days).",
    rooms: ["Bedroom 1", "Bedroom 2", "Bath 1", "Bath 2", "Kitchen", "Living / dining", "Porch (excl. area)"],
    assembleHours: 80,
    assembleDays: 8,
  },
  br3: {
    id: "br3",
    itemNo: "CASA-01.03",
    code: "PT230206",
    name: "Family Gable",
    short: "3-bed",
    beds: 3,
    baths: 1,
    areaM2: 54,
    areaSf: 581,
    story: "Single",
    look: "Gable, wood clad, porch",
    factoryList: 23_500,
    unitsPer40hq: 1.82,
    freightPerHome: FREIGHT_PER_40HQ / 1.82,
    volumeRate: 23_500 * (1 - VOLUME_DISCOUNT),
    image: "/homes/3bed.jpg",
    color: "#1F4A3A",
    colorMuted: "#B7C7B4",
    roof: "#241E18",
    wall: "#6B5344",
    accent: "#C2A882",
    solarKw: 5,
    solarPanels: 13,
    panelWatt: 400,
    inverterKw: 5,
    acBtu: "24,000 BTU split",
    notes: "3BR/1BA at 54 m². Kitchen, toilet and shower included. 80 assembly hours (8 days).",
    rooms: ["Master", "Bedroom 2", "Bedroom 3", "Bath", "Kitchen", "Living / dining", "Porch (excl. area)"],
    assembleHours: 80,
    assembleDays: 8,
  },
};

export const STYLE_LIST = [STYLES.br1, STYLES.br2, STYLES.br3] as const;

export type Mix = { br1: number; br2: number; br3: number };

export const DEFAULT_MIX: Mix = { br1: 30, br2: 45, br3: 25 };

export const TOTAL_HOMES = 100;
export const LOT_ACRES = 0.25;
export const GRID = 10;

export function mixTotal(mix: Mix) {
  return mix.br1 + mix.br2 + mix.br3;
}

export function qtyOf(mix: Mix, id: StyleId) {
  return mix[id];
}
