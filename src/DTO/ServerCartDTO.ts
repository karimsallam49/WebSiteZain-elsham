export interface ServerCartAddonDTO {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface ServerCartPrizeDTO {
  id?: number;
  prize_type?: string;
  label?: string;
  status?: string;
  expires_at?: string | null;
  eligible?: boolean;
  /** ليه الجايزة مش مستحقة لسه — يتعرض للعميل */
  reason?: string | null;
  hint?: string;
  remaining_to_unlock?: number;
}

export interface ServerCartItemDTO {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string | null;
  quantity: number;
  variations: any[];
  resolved_variations: any[];
  add_on_ids: number[];
  add_on_qtys: number[];
  addons: ServerCartAddonDTO[];
  unit_price: number;
  discount_per_unit: number;
  tax_per_unit: number;
  final_unit_price: number;
  addons_total: number;
  addons_tax: number;
  line_total: number;
  available: boolean;
  reason: string | null;
  available_stock: number | null;
  is_prize_item: boolean;
  /** الصف ميتصرفش — ممنوع update/remove من الباك إند */
  locked?: boolean;
  /** صف عرضي فقط — مش بيتشحن وميتحسبش في التوتال */
  display_only?: boolean;
  free: boolean;
  original_line_total?: number;
  original_final_unit_price?: number;
  prize: ServerCartPrizeDTO | null;
}

export interface ServerCartDiscountsDTO {
  coupon: number;
  coupon_type: string | null;
  coupon_error: string | null;
  referral: number;
  first_order: number;
  loyalty: number;
  loyalty_error: string | null;
  spin_prize: number;
  spin_free_product: number;
  spin_free_delivery: boolean;
  total: number;
}

export interface PendingPrizeDTO {
  id: number;
  type: string;
  label: string;
  product_id: number | null;
  product_name: string | null;
  coupon_code: string | null;
  min_order_amount: number | null;
  order_type: string | null;
  eligible: boolean;
  note: string | null;
  expires_at: string | null;
}

export interface OfferPickDTO {
  type: string;
  prize_id?: number;
  coupon_id?: number;
}

export interface OfferChoiceDTO {
  required: boolean;
  options: OfferPickDTO[][];
}

export interface OfferConflictDTO {
  offer: string;
  blocked_by?: string[];
  choice_required?: boolean;
  pick?: OfferPickDTO;
  message?: string;
}

export interface ServerCartResponse {
  items: ServerCartItemDTO[];
  item_count: number;
  subtotal: number;
  total_tax: number;
  discounts: ServerCartDiscountsDTO;
  payable_total: number;
  order_type: string;
  branch_id: number;
  pending_prizes: PendingPrizeDTO[];
  /** العروض المطبّقة فعلًا — `auto` بتفرّق اللي اتطبّق لوحده عن اللي العميل اختاره */
  applied_offers?: Array<{ label?: string; name?: string; auto?: boolean; type?: string } & Record<string, unknown>>;
  /** عروض كانت مطبّقة واتشالت — بتشرح للعميل إيه اللي اتلغى وليه */
  dropped_offers?: Array<{ label?: string; name?: string; reason?: string; message?: string } & Record<string, unknown>>;
  applied_offer?: any;
  spin_prizes?: any[];
  offer_choice?: OfferChoiceDTO | null;
  offer_conflicts?: OfferConflictDTO[] | null;
}
