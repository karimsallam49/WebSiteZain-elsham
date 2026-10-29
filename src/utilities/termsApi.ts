import axios from "axios";
import {
  termsRandomUrl,
  termsCategoriesUrl,
} from "../EndPoints/EndPoints";
import type {
  RandomMealFilters,
  RandomProductResponse,
  TermCategoriesResponse,
} from "../DTO/TermsDTO";

interface RequestMeta {
  branchId: number | string | null;
  lang: "ar" | "en";
  servingType?: string;
}

const headers = ({ branchId, lang }: RequestMeta) => ({
  "Branch-id": branchId ?? "",
  "x-localization": lang ?? "en",
});

export const fetchRandomMeal = async (
  filters: RandomMealFilters,
  meta: RequestMeta
): Promise<RandomProductResponse> => {
  const res = await axios.get(termsRandomUrl, {
    headers: headers(meta),
    params: {
      serving_type: meta.servingType ?? "takeaway",
      branch_id: meta.branchId ?? undefined,
      ...Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined)
      ),
    },
  });
  return res.data;
};

export const fetchTermCategories = async (
  meta: RequestMeta
): Promise<TermCategoriesResponse> => {
  const res = await axios.get(termsCategoriesUrl, {
    headers: headers(meta),
    params: {
      serving_type: meta.servingType ?? "takeaway",
      branch_id: meta.branchId ?? undefined,
    },
  });
  return res.data;
};

// "2026-10-31 10:15:00" → Date
const parseServerTime = (serverTime: string): number => {
  const normalized = serverTime.replace(" ", "T");
  const t = new Date(normalized).getTime();
  return Number.isNaN(t) ? Date.now() : t;
};

// الفرق بين ساعة السيرفر وساعة الجهاز — للـ countdowns
export const serverClockOffset = (serverTime: string): number =>
  parseServerTime(serverTime) - Date.now();

// يحسب كام دقيقة فاضلة على معاد معين بالنسبة لساعة السيرفر
export const minutesUntil = (targetIso: string, offset: number): number => {
  const target = parseServerTime(targetIso);
  return Math.max(0, Math.round((target - (Date.now() + offset)) / 60000));
};
