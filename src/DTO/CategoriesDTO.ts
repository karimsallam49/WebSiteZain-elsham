export type Category = {
  id: number;
  name: string;
  parent_id: number;
  position: number;
  status: number;
  priority: number;
  created_at: string;
  updated_at: string;
  image: string;
  image_full_path :string;
  ar_img_full_path:string;
  banner_image_full_path :string;
  banner_image: string;
  childes: Category[]; 
  translations: any[]; 
}

export type CategoryListResponse = {
  total_size: number;
  limit: string;
  offset: string;
  categories: Category[];
}
