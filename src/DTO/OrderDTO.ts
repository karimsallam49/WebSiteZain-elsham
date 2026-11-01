import type { AddressDTO } from "./AdressDTO"
import type { PlaceOrderDTO } from "./CheckouDTO"
import type { ProductDTO } from "./ProductsDTO"
import type { UserDTO } from "./UserDTO"

export type OrderDetalsDTO={
    order_id: string,
    phone: string
}

export type OrderDetailsIntial={
  OrderDetailsData:PlaceOrderDTO|null,
  loading:boolean,
  error:string|null

}




export interface OrderListResponse {
  total_size: number;
  limit: string;
  offset: string;
  orders: Order[];
}
export interface Order {
  id: number;
  user_id: number;
  is_guest: number;
  order_amount: number;
  coupon_discount_amount: number;
  coupon_discount_title: string | null;
  payment_status: string;
  order_status: string;
  total_tax_amount: number;
  payment_method: string;
  transaction_reference: string | null;
  delivery_address_id: number;
  created_at: string;
  updated_at: string;
  checked: number;
  delivery_man_id: number | null;
  delivery_charge: number;
  order_note: string | null;
  coupon_code: string | null;
  order_type: string;
  branch_id: number;
  callback: string | null;
  delivery_date: string;
  delivery_time: string;
  extra_discount: string;
  delivery_address: AddressDTO;
  preparation_time: number;
  table_id: number | null;
  number_of_people: number | null;
  table_order_id: number | null;
  is_cutlery_required: number;
  bring_change_amount: number;
  bucket_config: any[];
  free_inclusions_config: any | null;
  referral_discount: number;
  details_count: number;
  total_quantity: string;
  deliveryman_review_count: number;
  is_product_available: number;
  product_images: string[];
  customer: UserDTO;
  delivery_man: any | null;

  /* ----- حقول الـ API الجديدة ----- */
  is_partial?: number;
  payable_total?: number;
  spin_prize_discount?: number | string;
  spin_free_delivery?: number;
  wallet_refunded?: number;
  first_order_discount_amount?: number | string;
  loyalty_discount_amount?: number | string;
  loyalty_points_earned?: number;
  loyalty_points_redeemed?: number;
  applied_offer?: {
    type: "spin_win" | "coupon" | "referral" | "first_order" | null;
    prize_type?: "free_product" | "discount_percent" | "discount_fixed" | "free_delivery" | null;
    label?: string;
    product_id?: number;
    product_name?: string;
    discount?: number;
    free_delivery?: boolean;
  } | null;
  discounts?: {
    coupon: number;
    coupon_type: string | null;
    extra: number;
    referral: number;
    loyalty: number;
    first_order: number;
    spin_prize: number;
    product_level: {
      happy_hour: number;
      product: number;
      global_offer: number;
    };
    total: number;
  };
  totals?: {
    items_subtotal: number;
    line_discounts: number;
    order_discounts: number;
    tax: number;
    delivery_charge: number;
    grand_total: number;
  };
  loyalty?: {
    earned: number;
    redeemed: number;
    discount_amount: number;
  };
  spin_prizes?: {
    id: number;
    type: string;
    label: string;
    value: number;
    product_id?: number;
    product_name?: string;
    source?: string;
  }[];
  order_partial_payments?: {
    paid_with: string;
    paid_amount: number;
    due_amount: number;
  }[];
}

export interface OrderDetailsDTO extends Order {
  table_id: number | null;
  branch: BranchDTO;
  details: OrderedProductDTO[];
}

export interface BranchDTO {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string | null;
  latitude: string;
  longitude: string;
  opening_time: string;
  closing_time: string;
}

export interface OrderedProductDTO {
  id: number;
  product_id: number;
  order_id: number;
  price: number;
  product_details: ProductDTO;
  variation: any[];
  discount_on_product: number;
  discount_source?: "product" | "happy_hour" | "global_offer" | null;
  discount_type: string;
  quantity: number;
  tax_amount: number;
  created_at: string;
  updated_at: string;
  add_on_ids: number[];
  variant: any[];
  add_on_qtys: number[];
  add_on_taxes: number[];
  add_on_prices: number[];
  add_on_tax_amount: number;
  reviews_count: number;
  is_product_available: number;
}



export interface TranslationDTO {
  id: number;
  locale: string;
  key: string;
  value: string;
}
