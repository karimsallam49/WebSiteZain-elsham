export type GetCategoriesProductDTO= {
  total_size: number;
  limit: string;
  offset: string;
  products: Product[];
}
export type Product= {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  variations: Variation[];
  add_ons: AddOn[];
  tax: number;
  available_time_starts: string;
  available_time_ends: string;
  status: number;
  created_at: string;
  updated_at: string;
  attributes: any[];
  category_ids: CategoryId[];
  choice_options: any[]; 
  discount: number;
  discount_type: "percent" | "amount";
  tax_type: "percent" | "amount";
  set_menu: number;
  branch_id: number;
  colors: string | null;
  popularity_count: number;
  product_type: string;
  is_recommended: number;
  branch_product: BranchProduct;
  rating: any[]; 
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
export type CategoryId ={
  id: string;
  position: number;
}
export type BranchProduct= {
  id: number;
  product_id: number;
  price: number;
  discount_type: "percent" | "amount";
  discount: number;
  branch_id: number;
  is_available: number;
  variations: Variation[];
  created_at: string;
  updated_at: string;
  stock_type: "unlimited" | "limited";
  stock: number;
  sold_quantity: number;
  halal_status: number;
}

export type Variation = any;
