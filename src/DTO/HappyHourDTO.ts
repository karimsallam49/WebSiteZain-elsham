// GET /api/v1/config/happy-hours
// السيرفر بيحسب الخصم على أسعار المنتجات — الفرونت بيعرض بس (countdown + badges)

export interface HappyHourSlot {
  id: number;
  title: string | null;
  /** "17:00" */
  start_time: string;
  /** "19:00" */
  end_time: string;
  discount: number;
  discount_type: "percent" | "amount" | string;
  /** true لو السيرفر جوه الفترة دلوقتي */
  is_live: boolean;
  product_ids: number[];
}

export interface HappyHoursResponse {
  slots: HappyHourSlot[];
  /** "2026-10-28 14:35:00" — الساعة المعتمدة للـ countdown */
  server_time: string;
}
