import type { BranchProductDTO, CategoryPositionDTO } from "./BannerDTO";


export interface ProductDTO {
  id: number;
  name: string;
  description: string | null;
  image: string;
  price: number;
  selected_addons?:[],
  variations: ProductVariationDTO[];
  add_ons: any[];
   add_on_ids:[],
   add_on_qtys:[],
   bucket_variants:[],
  tax: number;
  available_time_starts: string;
  available_time_ends: string;
  status: number;
  calories:number;
  created_at: string;
  updated_at: string;
  attributes: any[];
  category_ids: CategoryPositionDTO[];
  choice_options: any[];
  discount: number;
  discount_type: "percent" | "amount" | string;
  tax_type: "percent" | "amount" | string;
  set_menu: number;
  is_bucket: boolean;
  piece_qty: number;
  free_inclusions: string | null;
  branch_id: number;
  colors: string | null;
  popularity_count: number;
  product_type: "veg" | "non_veg" | string;
  is_recommended: number;
  rating: any[];
  branch_product: BranchProductDTO | null;
  translations: any[];
}

export type AddOn ={
  id: number;
  name: string;
  price: number;
  tax: number;
  created_at: string;
  updated_at: string;
  translations: any[];
}

export type CategoryId = {
  id: string;
  position: number;
}

export type BranchProduct ={
  id: number;
  product_id: number;
  price: number;
  discount_type: 'percent' | 'flat' | string;
  discount: number;
  branch_id: number;
  is_available: number;
  variations: any[];
  created_at: string;
  updated_at: string;
  stock_type: 'unlimited' | 'limited' | string;
  stock: number;
  sold_quantity: number;
  halal_status: number;
}
export type ProductListResponse= {
  total_size: number;
  limit: string;
  offset: string;
  products: ProductDTO[];
}
export interface ProductVariationValueDTO {
  label: string;               
  ar_label: string;              
  optionPrice: string;          
  image: string | null;          
  imageFullPath: string | null;  
}

export interface ProductVariationDTO {
  name: string;                         
  ar_name: string;                      
  type: "single" | "multiple";          
  min: number;                        
  max: number;                          
  required: "on" | "off";               
  values: ProductVariationValueDTO[];   
}