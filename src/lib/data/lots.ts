import { GRID, STYLES, type Mix, type StyleId } from "./homes";

export type Lot = {
  id: number;
  row: number;
  col: number;
  label: string;
  styleId: StyleId;
  /** World X (east) in meters, lot centre. */
  x: number;
  /** World Z (south) in meters, lot centre. */
  z: number;
};

export const LOT_M = 31.62;
export const ROAD_M = 7.5;
export const PAD_M = 22;
export const CELL = LOT_M + ROAD_M;

export function worldOriginOffset() {
  const span = GRID * CELL - ROAD_M;
  return span / 2 - LOT_M / 2;
}

/**
 * Cluster the mix into neighbourhoods so the plat reads as a plan, not a random
 * sprinkle: north = 1-bed workforce, centre = 2-bed, south = 3-bed, with a
 * checker of 2-beds along the avenues.
 */
export function buildLots(mix: Mix): Lot[] {
  const remaining: StyleId[] = [
    ...Array(mix.br1).fill("br1"),
    ...Array(mix.br2).fill("br2"),
    ...Array(mix.br3).fill("br3"),
  ];
  const origin = worldOriginOffset();
  const lots: Lot[] = [];
  let n = 0;

  const pick = (prefer: StyleId[]): StyleId => {
    for (const p of prefer) {
      const i = remaining.indexOf(p);
      if (i >= 0) {
        remaining.splice(i, 1);
        return p;
      }
    }
    return remaining.shift() ?? "br2";
  };

  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      n += 1;
      let prefer: StyleId[];
      if (row <= 2) prefer = ["br1", "br2", "br3"];
      else if (row >= 7) prefer = ["br3", "br2", "br1"];
      else prefer = ["br2", "br3", "br1"];
      // Keep avenues mixed so the 3D model does not look banded.
      if ((row + col) % 5 === 0) prefer = ["br2", "br1", "br3"];
      const styleId = pick(prefer);
      lots.push({
        id: n,
        row,
        col,
        label: `Lot ${n}`,
        styleId,
        x: col * CELL - origin,
        z: row * CELL - origin,
      });
    }
  }
  return lots;
}

export function styleOf(lot: Lot) {
  return STYLES[lot.styleId];
}

export function countsFromLots(lots: Lot[]) {
  return lots.reduce(
    (acc, l) => {
      acc[l.styleId] += 1;
      return acc;
    },
    { br1: 0, br2: 0, br3: 0 } as Mix,
  );
}
