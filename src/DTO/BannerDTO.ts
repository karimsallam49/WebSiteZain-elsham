import type { ProductDTO } from "./ProductsDTO";

export interface BannerDTO {
  id: number;
  title: string;
  image_url: string;
  image_ar_url: string | null;
  product_id: number | null;
  category_id: number | null;
  dimension_type: "mobile" | "desktop" | string;
  banner_type: "ads" | string;
  status: number;
  created_at: string;
  updated_at: string;
  product: ProductDTO | null;
}



export interface BranchProductDTO {
  id: number;
  product_id: number;
  price: number;
  discount_type: "percent" | "amount" | string;
  discount: number;
  branch_id: number;
  is_available: number;
  variations: any[];
  created_at: string;
  updated_at: string;
  stock_type: "unlimited" | "limited" | string;
  stock: number;
  sold_quantity: number;
  halal_status: number;
}

export interface CategoryPositionDTO {
  id: string;
  position: number;
}
