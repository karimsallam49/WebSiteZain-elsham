import { useTranslation } from "react-i18next";
import { useFetch } from "../../Hooks/useFetch";
import { useAppSelector } from "../../Hooks/hooks";
import { OrderAgainUrl } from "../../EndPoints/EndPoints";
import type { ProductListResponse } from "../../DTO/ProductsDTO";
import V2ProductRail from "./V2ProductRail";
import { toProductArray } from "../../utils/productList";

/**
 * "أطلب تاني" — أكتر منتجات العميل طلبها مرتّبة بالكمية.
 * GET api/v1/customer/order-again — auth required.
 * عميل من غير أوردرات → products: [] → السكشن بيتخفى.
 */
const V2OrderAgain = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useAppSelector((state) => state.LanguageSlice);
  const { OTPToken } = useAppSelector((state) => state.OTPauthconfigration);
  const lang = currentLanguage === "ar" ? "ar" : "en";

  const { data } = useFetch<ProductListResponse>(
    lang,
    `${OrderAgainUrl}?limit=10`,
    { enabled: !!OTPToken },
    OTPToken ?? "null"
  );

  const products = toProductArray(data?.products).filter(
    (p) => p.status === 1
  );

  if (!OTPToken || products.length === 0) return null;

  return <V2ProductRail title={t("v2.orderAgain")} products={products} />;
};

export default V2OrderAgain;
