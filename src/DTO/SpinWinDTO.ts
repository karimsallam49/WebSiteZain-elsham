// GET /api/v1/customer/spin-and-win/* — عجلة الحظ
// السيرفر بيختار الفائز — الفرونت بيحرّك العجلة على winning_index دايمًا

export interface SpinSegment {
  index: number;
  id: number;
  label: string;
  label_ar?: string;
  color: string | null;
  icon: string | null;
  /** points | coupon | free_delivery | product | nothing */
  type: string;
}

export interface SpinsInfo {
  daily_remaining: number;
  balance: number;
  total: number;
}

export interface SpinPendingPrize {
  id: number;
  /** points | discount_percent | discount_fixed | free_delivery | free_product */
  type: string;
  label: string;
  value: number | null;
  product_id?: number | null;
  product_name?: string | null;
  coupon_code?: string | null;
  min_order_amount?: number | null;
  order_type?: string | null;
  expires_at?: string | null;
  source?: string;
}

export interface SpinConfigResponse {
  is_active: boolean;
  segments: SpinSegment[];
  spins: SpinsInfo;
  points_cost_per_spin: number;
  pending_prizes: SpinPendingPrize[];
  server_time: string;
}

export interface SpinResultResponse {
  winning_index: number;
  segment: SpinSegment;
  prize: {
    /** points | discount_percent | discount_fixed | free_delivery | free_product | null */
    type: string | null;
    label: string;
    value?: number;
    user_prize_id?: number;
    points_won?: number;
    expires_at?: string | null;
  } | null;
  spins: SpinsInfo;
  pending_prizes: SpinPendingPrize[];
}
