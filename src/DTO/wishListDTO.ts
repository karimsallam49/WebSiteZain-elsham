import type { ProductDTO } from "./ProductsDTO";

export interface CategoryIdDTO {
  id: string;
  position: number;
}


export interface BranchProductDTO {
  id: number;
  product_id: number;
  price: number;
  discount_type: string;
  discount: number;
  branch_id: number;
  is_available: number;
  variations: any[]; 
  created_at: string;
  updated_at: string;
  stock_type: string;
  stock: number;
  sold_quantity: number;
  halal_status: number;
}




export interface wishListDTO {
  total_size: number;
  limit: number;
  offset: number;
  products: ProductDTO[];
}
