export const getItemVariationsTotal = (item: any): number =>
  (item?.variations ?? []).reduce(
    (sum: number, v: any) => sum + (Number(v?.optionPrice) || 0),
    0
  );

export const getItemAddonsTotal = (item: any): number =>
  (item?.selected_addons ?? []).reduce(
    (sum: number, addon: any) =>
      sum + (Number(addon?.price) || 0) * (Number(addon?.qty) || 1),
    0
  );

export const getItemUnitPrice = (item: any): number =>
  (Number(item?.price) || 0) +
  getItemVariationsTotal(item) +
  getItemAddonsTotal(item);
