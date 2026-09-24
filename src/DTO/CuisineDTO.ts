export interface CuisineDTO {
  id: number;
  name: string;
  image: string;
  is_active: number;
  priority: number;
  created_at: string; 
  updated_at: string;
  sub_title: string;
  is_featured: number;
  translations: any[];
}
