export type ScheduleTime = {
  day: number;
  opening_time: string;
  closing_time: string;
}

export type LocationCoverage ={
  longitude: string;
  latitude: string;
  coverage: number;
}

export type BaseUrls= {
  product_image_url: string;
  customer_image_url: string;
  banner_image_url: string;
  category_image_url: string;
  category_banner_image_url: string;
  review_image_url: string;
  notification_image_url: string;
  restaurant_image_url: string;
  delivery_man_image_url: string;
  chat_image_url: string;
  promotional_url: string;
  kitchen_image_url: string;
  branch_image_url: string;
  gateway_image_url: string;
  payment_image_url: string;
  cuisine_image_url: string;
}

export type DeliveryManagement ={
  status: number;
  min_shipping_charge: number;
  shipping_per_km: number;
}

export type Branch= {
  id: number;
  name: string;
  email: string;
  longitude: string;
  latitude: string;
  address: string;
  coverage: number;
  status: number;
  image: string;
  cover_image: string;
  preparation_time: number;
}

export interface PromotionCampaign extends Branch {
  restaurant_id: number | null;
  password: string;
  created_at: string;
  updated_at: string;
  remember_token: string | null;
  phone: string;
  branch_promotion_status: number;
  branch_promotion: any[];
}

export type AppStoreConfig ={
  status: boolean;
  link: string;
  min_version: string;
}

export type SocialLogin ={
  google: number;
  facebook: number;
}

export type WhatsappConfig ={
  status: number;
  number: string;
}

export type CookiesManagement= {
  status: number;
  text: string;
}

export type DigitalPaymentInfo= {
  digital_payment: string;
  plugin_payment_gateways: string;
  default_payment_gateways: string;
}

export type AppleLogin= {
  login_medium: string;
  status: number;
  client_id: string;
}

export type CustomerVerification= {
  status: number;
  phone: number;
  email: number;
  firebase: number;
}

export type LoginOption ={
  manual_login: number;
  otp_login: number;
  social_media_login: number;
}

export type SocialMediaLoginOptions= {
  google: number;
  facebook: number;
  apple: number;
}

export type CustomerLogin= {
  login_option: LoginOption;
  social_media_login_options: SocialMediaLoginOptions;
}

export type AdvanceMaintenanceMode= {
  maintenance_status: number;
  selected_maintenance_system: {
    branch_panel: number;
    customer_app: number;
    web_app: number;
    deliveryman_app: number;
  };
  maintenance_messages: {
    business_number: number;
    business_email: number;
    maintenance_message: string;
    message_body: string;
  };
  maintenance_type_and_duration: {
    maintenance_duration: string;
    start_date: string | null;
    end_date: string | null;
  };
}

export type RestaurantDTO ={
  restaurant_name: string;
  restaurant_phone: string;
  restaurant_open_time: string | null;
  restaurant_close_time: string | null;
  restaurant_schedule_time: ScheduleTime[];
  restaurant_logo: string;
  restaurant_address: string;
  restaurant_email: string;
  restaurant_location_coverage: LocationCoverage;
  minimum_order_value: number;
  base_urls: BaseUrls;
  currency_symbol: string;
  delivery_charge: number;
  delivery_management: DeliveryManagement;
  branches: Branch[];
  email_verification: boolean;
  phone_verification: boolean;
  currency_symbol_position: string;
  country: string;
  self_pickup: boolean;
  delivery: boolean;
  play_store_config: AppStoreConfig;
  app_store_config: AppStoreConfig;
  social_media_link: any[];
  software_version: string;
  decimal_point_settings: number;
  schedule_order_slot_duration: number;
  time_format: string;
  promotion_campaign: PromotionCampaign[];
  social_login: SocialLogin;
  wallet_status: number;
  loyalty_point_status: number;
  ref_earning_status: number;
  loyalty_point_item_purchase_point: number;
  loyalty_point_exchange_rate: number;
  loyalty_point_minimum_point: number;
  customer_referred_discount_status: number;
  customer_referred_discount_type: string;
  customer_referred_discount_amount: number;
  customer_referred_validity_type: string;
  customer_referred_validity_value: number;
  whatsapp: WhatsappConfig;
  cookies_management: CookiesManagement;
  toggle_dm_registration: number;
  is_veg_non_veg_active: number;
  otp_resend_time: number;
  digital_payment_info: DigitalPaymentInfo;
  digital_payment_status: number;
  active_payment_method_list: any[];
  cash_on_delivery: string;
  digital_payment: string;
  offline_payment: string;
  guest_checkout: number;
  partial_payment: number;
  partial_payment_combine_with: string;
  add_fund_to_wallet: number;
  apple_login: AppleLogin;
  cutlery_status: number;
  firebase_otp_verification_status: number;
  customer_verification: CustomerVerification;
  footer_copyright_text: string;
  footer_description_text: string;
  customer_login: CustomerLogin;
  google_map_status: number;
  maintenance_mode: boolean;
  advance_maintenance_mode: AdvanceMaintenanceMode;
  halal_tag_status: number;
}
