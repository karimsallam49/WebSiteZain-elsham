export interface BranchDTO {
  id: number;
  restaurant_id: number | null;
  name: string;
  email: string;
  password: string;
  latitude: string;
  longitude: string;
  address: string;
  status: number;
  branch_promotion_status: number;
  created_at: string;
  updated_at: string;
  coverage: number;
  remember_token: string | null;
  image: string;
  phone: string;
  cover_image: string;
  preparation_time: number;
  header_image: string;
  background_image: string;
}
