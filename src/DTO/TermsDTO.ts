import type { ProductDTO } from "./ProductsDTO";

export interface TermDTO {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  is_open_now: boolean;
  products_count?: number;
  products?: ProductDTO[];
}

export interface NextTermDTO {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  opens_at: string;
}

export interface RandomMealFilters {
  is_diet?: 0 | 1;
  is_spicy?: 0 | 1;
  max_calories?: number;
  category_id?: number;
}

export interface RandomProductResponse {
  term: TermDTO | null;
  product: ProductDTO | null;
  filters: RandomMealFilters;
  next_term: NextTermDTO | null;
  server_time: string;
}

export interface TermCategoryDTO {
  id: number;
  name: string;
  image: string | null;
  banner_image: string | null;
  parent_id: number;
  position: number;
  product_ids: number[];
  products_count: number;
}

export interface TermCategoriesResponse {
  term: TermDTO | null;
  categories: TermCategoryDTO[];
  next_term: NextTermDTO | null;
  server_time: string;
}

export interface TermsListResponse {
  terms: TermDTO[];
  server_time: string;
}
