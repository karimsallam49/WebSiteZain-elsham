import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../Hooks/useFetch";
import { useAppSelector } from "../../Hooks/hooks";
import type { ProductDTO, ProductListResponse } from "../../DTO/ProductsDTO";
import V2ProductRow from "./V2ProductRow";
import { toProductArray } from "../../utils/productList";
import { ProductModal } from "../ProductsDetails/ProductModal";

interface Props {
  title: string;
  url: string;
  limit?: number;
  /** استبعد منتجات بـ offer_source معين — مثلًا "happy_hour" عشان ميتكررش مع سكشن ساعة السعادة */
  excludeOfferSource?: "happy_hour" | "product";
}

const V2ProductSection = ({ title, url, limit = 6, excludeOfferSource }: Props) => {
  const { t } = useTranslation();
  const { currentLanguage } = useAppSelector((state) => state.LanguageSlice);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(
    null
  );

  const { data, isLoading } = useFetch<ProductListResponse>(
    currentLanguage === "ar" ? "ar" : "en",
    url
  );

  const products = toProductArray(data?.products).filter(
    (p) =>
      p.status === 1 &&
      (!excludeOfferSource || p.offer_source !== excludeOfferSource)
  );

  const openProduct = (p: ProductDTO) => {
    setSelectedProduct(p);
    setShowModal(true);
  };

  if (!isLoading && products.length === 0) return null;

  return (
    <>
      <div className="v2-rail-head">
        <h2 className="v2-rail-title">{title}</h2>
      </div>

      <div className="v2-menu-list">
        {isLoading && (
          <div className="v2-loading-row">{t("v2.loadingDishes")}</div>
        )}
        {products.slice(0, limit).map((product) => (
          <V2ProductRow
            key={product.id}
            product={product}
            onOpen={openProduct}
          />
        ))}
      </div>

      {showModal && selectedProduct && (
        <ProductModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          product={selectedProduct}
        />
      )}
    </>
  );
};

export default V2ProductSection;
