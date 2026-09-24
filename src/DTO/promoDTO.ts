export type DiscountType = "percent" | "amount";
export type CouponType = "default" | "first_order" | "seasonal" | string;

export interface CouponDTO {
  id: number;
  title: string;
  code: string;
  start_date: string;
  expire_date: string;
  min_purchase: number;
  max_discount: number;
  discount: number;
  discount_type: DiscountType;
  status: 0 | 1;
  created_at: string;
  updated_at: string;
  coupon_type: CouponType;
  limit: number;
}
export interface CouponData {
  id: number;
  title: string;
  code: string;
  start_date: string;      
  expire_date: string;      
  min_purchase: number;
  max_discount: number;
  discount: number;
  discount_type: "percent" | "amount" | string;
  status: number;
  created_at: string;
  updated_at: string;
  coupon_type: string;
  limit: number;
}

export interface CouponResponse {
  available: CouponData[];
  unavailable: CouponData[];
}