/** 10% of shell list only — KDK’s default ceiling without raising the published list. */
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

/**
 * KDK’s campaign net is 90% of the published shell list (the 10% default).
 * ≤10%: the share comes out of that list. KDK invoices less if the rate is higher, down to 90%.
 * >10%: the list has to rise so KDK still invoices the 90% net. Government / distributor
 * extra is not a deeper KDK discount.
 */
export function heldNetShare(publishedList: number, wantedRate: number) {
  const rate = clampCommission(wantedRate);
  const kdkFloor = publishedList * (1 - DEFAULT_COMMISSION);
  if (rate <= DEFAULT_COMMISSION) {
    const kdkNet = publishedList * (1 - rate);
    return {
      rate,
      overDefault: false,
      publishedList,
      sellingList: publishedList,
      listUplift: 0,
      kdkNet,
      share: publishedList - kdkNet,
    };
  }
  const sellingList = kdkFloor / (1 - rate);
  return {
    rate,
    overDefault: true,
    publishedList,
    sellingList,
    listUplift: sellingList - publishedList,
    kdkNet: kdkFloor,
    share: sellingList - kdkFloor,
  };
}