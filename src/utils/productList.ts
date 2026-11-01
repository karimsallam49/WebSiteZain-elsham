import type { ProductDTO } from "../DTO/ProductsDTO";

/**
 * الـAPI أحيانًا بيرجّع products كـ array وأحيانًا كـ object
 * بمفاتيح رقمية (collection متسلسل غلط) — بيحوّلها لـ array صافية
 * وبيستبعد المفاتيح الزيادة زي discount/final_price.
 */
export const toProductArray = (raw: unknown): ProductDTO[] => {
  if (Array.isArray(raw)) return raw.filter((p) => p && (p as any).id);
  if (raw && typeof raw === "object") {
    return (Object.values(raw) as any[]).filter(
      (v) => v && typeof v === "object" && v.id
    );
  }
  return [];
};
