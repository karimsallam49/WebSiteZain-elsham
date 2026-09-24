// CreateOrderDTO.ts

import type { AddressDTO } from "./AdressDTO";

export interface CreateOrderAddressDTO {
  id: number;
  address_type: string;
  contact_person_number: string;
  address: string;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  _method: string | null;
  contact_person_name: string;
  road: string | null;
  floor: string | null;
  house: string | null;
}

export interface CreateOrderCartItemDTO {
  product_id: string;          
  price: string;
  variant: any[];              
  variations: any[];
  discount_amount: number;
  quantity: number;
  tax_amount: number;
  add_on_ids: number[];       
  add_on_qtys: number[];      
}

export interface PlaceOrderDTO {
  cart: CreateOrderCartItemDTO[];
  coupon_discount_amount: number;
  coupon_discount_title: string;
  order_amount: number;
  order_type: "delivery" | "take_away" | "dine_in";
  delivery_address_id: number | null;
  payment_method: string;
  payment_platform?: string;
  order_note: string;
  coupon_code: string;
  delivery_time: string;      
  delivery_date: string;      
  branch_id: number;
  distance: number;
  selected_delivery_area: number;
  delivery_address: AddressDTO|null;
  is_partial: "0" | "1";
  is_cutlery_required: "0" | "1";
  bring_change_amount: number;
}
export type OrderResponse = {
  message: string;
  order_id: string;
  payment_required?: boolean;
  payment_url?: string;
};