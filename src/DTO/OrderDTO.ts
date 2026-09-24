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
