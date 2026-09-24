export interface AddressDTO {
  id: number | null; 
  address_type: string; 
  contact_person_number: string; 
  address: string; 
  latitude: string; 
  longitude: string; 
  is_guest: number,
  created_at: string | null; 
  updated_at: string | null; 
  user_id: number | null; 
  _method?: string | null; 
  contact_person_name: string; 
  road?: string | null; 
  floor?: string | null; 
  house?: string | null;
  is_default:any
}