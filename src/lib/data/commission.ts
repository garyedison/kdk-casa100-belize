/** Belize set-aside / licensed-distributor commission on the shell list only. */
export const DEFAULT_COMMISSION = 0.1;
export const COMMISSION_PRESETS = [0.05, 0.1, 0.15, 0.2] as const;
export const COMMISSION_MIN = 0;
export const COMMISSION_MAX = 0.25;

export function clampCommission(n?: number) {
  if (n == null || !Number.isFinite(n)) return DEFAULT_COMMISSION;
  return Math.min(COMMISSION_MAX, Math.max(COMMISSION_MIN, Math.round(n * 100) / 100));
}

export function pctLabel(rate: number) {
  return `${Math.round(rate * 100)}%`;
}
