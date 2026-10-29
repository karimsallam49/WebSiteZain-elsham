import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../Hooks/useFetch";
import { useAppSelector } from "../../Hooks/hooks";
import { GeOrderDetailsUrl, TrackordersUrl } from "../../EndPoints/EndPoints";
import type { OrderDetailsDTO, OrderListResponse } from "../../DTO/OrderDTO";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import V2ProductRail from "./V2ProductRail";

/**
 * "أطلب تاني" — منتجات آخر أوردرات العميل المسجل.
 * مبيظهرش للـ guest — محتاج OTPToken.
 */
const V2OrderAgain = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useAppSelector((state) => state.LanguageSlice);
  const { OTPToken } = useAppSelector((state) => state.OTPauthconfigration);
  const lang = currentLanguage === "ar" ? "ar" : "en";

  const { data: ordersData } = useFetch<OrderListResponse>(
    lang,
    `${GeOrderDetailsUrl}?limit=3&offset=1`,
    { enabled: !!OTPToken },
    OTPToken ?? "null"
  );

  const lastOrderId = ordersData?.orders?.[0]?.id;

  const { data: orderDetails } = useFetch<OrderDetailsDTO>(
    lang,
    `${TrackordersUrl}track?order_id=${lastOrderId}`,
    { enabled: !!OTPToken && !!lastOrderId },
    OTPToken ?? "null"
  );

  const products = useMemo(() => {
    const seen = new Set<number>();
    const list: ProductDTO[] = [];
    for (const item of orderDetails?.details ?? []) {
      const p = item?.product_details;
      if (p && !seen.has(p.id)) {
        seen.add(p.id);
        list.push(p);
      }
    }
    return list;
  }, [orderDetails]);

  if (!OTPToken || products.length === 0) return null;

  return <V2ProductRail title={t("v2.orderAgain")} products={products} />;
};

export default V2OrderAgain;
