export interface StaticPagesResponse {
  return_page: StaticPage;
  refund_page: StaticPage;
  cancellation_page: StaticPage;
  terms_and_conditions: string;
  privacy_policy: string;
  about_us: string;
}

export interface StaticPage {
  status: number;
  content: string;
}
