import type { StyleId } from "./homes";

export type FloorRoom = {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  porch?: boolean;
};

export type FloorFixture =
  | { kind: "bed"; x: number; y: number; w: number; h: number }
  | { kind: "twin"; x: number; y: number; w: number; h: number }
  | { kind: "toilet"; x: number; y: number }
  | { kind: "shower"; x: number; y: number; w: number; h: number }
  | { kind: "lav"; x: number; y: number }
  | { kind: "sink"; x: number; y: number; w: number; h: number }
  | { kind: "cooktop"; x: number; y: number }
  | { kind: "fridge"; x: number; y: number }
  | { kind: "table"; x: number; y: number; w: number; h: number }
  | { kind: "sofa"; x: number; y: number; w: number; h: number }
  | { kind: "desk"; x: number; y: number; w: number; h: number };

export type FloorDim = {
  label: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  side: "n" | "s" | "e" | "w";
};

export type FloorPlanData = {
  code: string;
  title: string;
  interiorM2: number;
  widthMm: number;
  depthMm: number;
  note: string;
  rooms: FloorRoom[];
  fixtures: FloorFixture[];
  dims: FloorDim[];
};

/** Layouts for the three CASA 100 styles — 1-bed, 2-bed, 3-bed. */
export const FLOORPLANS: Record<StyleId, FloorPlanData> = {
  br1: {
    code: "1-bed",
    title: "Compact Terrace · 1BR / 1BA",
    interiorM2: 29,
    widthMm: 7510,
    depthMm: 5710,
    note: "29 m² excluding terrace. Bedroom, bath, kitchen, south terrace.",
    rooms: [
      { id: "br", label: "Bedroom", x: 0, y: 0, w: 3850, h: 3860 },
      { id: "ba", label: "Bath", x: 3850, y: 0, w: 1550, h: 2000 },
      { id: "kt", label: "Kitchen", x: 5400, y: 0, w: 2110, h: 2000 },
      { id: "lv", label: "Living", x: 3850, y: 2000, w: 3660, h: 1860 },
      { id: "tr", label: "Terrace", x: 0, y: 3860, w: 7510, h: 1850, porch: true },
    ],
    fixtures: [
      { kind: "bed", x: 350, y: 450, w: 2000, h: 1600 },
      { kind: "toilet", x: 4300, y: 350 },
      { kind: "shower", x: 4200, y: 1050, w: 900, h: 750 },
      { kind: "lav", x: 5000, y: 450 },
      { kind: "cooktop", x: 5600, y: 280 },
      { kind: "sink", x: 6400, y: 250, w: 900, h: 500 },
      { kind: "fridge", x: 7050, y: 900 },
      { kind: "table", x: 5000, y: 2450, w: 1400, h: 900 },
    ],
    dims: [
      { label: "7.51 m", x1: 0, y1: 0, x2: 7510, y2: 0, side: "n" },
      { label: "5.71 m", x1: 7510, y1: 0, x2: 7510, y2: 5710, side: "e" },
    ],
  },
  br2: {
    code: "2-bed",
    title: "Hip Cottage · 2BR / 2BA",
    interiorM2: 54,
    widthMm: 9000,
    depthMm: 8410,
    note: "54 m² excluding porch. Two bedrooms, two baths, kitchen, living.",
    rooms: [
      { id: "br1", label: "Bedroom 1", x: 0, y: 0, w: 3300, h: 3030 },
      { id: "ba1", label: "Bath 1", x: 3300, y: 0, w: 1100, h: 3030 },
      { id: "ba2", label: "Bath 2", x: 4400, y: 0, w: 1300, h: 3030 },
      { id: "br2", label: "Bedroom 2", x: 5700, y: 0, w: 3300, h: 3030 },
      { id: "kt", label: "Kitchen", x: 0, y: 3030, w: 2800, h: 3030 },
      { id: "lv", label: "Living / dining", x: 2800, y: 3030, w: 6200, h: 3030 },
      { id: "pr", label: "Porch", x: 0, y: 6060, w: 9000, h: 2350, porch: true },
    ],
    fixtures: [
      { kind: "bed", x: 450, y: 550, w: 2000, h: 1600 },
      { kind: "bed", x: 6350, y: 550, w: 2000, h: 1600 },
      { kind: "toilet", x: 3480, y: 350 },
      { kind: "shower", x: 3420, y: 1750, w: 860, h: 1050 },
      { kind: "lav", x: 3620, y: 1200 },
      { kind: "toilet", x: 4680, y: 350 },
      { kind: "shower", x: 4520, y: 1750, w: 960, h: 1050 },
      { kind: "lav", x: 4820, y: 1200 },
      { kind: "cooktop", x: 280, y: 3280 },
      { kind: "sink", x: 900, y: 3180, w: 900, h: 500 },
      { kind: "fridge", x: 200, y: 5200 },
      { kind: "table", x: 4300, y: 3900, w: 1600, h: 1600 },
      { kind: "sofa", x: 6800, y: 4300, w: 1800, h: 800 },
    ],
    dims: [
      { label: "9.00 m", x1: 0, y1: 0, x2: 9000, y2: 0, side: "n" },
      { label: "8.41 m", x1: 9000, y1: 0, x2: 9000, y2: 8410, side: "e" },
    ],
  },
  br3: {
    code: "3-bed",
    title: "Family Gable · 3BR / 1BA",
    interiorM2: 54,
    widthMm: 9000,
    depthMm: 7800,
    note: "54 m² excluding porch. Master with bath, two further bedrooms, kitchen, living, south porch.",
    rooms: [
      { id: "ba", label: "Bath", x: 0, y: 0, w: 2500, h: 1850 },
      { id: "ms", label: "Master", x: 0, y: 1850, w: 2500, h: 4150 },
      { id: "kt", label: "Kitchen", x: 2500, y: 0, w: 3000, h: 1850 },
      { id: "lv", label: "Living / dining", x: 2500, y: 1850, w: 3000, h: 2750 },
      { id: "pr", label: "Porch", x: 2500, y: 4600, w: 3000, h: 1400, porch: true },
      { id: "br2", label: "Bedroom 2", x: 5500, y: 0, w: 3500, h: 3000 },
      { id: "br3", label: "Bedroom 3", x: 5500, y: 3000, w: 3500, h: 3000 },
    ],
    fixtures: [
      { kind: "toilet", x: 350, y: 350 },
      { kind: "shower", x: 1300, y: 280, w: 1000, h: 1350 },
      { kind: "lav", x: 400, y: 1100 },
      { kind: "bed", x: 280, y: 3100, w: 1940, h: 1600 },
      { kind: "cooktop", x: 2700, y: 280 },
      { kind: "sink", x: 3450, y: 250, w: 900, h: 500 },
      { kind: "fridge", x: 5000, y: 280 },
      { kind: "table", x: 3100, y: 2500, w: 1800, h: 1400 },
      { kind: "twin", x: 5750, y: 350, w: 1000, h: 2000 },
      { kind: "twin", x: 7750, y: 350, w: 1000, h: 2000 },
      { kind: "bed", x: 5900, y: 3550, w: 2000, h: 1600 },
      { kind: "desk", x: 8100, y: 4300, w: 700, h: 1200 },
    ],
    dims: [
      { label: "9.00 m", x1: 0, y1: 0, x2: 9000, y2: 0, side: "n" },
      { label: "6.00 m int.", x1: 9000, y1: 0, x2: 9000, y2: 6000, side: "e" },
    ],
  },
};
