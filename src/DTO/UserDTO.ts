// 👤 UserDTO
export interface UserDTO {
  id: number;
  f_name: string;
  l_name: string;
  email: string;
  user_type: string | null;
  is_active: number;
  image: string | null;
  is_phone_verified: number;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  email_verification_token: string | null;
  phone: string;
  cm_firebase_token: string | null;
  point: number;
  temporary_token: string | null;
  login_medium: "OTP" | "password" | string | null;
  wallet_balance: string;
  refer_code: string;
  refer_by: string | null;
  login_hit_count: number;
  is_temp_blocked: number;
  temp_block_time: string | null;
  language_code: string;
  orders_count: number;
  wishlist_count: number;
  referral_customer_details: any | null;
  location:string;
}
