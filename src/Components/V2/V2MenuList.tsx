import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "../../Hooks/useFetch";
import { useAppSelector } from "../../Hooks/hooks";
import {
  GetCategoriesProductUrl,
  latestProductUrl,
} from "../../EndPoints/EndPoints";
import type { ProductDTO, ProductListResponse } from "../../DTO/ProductsDTO";
import type { Category } from "../../DTO/CategoriesDTO";
import V2ProductRow from "./V2ProductRow";
import { ProductModal } from "../ProductsDetails/ProductModal";

const LIMIT = 10;

interface Props {
  category: Category | null;
}

const V2MenuList = ({ category }: Props) => {
  const { t } = useTranslation();
  const { currentLanguage } = useAppSelector((state) => state.LanguageSlice);

  const [offset, setOffset] = useState(1);
  const [items, setItems] = useState<ProductDTO[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(
    null
  );

  const url = useMemo(
    () =>
      category
        ? `${GetCategoriesProductUrl}${category.id}?offset=${offset}&limit=${LIMIT}&product_type=all`
        : `${latestProductUrl}?limit=${LIMIT}&offset=${offset}&sort_by=default_type`,
    [category, offset]
  );

  const { data, isLoading, isFetching } = useFetch<ProductListResponse>(
    currentLanguage === "ar" ? "ar" : "en",
    url
  );

  // إعادة الضبط لما القسم أو اللغة يتغيروا
  useEffect(() => {
    setOffset(1);
    setItems([]);
  }, [category, currentLanguage]);

  useEffect(() => {
    if (!data?.products?.length) return;
    setItems((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const fresh = data.products.filter((p) => !existingIds.has(p.id));
      return offset === 1 ? data.products : [...prev, ...fresh];
    });
  }, [data, offset]);

  const totalSize = data?.total_size ?? 0;
  const hasMore = items.length < totalSize;

  const openProduct = (p: ProductDTO) => {
    setSelectedProduct(p);
    setShowModal(true);
  };

  return (
    <>
      <div className="v2-menu-list">
        {items.map((product) => (
          <V2ProductRow
            key={product.id}
            product={product}
            onOpen={openProduct}
          />
        ))}

        {isLoading && items.length === 0 && (
          <div className="v2-loading-row">{t("v2.loadingDishes")}</div>
        )}

        {hasMore && (
          <div className="v2-loadmore-wrap">
            <button
              type="button"
              className="v2-loadmore"
              disabled={isFetching}
              onClick={() => setOffset((o) => o + 1)}
            >
              {isFetching ? t("v2.loadingDishes") : t("v2.viewAll")}
            </button>
          </div>
        )}

        {!hasMore && items.length > LIMIT && (
          <p className="v2-end-note">— {t("v2.endOfMenu")} —</p>
        )}
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

export default V2MenuList;
