import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X } from "lucide-react";
import type { ProductDTO, ProductListResponse } from "../../DTO/ProductsDTO";
import { GetProductByNameAPI } from "../../EndPoints/EndPoints";
import { useAppSelector } from "../../Hooks/hooks";
import { usePost } from "../../Hooks/UsePost";
import V2ProductRow from "../../Components/V2/V2ProductRow";
import { ProductModal } from "../../Components/ProductsDetails/ProductModal";
import "../HomePageV2/v2.css";
import "./SearchResalutage.css";

const LIMIT = 10;

const SearchResalutage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { search } = useLocation();
  const initialQuery = decodeURIComponent(
    new URLSearchParams(search).get("query") || ""
  );
  const { currentLanguage } = useAppSelector((state) => state.LanguageSlice);
  const lang = currentLanguage === "ar" ? "ar" : "en";

  const [term, setTerm] = useState(initialQuery);
  const [debounced, setDebounced] = useState(initialQuery);
  const [offset, setOffset] = useState(1);
  const [items, setItems] = useState<ProductDTO[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(
    null
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const api = `${GetProductByNameAPI}?limit=${LIMIT}&offset=${offset}`;
  const { mutate, isPending } = usePost<ProductListResponse, object>(lang, api);

  // debounce على الكتابة — نستنى 400ms قبل ما نبعت request
  useEffect(() => {
    const id = setTimeout(() => setDebounced(term.trim()), 400);
    return () => clearTimeout(id);
  }, [term]);

  // نخلي الـ query في الـ URL عشان الصفحة تفضل قابلة للمشاركة/الرجوع
  useEffect(() => {
    const q = debounced ? `?query=${encodeURIComponent(debounced)}` : "";
    navigate(`/search${q}`, { replace: true });
  }, [debounced, navigate]);

  // reset لما الكلمة أو اللغة تتغير
  useEffect(() => {
    setOffset(1);
    setItems([]);
    setTotalSize(0);
  }, [debounced, lang]);

  // fetch — بيتنادى أول مرة ولما الـ offset يزيد
  useEffect(() => {
    if (!debounced) return;
    mutate(
      { name: debounced, is_halal: 0 },
      {
        onSuccess: (res) => {
          setTotalSize(res.total_size ?? 0);
          setItems((prev) => {
            const ids = new Set(prev.map((p) => p.id));
            const fresh = (res.products ?? []).filter((p) => !ids.has(p.id));
            return offset === 1 ? res.products ?? [] : [...prev, ...fresh];
          });
        },
      }
    );
  }, [debounced, offset, lang, mutate]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const hasMore = items.length < totalSize;

  // infinite scroll على مستوى الصفحة كلها
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isPending) {
          setOffset((o) => o + 1);
        }
      },
      { rootMargin: "320px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isPending]);

  const openProduct = (p: ProductDTO) => {
    setSelectedProduct(p);
    setShowModal(true);
  };

  return (
    <div className="v2-inner v2-search-page">
      <div className="v2-search-bar">
        <button
          type="button"
          className="v2-icon-btn v2-back-btn"
          aria-label={t("v2.backToSite")}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
        </button>
        <div className="v2-search">
          <Search size={16} color="var(--v2-gold)" />
          <input
            ref={inputRef}
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder={t("v2.searchPlaceholder")}
            aria-label={t("mobile_header.search")}
          />
          {term && (
            <button
              type="button"
              className="v2-clear-btn"
              aria-label="clear"
              onClick={() => setTerm("")}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {!debounced ? (
        <div className="v2-search-empty">
          <Search size={40} strokeWidth={1.2} />
          <p>{t("v2.typeToSearch")}</p>
        </div>
      ) : (
        <>
          <h2 className="v2-search-title">
            {t("Search-results")} "{debounced}"
          </h2>
          <div className="v2-menu-list">
            {items.map((product) => (
              <V2ProductRow
                key={product.id}
                product={product}
                onOpen={openProduct}
              />
            ))}

            {isPending && items.length === 0 && (
              <div className="v2-loading-row">{t("v2.loadingDishes")}</div>
            )}

            {!isPending && items.length === 0 && (
              <div className="v2-search-empty">
                <p>{t("v2.noResults")}</p>
              </div>
            )}

            {hasMore && (
              <div ref={sentinelRef} className="v2-loading-row">
                {isPending ? t("v2.loadingDishes") : ""}
              </div>
            )}
          </div>
        </>
      )}

      {showModal && selectedProduct && (
        <ProductModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default SearchResalutage;
