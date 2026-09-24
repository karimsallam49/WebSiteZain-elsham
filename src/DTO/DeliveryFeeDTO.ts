export interface DeliveryChargeByAreaDTO {
  id: number;
  branch_id: number;
  area_name: string;
  delivery_charge: number;
  created_at: string;
  updated_at: string;
}

export interface DeliveryChargeSetupDTO {
  id: number;
  branch_id: number;
  delivery_charge_type: "area" | "distance" | "fixed";
  delivery_charge_per_kilometer: number;
  fixed_delivery_charge: number;
  free_delivery_over_amount: number;
  free_delivery_over_status: 0 | 1;
  minimum_delivery_charge: number;
  minimum_distance_for_free_delivery: number;
  created_at: string;
  updated_at: string;
}

export interface BranchDeliveryChargeResponse {
  id: number;
  name: string;
  status: number;
  delivery_charge_setup: DeliveryChargeSetupDTO;
  delivery_charge_by_area: DeliveryChargeByAreaDTO[];
}
