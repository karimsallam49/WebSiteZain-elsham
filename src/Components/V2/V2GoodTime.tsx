import { useEffect, useState } from "react";
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
  pageSize?: number;
}

const PAGE_SIZE = 8;

/* سكشن منتجات paginated — صفوف زي Offers + زرار Load more بيحمل الصفحات التالية */
const V2GoodTime = ({ title, url, pageSize = PAGE_SIZE }: Props) => {
  const { t } = useTranslation();
  const { currentLanguage } = useAppSelector((state) => state.LanguageSlice);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<ProductDTO[]>([]);
  const [exhausted, setExhausted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<ProductDTO | null>(null);

  const { data, isLoading } = useFetch<ProductListResponse>(
    currentLanguage === "ar" ? "ar" : "en",
    `${url}?offset=${page}&limit=${pageSize}`
  );

  useEffect(() => {
    // الـAPI بيرجّع products أحيانًا كـ object بمفاتيح رقمية مش array
    const list = toProductArray(data?.products);
    if (list.length === 0) return;
    setItems((prev) => {
      const seen = new Set(prev.map((p) => p.id));
      const fresh = list.filter(
        (p) => p.status === 1 && !seen.has(p.id)
      );
      // الـ API مرجّعش منتجات جديدة → مفيش صفحات تانية فعليًا
      if (prev.length > 0 && fresh.length === 0) setExhausted(true);
      return [...prev, ...fresh];
    });
  }, [data]);

  const total = Number(data?.total_size ?? 0);
  const hasMore = !exhausted && items.length < total;

  if (!isLoading && items.length === 0) return null;

  return (
    <>
      <div className="v2-rail-head">
        <h2 className="v2-rail-title">{title}</h2>
      </div>

      <div className="v2-menu-list">
        {items.map((product) => (
          <V2ProductRow
            key={product.id}
            product={product}
            onOpen={(p) => {
              setSelected(p);
              setShowModal(true);
            }}
          />
        ))}
        {isLoading && (
          <div
            className="v2-loading-row"
            style={
              items.length === 0
                ? { minHeight: pageSize * 96, alignItems: "flex-start" }
                : undefined
            }
          >
            {t("v2.loadingDishes")}
          </div>
        )}
      </div>

      {hasMore && (
        <button
          type="button"
          className="v2-view-all"
          disabled={isLoading}
          onClick={() => setPage((p) => p + 1)}
        >
          {t("v2.loadMore")}
        </button>
      )}

      {showModal && selected && (
        <ProductModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          product={selected}
        />
      )}
    </>
  );
};

export default V2GoodTime;
